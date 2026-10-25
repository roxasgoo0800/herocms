package orchestrator

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/cloudcms/dashboard-cms-backend/internal/config"
)

// DeployPayload represents the payload to deploy/provision a container in Service 03
type DeployPayload struct {
	TenantID     string `json:"tenant_id"`
	SiteID       string `json:"site_id"`
	Subdomain    string `json:"subdomain"`
	CustomDomain string `json:"custom_domain,omitempty"`
	VersionHash  string `json:"version_hash"`
}

// DeployResponse represents the response from Service 03 deploy endpoint
type DeployResponse struct {
	Status       string `json:"status"`
	ContainerID  string `json:"container_id"`
	Subdomain    string `json:"subdomain"`
	CustomDomain string `json:"custom_domain,omitempty"`
	DeployedAt   string `json:"deployed_at"`
}

// ContainerInfo represents a container summary from Service 03
type ContainerInfo struct {
	ID      string            `json:"id"`
	Names   []string          `json:"names"`
	Image   string            `json:"image"`
	State   string            `json:"state"`
	Status  string            `json:"status"`
	Created int64             `json:"created"`
	Labels  map[string]string `json:"labels"`
}

// ContainerStats represents cgroups v2 resource usage stats from Service 03
type ContainerStats struct {
	CPUPercent    float64 `json:"cpu_percent"`
	MemoryMB      float64 `json:"memory_mb"`
	MemoryLimitMB float64 `json:"memory_limit_mb"`
	MemoryPercent float64 `json:"memory_percent"`
	NetworkRxMB   float64 `json:"network_rx_mb"`
	NetworkTxMB   float64 `json:"network_tx_mb"`
	PidsCurrent   uint64  `json:"pids_current"`
	Timestamp     string  `json:"timestamp"`
}

// OrchestratorStatus represents probe information from Service 03 /readyz
type OrchestratorStatus struct {
	Status         string `json:"status"`
	DockerLive     bool   `json:"docker_live"`
	RedisLive      bool   `json:"redis_live"`
	StorageReady   bool   `json:"storage_ready"`
	EdgeNetwork    string `json:"edge_network"`
	SimulationMode bool   `json:"simulation_mode"`
}

// Client interacts with Service 03 (Provision Orchestrator)
type Client struct {
	baseURL        string
	internalSecret string
	httpClient     *http.Client
}

