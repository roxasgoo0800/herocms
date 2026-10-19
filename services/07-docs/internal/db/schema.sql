-- ==============================================================================
-- HeroCMS Service 07: Docs & Mission Control Hub Database Schema
-- Multi-Tenant & Centralized PM Task Matrix, Blueprints & Enterprise SOPs
-- ==============================================================================

-- 1. Tasks Table (50 Granular Architectural & Business Tasks)
CREATE TABLE IF NOT EXISTS pm_tasks (
    id VARCHAR(64) PRIMARY KEY,
    division VARCHAR(64) NOT NULL,
    pic VARCHAR(128) NOT NULL,
    handover_to VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    service VARCHAR(128) NOT NULL,
    service_group VARCHAR(64) NOT NULL,
    code_file VARCHAR(255) NOT NULL,
    code_lang VARCHAR(32) NOT NULL DEFAULT 'typescript',
    status VARCHAR(32) NOT NULL DEFAULT 'ONGOING',
    priority VARCHAR(32) NOT NULL DEFAULT 'Medium',
    phase VARCHAR(32) NOT NULL DEFAULT 'Phase 1',
    lead TEXT NOT NULL,
    flow_desc TEXT,
    flow_diagram TEXT,
    code_snippet TEXT,
    ai_notes TEXT,
    dod TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Task Checklists Table (Granular Checklist Items with UI Done vs Real Ongoing)
CREATE TABLE IF NOT EXISTS pm_task_checklists (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL REFERENCES pm_tasks(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    item_text TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Architecture Blueprints Table (13 Actionable Guides with Requirements & CLI Commands)
CREATE TABLE IF NOT EXISTS architecture_blueprints (
    id SERIAL PRIMARY KEY,
    term VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    icon VARCHAR(16) DEFAULT '📖',
    definition TEXT NOT NULL,
    requirements JSONB NOT NULL DEFAULT '[]',
    file_reference VARCHAR(255) NOT NULL,
    cli_command TEXT,
    guide_steps JSONB NOT NULL DEFAULT '[]',
    do_and_dont TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Enterprise SOPs Table (10 Industry-Standard Lifecycle SOPs)
CREATE TABLE IF NOT EXISTS enterprise_sops (
    id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    pic VARCHAR(128) NOT NULL,
    badge VARCHAR(64) NOT NULL DEFAULT 'Mandatori',
    steps JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Team Members Roster Table (6 Core Employees)
CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    role VARCHAR(255) NOT NULL,
    pic VARCHAR(128) NOT NULL,
    icon VARCHAR(16) NOT NULL,
    handover VARCHAR(128) NOT NULL,
    focus TEXT NOT NULL,
    responsibilities TEXT NOT NULL
);

-- 6. Microservices Metadata Table (6 Distributed Services)
CREATE TABLE IF NOT EXISTS microservices_metadata (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    stack VARCHAR(255) NOT NULL,
    pic VARCHAR(128) NOT NULL,
    icon VARCHAR(16) NOT NULL,
    lead TEXT NOT NULL,
    mandates JSONB NOT NULL DEFAULT '[]',
    forbidden JSONB NOT NULL DEFAULT '[]'
);

-- Indices for Fast Filter & Search
CREATE INDEX IF NOT EXISTS idx_tasks_division ON pm_tasks(division);
CREATE INDEX IF NOT EXISTS idx_tasks_service_group ON pm_tasks(service_group);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON pm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_checklists_task_id ON pm_task_checklists(task_id);
