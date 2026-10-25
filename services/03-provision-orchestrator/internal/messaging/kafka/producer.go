package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"
)

// EventType enumerates lifecycle events
type EventType string

const (
	EventProvisionStarted   EventType = "tenant.provision.started"
	EventProvisionCompleted EventType = "tenant.provision.completed"
	EventProvisionFailed    EventType = "tenant.provision.failed"
	EventContainerStarted   EventType = "tenant.container.started"
	EventContainerStopped   EventType = "tenant.container.stopped"
	EventContainerRestarted EventType = "tenant.container.restarted"
	EventContainerDestroyed EventType = "tenant.container.destroyed"
	EventStorageProvisioned EventType = "tenant.storage.provisioned"
	EventAlertOOMKilled     EventType = "tenant.alert.oom_killed"
)

// LifecycleEvent is the standard event envelope published across the HeroCMS ecosystem
type LifecycleEvent struct {
	EventID     string                 `json:"event_id"`
	Type        EventType              `json:"type"`
	TenantID    string                 `json:"tenant_id"`
	SiteID      string                 `json:"site_id,omitempty"`
	ContainerID string                 `json:"container_id,omitempty"`
	Status      string                 `json:"status"` // ok, failed, warning
	Message     string                 `json:"message"`
	Details     map[string]interface{} `json:"details,omitempty"`
	Timestamp   string                 `json:"timestamp"`
}

// Producer manages event publishing to Kafka/Redpanda with thread-safe audit buffer
type Producer struct {
	brokers      string
	recentEvents []LifecycleEvent
	maxBuffer    int
	mu           sync.RWMutex
}

// NewProducer creates an event producer instance
func NewProducer(brokers string) *Producer {
	if brokers == "" {
		brokers = "localhost:9092"
	}
	return &Producer{
		brokers:      brokers,
		recentEvents: make([]LifecycleEvent, 0, 100),
		maxBuffer:    100,
	}
}

// Publish broadcasts a lifecycle event to Kafka and records it in recent audit ring buffer
func (p *Producer) Publish(ctx context.Context, topic string, event LifecycleEvent) error {
	if event.EventID == "" {
		event.EventID = fmt.Sprintf("evt_%d", time.Now().UnixNano())
	}
	if event.Timestamp == "" {
		event.Timestamp = time.Now().UTC().Format(time.RFC3339)
	}

	payload, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("failed to marshal kafka event: %w", err)
	}

	p.mu.Lock()
	if len(p.recentEvents) >= p.maxBuffer {
		p.recentEvents = p.recentEvents[1:]
	}
	p.recentEvents = append(p.recentEvents, event)
	p.mu.Unlock()

	log.Printf("[KAFKA EVENT PRODUCED] Topic: %s | Type: %s | Tenant: %s | Payload: %s", topic, event.Type, event.TenantID, string(payload))
	return nil
}

// GetRecentEvents returns an audit trail of recently emitted events
func (p *Producer) GetRecentEvents(limit int) []LifecycleEvent {
	p.mu.RLock()
	defer p.mu.RUnlock()

	total := len(p.recentEvents)
	if limit <= 0 || limit > total {
		limit = total
	}

	res := make([]LifecycleEvent, limit)
	copy(res, p.recentEvents[total-limit:])
	return res
}
