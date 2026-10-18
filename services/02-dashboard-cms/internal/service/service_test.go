package service

import (
	"bytes"
	"context"
	"image"
	"image/color"
	"image/png"
	"mime/multipart"
	"net/textproto"
	"testing"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/cloudcms/dashboard-cms-backend/internal/redis"
	"github.com/cloudcms/dashboard-cms-backend/internal/repository"
	"github.com/cloudcms/dashboard-cms-backend/internal/storage"
	"github.com/gin-gonic/gin"
)

func newFullTestServices() *Services {
	cfg := &config.Config{
		JWTSecret:          []byte("test_jwt_secret_32_bytes_super_secure!"),
		AllowDevAuthBypass: true,
	}
	repo := repository.NewInMemoryRepository()
	rdb := redis.NewInMemoryClient()
	s3Client := &storage.S3Client{
		PublicURL: "http://localhost:9000",
		Available: false,
	}
	return NewServices(cfg, repo, rdb, s3Client)
}

func TestAuthenticateUser_Validation(t *testing.T) {
	s := newFullTestServices()

	// Empty username & password
	_, err := s.AuthenticateUser("", "")
	if err == nil {
		t.Errorf("expected error for empty credentials, got nil")
	}

	// Empty password
	_, err = s.AuthenticateUser("admin", "")
	if err == nil {
		t.Errorf("expected error for empty password, got nil")
	}
}

func TestAuthenticateUser_DevFallback(t *testing.T) {
	s := newFullTestServices()

	// Valid dev credentials
	res, err := s.AuthenticateUser("admin", "admin")
	if err != nil {
		t.Fatalf("expected successful login for admin/admin, got %v", err)
	}

	if res.Token == "" {
		t.Errorf("expected non-empty JWT token")
	}

	userEmail, ok := res.User["email"].(string)
	if !ok || userEmail == "" {
		t.Errorf("expected valid user email in result")
	}

	// Invalid password
	_, err = s.AuthenticateUser("admin", "wrongpassword123")
	if err == nil {
		t.Errorf("expected error for wrong password, got nil")
	}
}

func TestRegisterUser(t *testing.T) {
	s := newFullTestServices()

	// Empty validation
	_, err := s.RegisterUser("", "", "")
	if err == nil {
		t.Errorf("expected error for empty register fields")
	}

	// Short password
	_, err = s.RegisterUser("John Doe", "john@example.com", "12")
	if err == nil {
		t.Errorf("expected error for short password")
	}

	// Success
	res, err := s.RegisterUser("John Doe", "john@example.com", "secret123")
	if err != nil {
		t.Fatalf("RegisterUser failed: %v", err)
	}
	if res.Token == "" {
		t.Errorf("expected token in register result")
	}
	if res.User["email"] != "john@example.com" {
		t.Errorf("expected email john@example.com, got %v", res.User["email"])
	}
}

func TestContainers_Lifecycle(t *testing.T) {
	s := newFullTestServices()
	ctx := context.Background()
	tenantID := "99420000-0000-0000-0000-000000009942"

	// 1. GetContainers
	containersRes, err := s.GetContainers(ctx, tenantID)
	if err != nil {
		t.Fatalf("GetContainers failed: %v", err)
	}
	if containersRes["containers"] == nil {
		t.Errorf("expected containers list")
	}

	// 2. CreateContainer invalid subdomain
	_, err = s.CreateContainer(ctx, tenantID, CreateContainerInput{
		Name:      "Invalid Site",
		Subdomain: "INVALID_SUBDOMAIN_UPPERCASE!",
	})
	if err == nil {
		t.Errorf("expected error for invalid subdomain regex")
	}

	// 3. CreateContainer valid
	created, err := s.CreateContainer(ctx, tenantID, CreateContainerInput{
		Name:         "My Tech Blog",
		Subdomain:    "mytechblog",
		Category:     "blog",
		Role:         "Writer",
		TemplateName: "Editorial Media & Blog",
		AccentColor:  "#3b82f6",
		BioIntro:     "Welcome to tech blog",
	})
	if err != nil {
		t.Fatalf("CreateContainer failed: %v", err)
	}
	containerID := created["id"].(string)

	// 4. Start / Stop / SaveSiteDesign / Delete
	ok, err := s.StopContainer(ctx, tenantID, containerID)
	if !ok || err != nil {
		t.Errorf("StopContainer failed: %v", err)
	}

	ok, err = s.StartContainer(ctx, tenantID, containerID)
	if !ok || err != nil {
		t.Errorf("StartContainer failed: %v", err)
	}

	err = s.SaveSiteDesign(ctx, tenantID, containerID, gin.H{
		"roleOrHeadline": "Lead Technical Author",
		"accentColor":    "#10b981",
	})
	if err != nil {
		t.Errorf("SaveSiteDesign failed: %v", err)
	}

	ok, err = s.DeleteContainer(ctx, tenantID, containerID)
	if !ok || err != nil {
		t.Errorf("DeleteContainer failed: %v", err)
	}
}

