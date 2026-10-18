package repository

import (
	"context"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestRepository_NilSafety(t *testing.T) {
	var r *Repository = nil
	ctx := context.Background()

	sites, err := r.GetSites(ctx, "t1")
	if err != nil || len(sites) != 0 {
		t.Errorf("expected empty sites on nil repo")
	}

	if err := r.InsertSite(ctx, "t1", gin.H{"name": "test"}); err != nil {
		t.Errorf("expected nil error on nil repo InsertSite")
	}

	if err := r.UpdateSiteStatus(ctx, "t1", "s1", "running"); err != nil {
		t.Errorf("expected nil error on nil repo UpdateSiteStatus")
	}

	if err := r.UpdateSiteDesign(ctx, "t1", "s1", gin.H{}); err != nil {
		t.Errorf("expected nil error on nil repo UpdateSiteDesign")
	}

	if err := r.DeleteSite(ctx, "t1", "s1"); err != nil {
		t.Errorf("expected nil error on nil repo DeleteSite")
	}

	articles, err := r.GetArticles(ctx, "t1")
	if err != nil || len(articles) != 0 {
		t.Errorf("expected empty articles on nil repo")
	}

	usage, err := r.GetTenantStorageUsageBytes(ctx, "t1")
	if err != nil || usage != 0 {
		t.Errorf("expected 0 storage usage on nil repo")
	}

	assets, err := r.GetAssets(ctx, "t1")
	if err != nil || len(assets) != 0 {
		t.Errorf("expected empty assets on nil repo")
	}

	asset, err := r.CreateAsset(ctx, "t1", "f.png", "PNG", "image/png", "100x100", "1KB", 1024, "url", "key", "bucket")
	if err != nil || asset == nil {
		t.Errorf("expected non-nil dummy asset on nil repo")
	}

	key, err := r.DeleteAsset(ctx, "t1", "a1")
	if err != nil || key != "" {
		t.Errorf("expected empty s3key on nil repo DeleteAsset")
	}

	domains, err := r.GetDomains(ctx, "t1")
	if err != nil || len(domains) != 0 {
		t.Errorf("expected empty domains on nil repo")
	}

	tickets, err := r.GetTickets(ctx, "t1")
	if err != nil || len(tickets) != 0 {
		t.Errorf("expected empty tickets on nil repo")
	}

	msgs, err := r.GetTicketMessages(ctx, "tkt-1")
	if err != nil || len(msgs) != 0 {
		t.Errorf("expected empty messages on nil repo")
	}

	ticket, err := r.CreateTicket(ctx, "t1", "TKT-1", "Subject", "Cat", "p1", "msg", "Author", "Role")
	if err != nil || ticket == nil {
		t.Errorf("expected non-nil ticket on nil repo")
	}

	msg, err := r.AddTicketMessage(ctx, "t1", "TKT-1", "msg", "Author", "Role", "tenant")
	if err != nil || msg == nil {
		t.Errorf("expected non-nil msg on nil repo")
	}

	if err := r.ResolveTicket(ctx, "t1", "TKT-1"); err != nil {
		t.Errorf("expected nil error on nil repo ResolveTicket")
	}

	invoices, err := r.GetInvoices(ctx, "t1")
	if err != nil || len(invoices) != 0 {
		t.Errorf("expected empty invoices on nil repo")
	}

	r.AddInvoice(gin.H{"id": "inv_1"})

	webhooks, err := r.GetWebhooks(ctx, "t1")
	if err != nil || len(webhooks) != 0 {
		t.Errorf("expected empty webhooks on nil repo")
	}

	quota, err := r.GetBillingQuota(ctx, "t1")
	if err != nil || quota == nil {
		t.Errorf("expected quota on nil repo")
	}
}

func TestRepository_InMemoryLifecycle(t *testing.T) {
	repo := NewInMemoryRepository()
	ctx := context.Background()
	defaultTenantID := "99420000-0000-0000-0000-000000009942"

	// 1. Containers / Sites
	sites, err := repo.GetSites(ctx, defaultTenantID)
	if err != nil {
		t.Fatalf("GetSites error: %v", err)
	}
	if len(sites) == 0 {
		t.Fatalf("expected seeded containers in memory")
	}

	newSite := gin.H{
		"id":        "site_custom_1",
		"name":      "Unit Test Site",
		"subdomain": "test.cloudcms.app",
		"status":    "running",
	}
	err = repo.InsertSite(ctx, defaultTenantID, newSite)
	if err != nil {
		t.Fatalf("InsertSite error: %v", err)
	}

	err = repo.UpdateSiteStatus(ctx, defaultTenantID, "site_custom_1", "stopped")
	if err != nil {
		t.Fatalf("UpdateSiteStatus error: %v", err)
	}

	err = repo.UpdateSiteDesign(ctx, defaultTenantID, "site_custom_1", gin.H{
		"roleOrHeadline": "Senior Architect",
		"accentColor":    "#10b981",
	})
	if err != nil {
		t.Fatalf("UpdateSiteDesign error: %v", err)
	}

	err = repo.UpdateSiteMaintenance(ctx, defaultTenantID, "site_custom_1", true, "Perawatan berkala", "1 jam")
	if err != nil {
		t.Fatalf("UpdateSiteMaintenance on error: %v", err)
	}

	err = repo.UpdateSiteMaintenance(ctx, defaultTenantID, "site_custom_1", false, "", "")
	if err != nil {
		t.Fatalf("UpdateSiteMaintenance off error: %v", err)
	}

	err = repo.DeleteSite(ctx, defaultTenantID, "site_custom_1")
	if err != nil {
		t.Fatalf("DeleteSite error: %v", err)
	}

	// 2. Articles
	articles, err := repo.GetArticles(ctx, defaultTenantID)
	if err != nil || len(articles) == 0 {
		t.Errorf("expected seeded articles")
	}

	// 3. Assets
	asset, err := repo.CreateAsset(ctx, defaultTenantID, "avatar.png", "PNG", "image/png", "200x200", "50 KB", 51200, "https://cdn/avatar.png", "key-avatar", "tenant-media")
	if err != nil || asset == nil {
		t.Fatalf("CreateAsset failed: %v", err)
	}

	assets, err := repo.GetAssets(ctx, defaultTenantID)
	if err != nil || len(assets) == 0 {
		t.Fatalf("GetAssets failed: %v", err)
	}

	usageBytes, err := repo.GetTenantStorageUsageBytes(ctx, defaultTenantID)
	if err != nil || usageBytes <= 0 {
		t.Errorf("expected positive storage usage, got %d", usageBytes)
	}

	deletedKey, err := repo.DeleteAsset(ctx, defaultTenantID, "key-avatar")
	if err != nil || deletedKey != "key-avatar" {
		t.Errorf("DeleteAsset failed, deletedKey: %s", deletedKey)
	}

	// 4. Domains
	domains, err := repo.GetDomains(ctx, defaultTenantID)
	if err != nil || len(domains) == 0 {
		t.Errorf("expected seeded domains")
	}

	// 5. Support Tickets & Messages
	tkt, err := repo.CreateTicket(ctx, defaultTenantID, "TKT-TEST-99", "Need SSL Assistance", "Infrastructure", "high", "Please assist with domain", "User", "Admin")
	if err != nil || tkt == nil {
		t.Fatalf("CreateTicket failed: %v", err)
	}

	replyMsg, err := repo.AddTicketMessage(ctx, defaultTenantID, "TKT-TEST-99", "We are looking into it", "Support Staff", "Support", "support")
	if err != nil || replyMsg == nil {
		t.Fatalf("AddTicketMessage failed: %v", err)
	}

	err = repo.ResolveTicket(ctx, defaultTenantID, "TKT-TEST-99")
	if err != nil {
		t.Fatalf("ResolveTicket failed: %v", err)
	}

	tickets, err := repo.GetTickets(ctx, defaultTenantID)
	if err != nil || len(tickets) == 0 {
		t.Errorf("expected tickets")
	}

	// 6. Invoices & Billing Quota
	invoices, err := repo.GetInvoices(ctx, defaultTenantID)
	if err != nil || len(invoices) == 0 {
		t.Errorf("expected seeded invoices")
	}

	repo.AddInvoice(gin.H{
		"id":            "inv_new_test",
		"invoiceNumber": "INV-TEST-001",
		"amount":        149000,
	})

	quota, err := repo.GetBillingQuota(ctx, defaultTenantID)
	if err != nil || quota == nil {
		t.Errorf("GetBillingQuota failed: %v", err)
	}

	// 7. Webhooks
	webhooks, err := repo.GetWebhooks(ctx, defaultTenantID)
	if err != nil || len(webhooks) == 0 {
		t.Errorf("expected seeded webhooks")
	}
}

func TestNormalizePriorityAndStatus(t *testing.T) {
	if normalizePriority("urgent") != "p1_urgent" {
		t.Errorf("expected p1_urgent")
	}
	if normalizePriority("P2_HIGH") != "p2_high" {
		t.Errorf("expected p2_high")
	}
	if normalizePriority("something_else") != "p3_normal" {
		t.Errorf("expected p3_normal")
	}

	if normalizeStatus("resolved") != "resolved" {
		t.Errorf("expected resolved")
	}
	if normalizeStatus("selesai") != "resolved" {
		t.Errorf("expected resolved")
	}
	if normalizeStatus("in_progress") != "in_progress" {
		t.Errorf("expected in_progress")
	}
	if normalizeStatus("other") != "open" {
		t.Errorf("expected open")
	}
}
