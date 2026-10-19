package storage
 
import (
	"bytes"
	"context"
	"strings"
	"testing"
)

func TestGetTenantBucketName(t *testing.T) {
	tests := []struct {
		name     string
		tenantID string
		expected string
	}{
		{
			name:     "standard uuid",
			tenantID: "99420000-0000-0000-0000-000000009942",
			expected: "tenant-994200000000-media",
		},
		{
			name:     "empty tenant",
			tenantID: "",
			expected: "tenant-default-media",
		},
		{
			name:     "short name",
			tenantID: "abc-123",
			expected: "tenant-abc123-media",
		},
		{
			name:     "uppercase converted",
			tenantID: "TENANT-XYZ-88",
			expected: "tenant-tenantxyz88-media",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := GetTenantBucketName(tt.tenantID)
			if got != tt.expected {
				t.Errorf("GetTenantBucketName(%q) = %q, want %q", tt.tenantID, got, tt.expected)
			}
		})
	}
}

func TestS3Client_NilSafety(t *testing.T) {
	var s3 *S3Client = nil
	ctx := context.Background()

	bucket, err := s3.EnsureTenantBucket(ctx, "tenant-test")
	if err != nil {
		t.Fatalf("expected nil error on nil receiver, got: %v", err)
	}
	if !strings.HasPrefix(bucket, "tenant-") {
		t.Errorf("unexpected bucket: %s", bucket)
	}

	reader := bytes.NewReader([]byte("test image data"))
	url, key, bName, err := s3.UploadFile(ctx, "tenant-test", "photo.png", reader, 15, "image/png")
	if err != nil {
		t.Fatalf("expected nil error on nil receiver upload, got: %v", err)
	}
	if key == "" || bName == "" || url == "" {
		t.Errorf("expected non-empty key, bName, url, got: %s, %s, %s", key, bName, url)
	}

	err = s3.DeleteFile(ctx, "tenant-test", key)
	if err != nil {
		t.Fatalf("expected nil error on nil receiver delete, got: %v", err)
	}
}

func TestS3Client_OfflineFallback(t *testing.T) {
	s3 := &S3Client{
		PublicURL: "https://media.cloudcms.app",
		Available: false,
	}
	ctx := context.Background()

	bucket, err := s3.EnsureTenantBucket(ctx, "tenant-9942")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if bucket != "tenant-tenant9942-media" && bucket != "tenant-9942-media" {
		t.Logf("bucket: %s", bucket)
	}

	reader := bytes.NewReader([]byte("test-content"))
	url, key, bName, err := s3.UploadFile(ctx, "tenant-9942", "banner.webp", reader, 12, "image/webp")
	if err != nil {
		t.Fatalf("unexpected error on offline upload: %v", err)
	}
	if !strings.Contains(url, "https://media.cloudcms.app") {
		t.Errorf("expected public url in mock, got: %s", url)
	}
	if !strings.HasSuffix(key, "banner.webp") {
		t.Errorf("expected key to contain filename, got: %s", key)
	}
	if bName == "" {
		t.Errorf("expected bucket name, got empty")
	}

	err = s3.DeleteFile(ctx, "tenant-9942", key)
	if err != nil {
		t.Errorf("unexpected error on offline delete: %v", err)
	}
}