// NewClient creates a new provision orchestrator HTTP client
func NewClient(cfg *config.Config) *Client {
	baseURL := strings.TrimRight(cfg.OrchestratorURL, "/")
	if baseURL == "" {
		baseURL = "http://127.0.0.1:8080"
	}

	return &Client{
		baseURL:        baseURL,
		internalSecret: cfg.OrchestratorInternalSecret,
		httpClient: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

// newRequest creates an HTTP request with the internal secret token attached
func (c *Client) newRequest(ctx context.Context, method, path string, body io.Reader) (*http.Request, error) {
	fullURL := c.baseURL + path
	req, err := http.NewRequestWithContext(ctx, method, fullURL, body)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	if c.internalSecret != "" {
		req.Header.Set("X-HeroCMS-Internal-Secret", c.internalSecret)
	}
	req.Header.Set("User-Agent", "HeroCMS-Dashboard-BFF/1.0")
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	return req, nil
}

// GetStatus checks Service 03 readiness probe (/readyz)
func (c *Client) GetStatus(ctx context.Context) (*OrchestratorStatus, error) {
	req, err := c.newRequest(ctx, http.MethodGet, "/readyz", nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("orchestrator unreachable: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("orchestrator returned HTTP %d", resp.StatusCode)
	}

	var status OrchestratorStatus
	if err := json.NewDecoder(resp.Body).Decode(&status); err != nil {
		return nil, fmt.Errorf("failed to decode orchestrator status: %w", err)
	}

	return &status, nil
}

// DeployContainer triggers container provisioning and Traefik dynamic label routing
func (c *Client) DeployContainer(ctx context.Context, payload DeployPayload) (*DeployResponse, error) {
	pBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to serialize deploy payload: %w", err)
	}

	req, err := c.newRequest(ctx, http.MethodPost, "/api/v1/containers/provision", bytes.NewReader(pBytes))
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute deploy on orchestrator: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("orchestrator deploy failed (HTTP %d): %s", resp.StatusCode, string(respBody))
	}

	var out DeployResponse
	if err := json.Unmarshal(respBody, &out); err != nil {
		return nil, fmt.Errorf("failed to parse deploy response: %w", err)
	}

	return &out, nil
}

// ListContainers retrieves all active tenant containers from Service 03
func (c *Client) ListContainers(ctx context.Context) ([]ContainerInfo, error) {
	req, err := c.newRequest(ctx, http.MethodGet, "/api/v1/containers", nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to list containers: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("orchestrator list failed (HTTP %d): %s", resp.StatusCode, string(body))
	}

	var wrapper struct {
		Containers []ContainerInfo `json:"containers"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&wrapper); err != nil {
		return nil, fmt.Errorf("failed to parse containers list: %w", err)
	}

	return wrapper.Containers, nil
}

// InspectContainer inspects container details
func (c *Client) InspectContainer(ctx context.Context, id string) (map[string]interface{}, error) {
	req, err := c.newRequest(ctx, http.MethodGet, "/api/v1/containers/"+url.PathEscape(id), nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to inspect container %s: %w", id, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("orchestrator inspect failed (HTTP %d): %s", resp.StatusCode, string(body))
	}

	var out map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, fmt.Errorf("failed to decode container inspection: %w", err)
	}

	return out, nil
}

// StartContainer sends start request for a container
func (c *Client) StartContainer(ctx context.Context, id string) error {
	req, err := c.newRequest(ctx, http.MethodPost, "/api/v1/containers/"+url.PathEscape(id)+"/start", nil)
	if err != nil {
		return err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to start container %s: %w", id, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("orchestrator start failed (HTTP %d): %s", resp.StatusCode, string(body))
	}

	return nil
}

// StopContainer sends stop request for a container
func (c *Client) StopContainer(ctx context.Context, id string) error {
	req, err := c.newRequest(ctx, http.MethodPost, "/api/v1/containers/"+url.PathEscape(id)+"/stop", nil)
	if err != nil {
		return err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to stop container %s: %w", id, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("orchestrator stop failed (HTTP %d): %s", resp.StatusCode, string(body))
	}

	return nil
}

// RestartContainer performs an emergency restart/reboot of a tenant container
func (c *Client) RestartContainer(ctx context.Context, id string) error {
	req, err := c.newRequest(ctx, http.MethodPost, "/api/v1/containers/"+url.PathEscape(id)+"/restart", nil)
	if err != nil {
		return err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to restart container %s: %w", id, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("orchestrator restart failed (HTTP %d): %s", resp.StatusCode, string(body))
	}

	return nil
}

// DestroyContainer removes a container and optionally purges tenant persistent storage
func (c *Client) DestroyContainer(ctx context.Context, id string, purgeStorage bool) error {
	path := "/api/v1/containers/" + url.PathEscape(id)
	if purgeStorage {
		path += "?purge_storage=true"
	}

	req, err := c.newRequest(ctx, http.MethodDelete, path, nil)
	if err != nil {
		return err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to destroy container %s: %w", id, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("orchestrator destroy failed (HTTP %d): %s", resp.StatusCode, string(body))
	}

	return nil
}

// GetStats retrieves real-time cgroups v2 resource usage stats for a container
func (c *Client) GetStats(ctx context.Context, id string) (*ContainerStats, error) {
	req, err := c.newRequest(ctx, http.MethodGet, "/api/v1/containers/"+url.PathEscape(id)+"/stats", nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to get stats for container %s: %w", id, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("orchestrator stats failed (HTTP %d): %s", resp.StatusCode, string(body))
	}

	var stats ContainerStats
	if err := json.NewDecoder(resp.Body).Decode(&stats); err != nil {
		return nil, fmt.Errorf("failed to decode stats: %w", err)
	}

	return &stats, nil
}

// GetLogs retrieves recent logs from container stdout/stderr
func (c *Client) GetLogs(ctx context.Context, id string, tail int) (string, error) {
	if tail <= 0 {
		tail = 100
	}
	path := "/api/v1/containers/" + url.PathEscape(id) + "/logs?tail=" + strconv.Itoa(tail)

	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return "", err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to get logs for container %s: %w", id, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("orchestrator logs failed (HTTP %d): %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read logs stream: %w", err)
	}

	return string(body), nil
}
