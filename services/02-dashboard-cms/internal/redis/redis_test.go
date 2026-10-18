package redis

import (
	"context"
	"testing"
	"time"
)

func newTestInMemoryClient() *Client {
	return &Client{
		Rdb:           nil, // In-memory mode
		memSessions:   make(map[string]*SessionData),
		memBlacklist:  make(map[string]time.Time),
		memRateLimits: make(map[string]int),
		memTopViews:   make(map[string]map[string]float64),
		memCache:      make(map[string]cacheItem),
	}
}

func TestRedis_NilClientSafety(t *testing.T) {
	var c *Client = nil
	ctx := context.Background()

	// All methods must be nil-safe without panicking
	if err := c.RecordTopView(ctx, "t1", "/test"); err != nil {
		t.Errorf("expected nil error, got %v", err)
	}

	items, err := c.GetTopViews(ctx, "t1", 5)
	if err != nil || len(items) == 0 {
		t.Errorf("expected default top views on nil client, got %v, items: %d", err, len(items))
	}

	if err := c.BlacklistToken(ctx, "hash1", time.Hour); err != nil {
		t.Errorf("expected nil error on blacklist, got %v", err)
	}

	if c.IsTokenBlacklisted(ctx, "hash1") {
		t.Errorf("expected false on nil client blacklist check")
	}

	if !c.AllowRequest(ctx, "ip1", 10, time.Minute) {
		t.Errorf("expected true for AllowRequest on nil client")
	}

	sess := &SessionData{SessionID: "s1"}
	if err := c.SaveSession(ctx, sess, time.Hour); err != nil {
		t.Errorf("expected nil error on SaveSession, got %v", err)
	}

	if s, err := c.GetSession(ctx, "s1"); err == nil || s != nil {
		t.Errorf("expected error on nil client GetSession")
	}

	if err := c.DeleteSession(ctx, "s1"); err != nil {
		t.Errorf("expected nil error on DeleteSession, got %v", err)
	}

	if err := c.SetJSON(ctx, "k1", map[string]string{"foo": "bar"}, time.Minute); err != nil {
		t.Errorf("expected nil error on SetJSON, got %v", err)
	}

	var target map[string]string
	hit, err := c.GetJSON(ctx, "k1", &target)
	if hit || err != nil {
		t.Errorf("expected hit=false, err=nil on nil client GetJSON")
	}

	if err := c.DeleteKey(ctx, "k1"); err != nil {
		t.Errorf("expected nil error on DeleteKey, got %v", err)
	}

	if err := c.DeleteKeysByPrefix(ctx, "k"); err != nil {
		t.Errorf("expected nil error on DeleteKeysByPrefix, got %v", err)
	}
}

func TestRedis_TopViews(t *testing.T) {
	c := newTestInMemoryClient()
	ctx := context.Background()

	_ = c.RecordTopView(ctx, "t-alpha", "/home")
	_ = c.RecordTopView(ctx, "t-alpha", "/home")
	_ = c.RecordTopView(ctx, "t-alpha", "/pricing")

	items, err := c.GetTopViews(ctx, "t-alpha", 10)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(items) != 2 {
		t.Fatalf("expected 2 items, got %d", len(items))
	}

	foundHome := false
	for _, it := range items {
		if it.Path == "/home" {
			foundHome = true
			if it.Score != 2 {
				t.Errorf("expected /home score 2, got %f", it.Score)
			}
		}
	}
	if !foundHome {
		t.Errorf("expected /home in top views")
	}

	// Empty tenant should return default mock items
	defaultItems, err := c.GetTopViews(ctx, "t-unknown", 5)
	if err != nil || len(defaultItems) == 0 {
		t.Errorf("expected default items for unknown tenant")
	}
}

