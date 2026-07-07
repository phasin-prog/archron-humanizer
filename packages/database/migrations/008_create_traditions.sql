-- +migrate Up
-- Migration 008: Create traditions table
-- Created: 2026-07-07
-- Purpose: Major intellectual traditions and schools of thought

CREATE TABLE traditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_th VARCHAR(200),
  description TEXT,
  domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
  time_period VARCHAR(100),
  key_principles TEXT[],
  founder_ids UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_traditions_domain ON traditions(domain_id);
CREATE INDEX idx_traditions_slug ON traditions(slug);

-- Comments
COMMENT ON TABLE traditions IS 'Intellectual traditions and schools of thought (e.g., Psychoanalysis, Existentialism)';
COMMENT ON COLUMN traditions.slug IS 'URL-safe identifier';
COMMENT ON COLUMN traditions.domain_id IS 'Primary domain (NULL if cross-domain)';
COMMENT ON COLUMN traditions.key_principles IS 'Core principles of this tradition';
COMMENT ON COLUMN traditions.founder_ids IS 'Array of thinker UUIDs who founded this tradition';

-- +migrate Down
-- Rollback: Drop traditions table
DROP TABLE IF EXISTS traditions CASCADE;
