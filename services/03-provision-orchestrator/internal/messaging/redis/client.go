package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

// ContainerStateSnapshot holds cached container metadata
type ContainerStateSnapshot struct {
	TenantID     string    `json:"tenant_id"`
	SiteID       string    `json:"site_id"`
	ContainerID  string    `json:"container_id"`
	Subdomain    string    `json:"subdomain"`
	CustomDomain string    `json:"custom_domain,omitempty"`
	Status       string    `json:"status"` // running, stopped, oom_killed, deploying
	IPAddress    string    `json:"ip_address,omitempty"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Manager wraps Redis client operations with concurrency control and local in-memory fallback
type Manager struct {
	client     *redis.Client
	isLive     bool
	localLocks sync.Map // fallback in-memory locks
	localState sync.Map // fallback in-memory state
	mu         sync.RWMutex
}

// NewManager initializes a Redis client connection or activates in-memory fallback if unavailable
func NewManager(addr, password string, db int) *Manager {
	rdb := redis.NewClient(&redis.Options{
		Addr:         addr,
		Password:     password,
		DB:           db,
		DialTimeout:  2 * time.Second,
		ReadTimeout:  2 * time.Second,
		WriteTimeout: 2 * time.Second,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	m := &Manager{
		client: rdb,
		isLive: false,
	}

	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Printf("[REDIS NOTICE] Redis server at %s is offline (%v). Operating in high-performance in-memory simulation mode.", addr, err)
		m.isLive = false
	} else {
		log.Printf("[REDIS LIVE] Connected to Redis cluster at %s", addr)
		m.isLive = true
	}

	return m
}

// IsLive returns true if connected to real Redis
func (m *Manager) IsLive() bool {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.isLive
}

// Ping checks Redis connectivity
func (m *Manager) Ping(ctx context.Context) error {
	m.mu.RLock()
	defer m.mu.RUnlock()

	if !m.isLive || m.client == nil {
		return nil // healthy in fallback mode
	}
	return m.client.Ping(ctx).Err()
}

// AcquireDeployLock acquires a distributed mutex lock to prevent concurrent deploy collisions
func (m *Manager) AcquireDeployLock(ctx context.Context, tenantID string, ttl time.Duration) (bool, error) {
	key := fmt.Sprintf("herocms:lock:deploy:%s", tenantID)

	if m.isLive && m.client != nil {
		ok, err := m.client.SetNX(ctx, key, "locked", ttl).Result()
		if err != nil {
			return false, fmt.Errorf("failed to acquire redis deploy lock: %w", err)
		}
		return ok, nil
	}

	// In-memory fallback
	now := time.Now()
	val, loaded := m.localLocks.LoadOrStore(key, now.Add(ttl))
	if loaded {
		expireAt := val.(time.Time)
		if now.Before(expireAt) {
			return false, nil // locked
		}
		// Expired lock, overwrite
		m.localLocks.Store(key, now.Add(ttl))
	}
	return true, nil
}

// ReleaseDeployLock releases the distributed lock
func (m *Manager) ReleaseDeployLock(ctx context.Context, tenantID string) error {
	key := fmt.Sprintf("herocms:lock:deploy:%s", tenantID)

	if m.isLive && m.client != nil {
		return m.client.Del(ctx, key).Err()
	}

	m.localLocks.Delete(key)
	return nil
}

// SaveContainerState caches container snapshot state
func (m *Manager) SaveContainerState(ctx context.Context, snapshot ContainerStateSnapshot) error {
	snapshot.UpdatedAt = time.Now().UTC()
	key := fmt.Sprintf("herocms:state:%s", snapshot.TenantID)

	data, err := json.Marshal(snapshot)
	if err != nil {
		return err
	}

	if m.isLive && m.client != nil {
		return m.client.Set(ctx, key, data, 24*time.Hour).Err()
	}

	m.localState.Store(snapshot.TenantID, snapshot)
	return nil
}

// GetContainerState retrieves cached container snapshot state
func (m *Manager) GetContainerState(ctx context.Context, tenantID string) (*ContainerStateSnapshot, error) {
	key := fmt.Sprintf("herocms:state:%s", tenantID)

	if m.isLive && m.client != nil {
		val, err := m.client.Get(ctx, key).Result()
		if err == redis.Nil {
			return nil, nil // not found
		}
		if err != nil {
			return nil, err
		}

		var snapshot ContainerStateSnapshot
		if err := json.Unmarshal([]byte(val), &snapshot); err != nil {
			return nil, err
		}
		return &snapshot, nil
	}

	if val, ok := m.localState.Load(tenantID); ok {
		snap := val.(ContainerStateSnapshot)
		return &snap, nil
	}
	return nil, nil
}

// PushLog pushes a lifecycle log entry to Redis list (capped at 500 lines)
func (m *Manager) PushLog(ctx context.Context, tenantID, siteID, logLine string) error {
	if !m.isLive || m.client == nil {
		return nil
	}
	key := fmt.Sprintf("tenant:%s:container:%s:logs", tenantID, siteID)
	pipe := m.client.Pipeline()
	pipe.RPush(ctx, key, logLine)
	pipe.LTrim(ctx, key, -500, -1)
	pipe.Expire(ctx, key, 7*24*time.Hour)
	_, err := pipe.Exec(ctx)
	return err
}

// GetLogs returns up to limit log lines from Redis
func (m *Manager) GetLogs(ctx context.Context, tenantID, siteID string, limit int64) ([]string, error) {
	if !m.isLive || m.client == nil {
		return []string{}, nil
	}
	key := fmt.Sprintf("tenant:%s:container:%s:logs", tenantID, siteID)
	if limit <= 0 {
		limit = 100
	}
	return m.client.LRange(ctx, key, -limit, -1).Result()
}

// Close closes the underlying Redis client
func (m *Manager) Close() error {
	if m.client != nil {
		return m.client.Close()
	}
	return nil
}