func TestRedis_BlacklistToken(t *testing.T) {
	c := newTestInMemoryClient()
	ctx := context.Background()

	tokenHash := "abcdef123456"
	if c.IsTokenBlacklisted(ctx, tokenHash) {
		t.Fatalf("expected token not to be blacklisted initially")
	}

	err := c.BlacklistToken(ctx, tokenHash, 100*time.Millisecond)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !c.IsTokenBlacklisted(ctx, tokenHash) {
		t.Errorf("expected token to be blacklisted")
	}

	// Wait for expiration
	time.Sleep(150 * time.Millisecond)
	if c.IsTokenBlacklisted(ctx, tokenHash) {
		t.Errorf("expected token to expire from blacklist")
	}
}

func TestRedis_RateLimiting(t *testing.T) {
	c := newTestInMemoryClient()
	ctx := context.Background()

	key := "test-ip-123"
	maxRequests := 3

	for i := 1; i <= maxRequests; i++ {
		if !c.AllowRequest(ctx, key, maxRequests, time.Minute) {
			t.Errorf("request %d should have been allowed", i)
		}
	}

	// Next request must be rejected
	if c.AllowRequest(ctx, key, maxRequests, time.Minute) {
		t.Errorf("request above maxRequests should have been rejected")
	}
}

func TestRedis_SessionManagement(t *testing.T) {
	c := newTestInMemoryClient()
	ctx := context.Background()

	sess := &SessionData{
		SessionID: "sess_test_123",
		UserID:    "u_1",
		TenantID:  "t_1",
		Email:     "test@herocms.com",
		Role:      "customer",
	}

	// Save session
	err := c.SaveSession(ctx, sess, 500*time.Millisecond)
	if err != nil {
		t.Fatalf("SaveSession error: %v", err)
	}

	// Retrieve session
	retrieved, err := c.GetSession(ctx, "sess_test_123")
	if err != nil {
		t.Fatalf("GetSession failed: %v", err)
	}
	if retrieved.Email != "test@herocms.com" {
		t.Errorf("expected email %q, got %q", "test@herocms.com", retrieved.Email)
	}

	// Delete session
	err = c.DeleteSession(ctx, "sess_test_123")
	if err != nil {
		t.Fatalf("DeleteSession failed: %v", err)
	}

	_, err = c.GetSession(ctx, "sess_test_123")
	if err == nil {
		t.Errorf("expected error after session deletion, got nil")
	}
}

func TestRedis_JSONCache(t *testing.T) {
	c := newTestInMemoryClient()
	ctx := context.Background()

	type MockPayload struct {
		Title string `json:"title"`
		Views int    `json:"views"`
	}

	original := MockPayload{Title: "Enterprise Architecture", Views: 42}
	key := "test:cache:doc1"

	err := c.SetJSON(ctx, key, original, 500*time.Millisecond)
	if err != nil {
		t.Fatalf("SetJSON error: %v", err)
	}

	var cached MockPayload
	hit, err := c.GetJSON(ctx, key, &cached)
	if err != nil || !hit {
		t.Fatalf("GetJSON expected hit=true, got hit=%v, err=%v", hit, err)
	}
	if cached.Title != original.Title || cached.Views != original.Views {
		t.Errorf("cached content mismatch: %+v vs %+v", cached, original)
	}

	// Test DeleteKeysByPrefix
	_ = c.SetJSON(ctx, "tenant:t1:menu:a", "data_a", time.Hour)
	_ = c.SetJSON(ctx, "tenant:t1:menu:b", "data_b", time.Hour)
	_ = c.SetJSON(ctx, "tenant:t2:menu:c", "data_c", time.Hour)

	err = c.DeleteKeysByPrefix(ctx, "tenant:t1:menu:")
	if err != nil {
		t.Fatalf("DeleteKeysByPrefix failed: %v", err)
	}

	var dummy string
	hitA, _ := c.GetJSON(ctx, "tenant:t1:menu:a", &dummy)
	hitB, _ := c.GetJSON(ctx, "tenant:t1:menu:b", &dummy)
	hitC, _ := c.GetJSON(ctx, "tenant:t2:menu:c", &dummy)

	if hitA || hitB {
		t.Errorf("expected keys with prefix to be deleted")
	}
	if !hitC {
		t.Errorf("expected key with different prefix to remain")
	}
}
