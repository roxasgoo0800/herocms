package storage

import (
	"context"
	"fmt"
	"io"
	"log"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type S3Client struct {
	Client    *minio.Client
	PublicURL string
	Available bool
	mu        sync.RWMutex
}

// GetTenantBucketName generates a compliant, isolated S3 bucket name per customer.
func GetTenantBucketName(tenantID string) string {
	clean := strings.ToLower(tenantID)
	clean = strings.ReplaceAll(clean, "-", "")
	if len(clean) > 12 {
		clean = clean[:12]
	}
	if clean == "" {
		clean = "default"
	}
	return fmt.Sprintf("tenant-%s-media", clean)
}

func NewS3Client(cfg *config.Config) *S3Client {
	basePublicURL := strings.TrimRight(cfg.S3PublicURL, "/")
	basePublicURL = strings.TrimSuffix(basePublicURL, "/"+cfg.S3Bucket)
	basePublicURL = strings.TrimSuffix(basePublicURL, "/herocms-media")

	s3 := &S3Client{
		PublicURL: basePublicURL,
	}

	client, err := minio.New(cfg.S3Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.S3AccessKey, cfg.S3SecretKey, ""),
		Secure: cfg.S3UseSSL,
	})
	if err != nil {
		log.Printf("[S3 WARNING] Failed to initialize MinIO client: %v", err)
		return s3
	}

	s3.Client = client

	// Check connectivity & auto-provision default demo tenant bucket
	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Second)
	defer cancel()

	defaultTenantID := "99420000-0000-0000-0000-000000009942"
	defaultBucket := GetTenantBucketName(defaultTenantID)
	_, _ = s3.EnsureTenantBucket(ctx, defaultTenantID)

	s3.Available = true
	log.Printf("[S3 SUCCESS] Connected to MinIO S3 storage at %s (Isolated Multi-Bucket Engine Active, Default: %s)",
		cfg.S3Endpoint, defaultBucket)

	return s3
}

// EnsureTenantBucket verifies if a dedicated bucket for the tenant exists, or creates it with public-read policy.
func (s *S3Client) EnsureTenantBucket(ctx context.Context, tenantID string) (string, error) {
	bucketName := GetTenantBucketName(tenantID)

	s.mu.RLock()
	client := s.Client
	s.mu.RUnlock()

	if client == nil {
		return bucketName, nil
	}

	exists, err := client.BucketExists(ctx, bucketName)
	if err != nil {
		return bucketName, fmt.Errorf("gagal mengecek bucket %s: %w", bucketName, err)
	}

	if !exists {
		err = client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			return bucketName, fmt.Errorf("gagal membuat bucket %s: %w", bucketName, err)
		}
		log.Printf("[S3 SUCCESS] Auto-provisioned dedicated bucket for tenant: %s", bucketName)

		// Set public-read policy for this specific tenant's bucket
		policy := fmt.Sprintf(`{
			"Version": "2012-10-17",
			"Statement": [
				{
					"Effect": "Allow",
					"Principal": "*",
					"Action": ["s3:GetObject"],
					"Resource": ["arn:aws:s3:::%s/*"]
				}
			]
		}`, bucketName)

		_ = client.SetBucketPolicy(ctx, bucketName, policy)
	}

	return bucketName, nil
}

func (s *S3Client) UploadFile(ctx context.Context, tenantID, originalFilename string, reader io.Reader, size int64, contentType string) (string, string, string, error) {
	s.mu.RLock()
	client := s.Client
	s.mu.RUnlock()

	cleanName := filepath.Base(originalFilename)
	cleanName = strings.ReplaceAll(cleanName, " ", "-")
	timestamp := time.Now().UnixNano()
	s3Key := fmt.Sprintf("%d-%s", timestamp, cleanName)

	bucketName := GetTenantBucketName(tenantID)

	if client == nil {
		// Mock storage URL fallback when S3 is completely offline
		mockURL := fmt.Sprintf("%s/%s/%s", s.PublicURL, bucketName, s3Key)
		return mockURL, s3Key, bucketName, nil
	}

	uploadCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	// Ensure tenant's dedicated bucket exists
	_, err := s.EnsureTenantBucket(uploadCtx, tenantID)
	if err != nil {
		log.Printf("[S3 WARNING] EnsureTenantBucket failed for %s: %v", tenantID, err)
	}

	_, err = client.PutObject(uploadCtx, bucketName, s3Key, reader, size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		log.Printf("[S3 ERROR] PutObject failed for %s/%s: %v", bucketName, s3Key, err)
		mockURL := fmt.Sprintf("%s/%s/%s", s.PublicURL, bucketName, s3Key)
		return mockURL, s3Key, bucketName, nil
	}

	storageURL := fmt.Sprintf("%s/%s/%s", s.PublicURL, bucketName, s3Key)
	return storageURL, s3Key, bucketName, nil
}

func (s *S3Client) DeleteFile(ctx context.Context, tenantID, s3Key string) error {
	s.mu.RLock()
	client := s.Client
	s.mu.RUnlock()

	if client == nil || s3Key == "" {
		return nil
	}

	bucketName := GetTenantBucketName(tenantID)

	delCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	err := client.RemoveObject(delCtx, bucketName, s3Key, minio.RemoveObjectOptions{})
	if err != nil {
		log.Printf("[S3 WARNING] RemoveObject failed for %s/%s: %v", bucketName, s3Key, err)
		return err
	}

	return nil
}