func TestArticles_Service(t *testing.T) {
	s := newFullTestServices()
	ctx := context.Background()
	tenantID := "99420000-0000-0000-0000-000000009942"

	articles := s.GetArticles(ctx, tenantID)
	if len(articles) == 0 {
		t.Errorf("expected seeded articles")
	}
}

func TestAssets_UploadAndStorage(t *testing.T) {
	s := newFullTestServices()
	ctx := context.Background()
	tenantID := "99420000-0000-0000-0000-000000009942"

	// 1. Prohibited Extensions
	prohibitedFiles := []string{"malware.exe", "backdoor.php", "script.sh", "payload.phar", "trojan.bat"}
	for _, filename := range prohibitedFiles {
		header := &multipart.FileHeader{
			Filename: filename,
			Size:     1024,
			Header:   make(textproto.MIMEHeader),
		}

		_, err := s.UploadAsset(ctx, tenantID, header)
		if err == nil {
			t.Errorf("expected security block for prohibited file %q, but upload succeeded", filename)
		}
	}

	// 2. Magic Bytes Content Sniffing with disguised shell script
	maliciousContent := []byte("#!/bin/bash\necho 'attacking system'\nrm -rf /")
	var b bytes.Buffer
	w := multipart.NewWriter(&b)
	part, _ := w.CreateFormFile("file", "fake_image.jpg")
	_, _ = part.Write(maliciousContent)
	_ = w.Close()

	reader := multipart.NewReader(&b, w.Boundary())
	form, _ := reader.ReadForm(1024 * 1024)
	_, err := s.UploadAsset(ctx, tenantID, form.File["file"][0])
	if err == nil {
		t.Fatalf("expected shell script disguised as .jpg to be rejected")
	}

	// 3. Valid PNG Upload
	img := image.NewRGBA(image.Rect(0, 0, 10, 10))
	img.Set(0, 0, color.RGBA{R: 255, G: 0, B: 0, A: 255})
	var imgBuf bytes.Buffer
	_ = png.Encode(&imgBuf, img)

	var validB bytes.Buffer
	validW := multipart.NewWriter(&validB)
	validPart, _ := validW.CreateFormFile("file", "test_banner.png")
	_, _ = validPart.Write(imgBuf.Bytes())
	_ = validW.Close()

	validReader := multipart.NewReader(&validB, validW.Boundary())
	validForm, _ := validReader.ReadForm(1024 * 1024)
	uploadedAsset, err := s.UploadAsset(ctx, tenantID, validForm.File["file"][0])
	if err != nil {
		t.Fatalf("UploadAsset failed for valid PNG: %v", err)
	}

	if uploadedAsset["name"] != "test_banner.png" {
		t.Errorf("expected test_banner.png, got %v", uploadedAsset["name"])
	}

	// 4. GetAssets
	assetsData := s.GetAssets(ctx, tenantID)
	if assetsData["assets"] == nil {
		t.Errorf("expected assets in response")
	}

	// 5. DeleteAsset
	assetID := uploadedAsset["id"].(string)
	err = s.DeleteAsset(ctx, tenantID, assetID)
	if err != nil {
		t.Errorf("DeleteAsset failed: %v", err)
	}
}

func TestDomains_Service(t *testing.T) {
	s := newFullTestServices()
	ctx := context.Background()
	tenantID := "99420000-0000-0000-0000-000000009942"

	domains := s.GetDomains(ctx, tenantID)
	if len(domains) == 0 {
		t.Errorf("expected seeded domains")
	}
}

