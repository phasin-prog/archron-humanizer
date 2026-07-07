-- +migrate Up
-- Migration 006: Create thinker_domains table
-- Created: 2026-07-07
-- Purpose: Many-to-many relationship between thinkers and domains

CREATE TABLE thinker_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thinker_id UUID NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  contribution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(thinker_id, domain_id)
);

-- Indexes for foreign keys and queries
CREATE INDEX idx_thinker_domains_thinker ON thinker_domains(thinker_id);
CREATE INDEX idx_thinker_domains_domain ON thinker_domains(domain_id);
CREATE INDEX idx_thinker_domains_primary ON thinker_domains(is_primary) WHERE is_primary = true;

-- Comments
COMMENT ON TABLE thinker_domains IS 'Maps thinkers to multiple domains they contributed to';
COMMENT ON COLUMN thinker_domains.is_primary IS 'Whether this is the thinker primary domain';
COMMENT ON COLUMN thinker_domains.contribution IS 'Description of contribution to this domain';

-- +migrate Down
-- Rollback: Drop thinker_domains table
DROP TABLE IF EXISTS thinker_domains CASCADE;
