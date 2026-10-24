# Changelog - Service 03: Provision Orchestrator

All notable changes to the HeroCMS Headless Provision Orchestrator daemon will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/) and follows the independent release policy specified in `AGENTS.md`.

---

## [v1.0.0] - 2026-10-25

### Milestone Release: Autonomous Headless Control Plane

Initial enterprise release of the headless Golang daemon for autonomous container lifecycle orchestration, storage sandboxing, Traefik v3 ingress routing, Redis state synchronization, and Kafka event publishing.

#### ✨ Features & Architecture
- **Headless Daemon Control Plane (`cmd/api/main.go`)**: Pure Golang background daemon with zero dashboard UI, fast Gin REST API, and graceful signal shutdown (`SIGINT`, `SIGTERM`).
- **Strict Local-Only Perimeter**: Isolated within `herocms_internal_net` without public port exposure; protected by `X-HeroCMS-Internal-Secret` middleware guard (`internal/api/middleware.go`).
- **Autonomous Docker Provisioning (`internal/docker/`)**: Spawns isolated tenant containers with Linux cgroups v2 hard limits:
  - 256 MB RAM limit (`MemorySwap == Memory`, swap disabled)
  - 0.5 vCPU (`NanoCPUs: 500_000_000`)
  - Anti-fork bomb protection (`PidsLimit: 50`)
  - Non-root user execution (`UID/GID 10001:10001`, `cmsrunner`)
  - Read-only root filesystem with noexec/nosuid/nodev tmpfs mounts on `/tmp` and `/run`
  - Drop all kernel capabilities (`CapDrop: ALL`) except `NET_BIND_SERVICE`
  - `no-new-privileges: true`
- **Dynamic Ingress Ingestion (`internal/docker/sandbox.go`)**: Automatic Traefik v3 router and service label injection supporting instant subdomain and custom domain mapping without proxy reloads.
- **Persistent Storage Sandboxing (`internal/storage/manager.go`)**: Dedicated per-tenant isolated storage directories (`/data`, `/uploads`, `/public`) with auto-initialization, non-root permission enforcement, and directory purge on deletion.
- **Distributed Mutex & State Caching (`internal/messaging/redis/client.go`)**: Redis-backed deployment locks (`herocms:lock:deploy:{tenant_id}`) to prevent race conditions during concurrent deploys, with high-performance in-memory fallback.
- **Kafka Event Streaming Bus (`internal/messaging/kafka/producer.go`)**: Broadcasts standard lifecycle events (`tenant.provision.started`, `tenant.provision.completed`, `tenant.provision.failed`, `tenant.container.stopped`, etc.) with in-memory audit ring buffer.

#### 🛡️ Security & Pentesting
- **Router Rule Injection Protection (CWE-20/CWE-93)**: Strict regex sanitization on subdomains, custom domains, and tenant IDs.
- **Directory Traversal Mitigation**: File path validation preventing path traversal in storage provisioning.
- **Pentest Suite Passing**: Full test suite in `pentest/` and `internal/api/api_test.go` verified with 100% PASS.