func TestTickets_Service(t *testing.T) {
	s := newFullTestServices()
	ctx := context.Background()
	tenantID := "99420000-0000-0000-0000-000000009942"

	tickets := s.GetTickets(ctx, tenantID)
	if len(tickets) == 0 {
		t.Errorf("expected seeded tickets")
	}

	created, err := s.CreateTicket(ctx, tenantID, CreateTicketInput{
		Subject:    "Database latency question",
		Category:   "Database",
		Priority:   "p1_urgent",
		Message:    "We noticed high query latencies",
		AuthorName: "Rizal",
		AuthorRole: "Admin",
	})
	if err != nil {
		t.Fatalf("CreateTicket failed: %v", err)
	}
	ticketID := created["id"].(string)

	msg, err := s.AddTicketMessage(ctx, tenantID, ticketID, TicketReplyInput{
		Message:    "We have optimized the indexes.",
		AuthorName: "Support Tech",
		AuthorRole: "Support Engineer",
		Sender:     "support",
	})
	if err != nil {
		t.Fatalf("AddTicketMessage failed: %v", err)
	}
	if msg["message"] != "We have optimized the indexes." {
		t.Errorf("unexpected message response")
	}

	err = s.ResolveTicket(ctx, tenantID, ticketID)
	if err != nil {
		t.Errorf("ResolveTicket failed: %v", err)
	}

	msgs := s.GetTicketMessages(ctx, ticketID)
	if len(msgs) == 0 {
		t.Errorf("expected ticket messages")
	}
}

func TestBillingAndCheckout(t *testing.T) {
	s := newFullTestServices()
	ctx := context.Background()
	tenantID := "99420000-0000-0000-0000-000000009942"

	invoices := s.GetInvoices(ctx, tenantID)
	if len(invoices) == 0 {
		t.Errorf("expected seeded invoices")
	}

	quota := s.GetBillingQuota(ctx, tenantID)
	if quota["plan"] == nil {
		t.Errorf("expected plan in quota")
	}

	// Checkout starter
	resStarter, err := s.ProcessCheckout(ctx, CheckoutInput{
		TenantID:      tenantID,
		PlanTier:      "starter",
		PaymentMethod: "bca_va",
	})
	if err != nil {
		t.Fatalf("ProcessCheckout starter failed: %v", err)
	}
	if resStarter["invoice"] == nil {
		t.Errorf("expected invoice in checkout response")
	}

	// Checkout agency
	resAgency, err := s.ProcessCheckout(ctx, CheckoutInput{
		TenantID:      tenantID,
		PlanTier:      "agency",
		PaymentMethod: "credit_card",
	})
	if err != nil {
		t.Fatalf("ProcessCheckout agency failed: %v", err)
	}
	if resAgency["invoice"] == nil {
		t.Errorf("expected invoice in checkout response")
	}
}

func TestWebhooksAndWarmup(t *testing.T) {
	s := newFullTestServices()
	ctx := context.Background()
	tenantID := "99420000-0000-0000-0000-000000009942"

	webhooks := s.GetWebhooks(ctx, tenantID)
	if len(webhooks) == 0 {
		t.Errorf("expected seeded webhooks")
	}

	bundle, err := s.WarmAllMenusCache(ctx, tenantID)
	if err != nil {
		t.Fatalf("WarmAllMenusCache failed: %v", err)
	}
	if bundle["containers"] == nil || bundle["articles"] == nil {
		t.Errorf("expected full menu bundle from warmup")
	}
}

func TestAnalytics_And_Drafts_And_UserState(t *testing.T) {
	s := newFullTestServices()
	ctx := context.Background()
	tenantID := "99420000-0000-0000-0000-000000009942"

	// Analytics
	_ = s.RecordHit(ctx, tenantID, "/projects")
	topViews, err := s.GetTopViews(ctx, tenantID)
	if err != nil || len(topViews) == 0 {
		t.Errorf("GetTopViews failed: %v", err)
	}

	// Drafts
	draftData := gin.H{"selectedBlock": "hero", "zoomLevel": 100}
	err = s.SaveEditorDraft(ctx, tenantID, "cont_1", draftData)
	if err != nil {
		t.Fatalf("SaveEditorDraft failed: %v", err)
	}

	retrievedDraft, err := s.GetEditorDraft(ctx, tenantID, "cont_1")
	if err != nil || retrievedDraft == nil {
		t.Fatalf("GetEditorDraft failed: %v", err)
	}
	if retrievedDraft["selectedBlock"] != "hero" {
		t.Errorf("draft mismatch: %v", retrievedDraft)
	}

	// User State
	userState := gin.H{"sidebarCollapsed": true, "theme": "bespoke-light"}
	err = s.SaveUserState(ctx, tenantID, userState)
	if err != nil {
		t.Fatalf("SaveUserState failed: %v", err)
	}

	retrievedState, err := s.GetUserState(ctx, tenantID)
	if err != nil || retrievedState == nil {
		t.Fatalf("GetUserState failed: %v", err)
	}
	if retrievedState["theme"] != "bespoke-light" {
		t.Errorf("state mismatch: %v", retrievedState)
	}

	// Revoke Session
	err = s.RevokeSession(ctx, "sample_token_hash_123")
	if err != nil {
		t.Errorf("RevokeSession failed: %v", err)
	}
}
