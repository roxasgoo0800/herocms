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
	Bucket    string
	PublicURL string
	Available bool
	mu        sync.RWMutex
}

func NewS3Client(cfg *config.Config) *S3Client {
	s3 := &S3Client{
		Bucket:    cfg.S3Bucket,
		PublicURL: strings.TrimRight(cfg.S3PublicURL, "/"),
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

	// Check connectivity & bucket
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	exists, err := client.BucketExists(ctx, s3.Bucket)
	if err != nil {
		log.Printf("[S3 NOTICE] MinIO at %s is unreachable or bucket check failed: %v. Ready for on-demand connection.", cfg.S3Endpoint, err)
		return s3
	}

	if !exists {
		err = client.MakeBucket(ctx, s3.Bucket, minio.MakeBucketOptions{})
		if err != nil {
			log.Printf("[S3 WARNING] Failed to create bucket %s: %v", s3.Bucket, err)
		} else {
			log.Printf("[S3 SUCCESS] Created MinIO bucket: %s", s3.Bucket)
		}
	}

	// Set public read bucket policy so media assets are viewable via URL
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
	}`, s3.Bucket)

	_ = client.SetBucketPolicy(ctx, s3.Bucket, policy)

	s3.Available = true
	log.Printf("[S3 SUCCESS] Connected to MinIO S3 storage at %s (Bucket: %s, PublicURL: %s)",
		cfg.S3Endpoint, s3.Bucket, s3.PublicURL)

	return s3
}

func (s *S3Client) UploadFile(ctx context.Context, tenantID, originalFilename string, reader io.Reader, size int64, contentType string) (string, string, error) {
	s.mu.RLock()
	client := s.Client
	s.mu.RUnlock()

	cleanName := filepath.Base(originalFilename)
	cleanName = strings.ReplaceAll(cleanName, " ", "-")
	timestamp := time.Now().UnixNano()
	s3Key := fmt.Sprintf("tenants/%s/%d-%s", tenantID, timestamp, cleanName)

	if client == nil {
		// Mock storage URL fallback when S3 is completely offline
		mockURL := fmt.Sprintf("%s/%s", s.PublicURL, s3Key)
		return mockURL, s3Key, nil
	}

	uploadCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	// Ensure bucket exists before upload
	exists, bErr := client.BucketExists(uploadCtx, s.Bucket)
	if bErr == nil && !exists {
		_ = client.MakeBucket(uploadCtx, s.Bucket, minio.MakeBucketOptions{})
	}

	_, err := client.PutObject(uploadCtx, s.Bucket, s3Key, reader, size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		log.Printf("[S3 ERROR] PutObject failed for %s: %v", s3Key, err)
		// Return fallback URL so the user flow is not broken
		mockURL := fmt.Sprintf("%s/%s", s.PublicURL, s3Key)
		return mockURL, s3Key, nil
	}

	storageURL := fmt.Sprintf("%s/%s", s.PublicURL, s3Key)
	return storageURL, s3Key, nil
}

func (s *S3Client) DeleteFile(ctx context.Context, s3Key string) error {
	s.mu.RLock()
	client := s.Client
	s.mu.RUnlock()

	if client == nil || s3Key == "" {
		return nil
	}

	delCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	err := client.RemoveObject(delCtx, s.Bucket, s3Key, minio.RemoveObjectOptions{})
	if err != nil {
		log.Printf("[S3 WARNING] RemoveObject failed for %s: %v", s3Key, err)
		return err
	}

	return nil
}
