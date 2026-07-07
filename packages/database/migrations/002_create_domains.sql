-- +migrate Up
-- Migration 002: Create domains table
-- Created: 2026-07-07
-- Purpose: 12 knowledge domains for Constellation Model

CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_th VARCHAR(200),
  description TEXT,
  color VARCHAR(7) NOT NULL,
  icon VARCHAR(50),
  sort_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_domains_slug ON domains(slug);
CREATE INDEX idx_domains_sort_order ON domains(sort_order);
CREATE INDEX idx_domains_active ON domains(is_active) WHERE is_active = true;

-- Comments
COMMENT ON TABLE domains IS 'Knowledge domains for organizing thinkers and content';
COMMENT ON COLUMN domains.slug IS 'URL-safe identifier (e.g., psychology, philosophy)';
COMMENT ON COLUMN domains.color IS 'Hex color code for visual identity';

-- +migrate Down
-- Rollback: Drop domains table
DROP TABLE IF EXISTS domains CASCADE;
