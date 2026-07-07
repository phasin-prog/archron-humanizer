-- +migrate Up
-- Migration 009: Create thinker_traditions table
-- Created: 2026-07-07
-- Purpose: Many-to-many relationship between thinkers and traditions

CREATE TABLE thinker_traditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thinker_id UUID NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE,
  tradition_id UUID NOT NULL REFERENCES traditions(id) ON DELETE CASCADE,
  role VARCHAR(50),
  contribution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(thinker_id, tradition_id)
);

-- Indexes
CREATE INDEX idx_thinker_traditions_thinker ON thinker_traditions(thinker_id);
CREATE INDEX idx_thinker_traditions_tradition ON thinker_traditions(tradition_id);
CREATE INDEX idx_thinker_traditions_role ON thinker_traditions(role);

-- Comments
COMMENT ON TABLE thinker_traditions IS 'Maps thinkers to intellectual traditions they belong to';
COMMENT ON COLUMN thinker_traditions.role IS 'Role in tradition: founder, major_contributor, follower, critic';
COMMENT ON COLUMN thinker_traditions.contribution IS 'Specific contribution to this tradition';

-- +migrate Down
-- Rollback: Drop thinker_traditions table
DROP TABLE IF EXISTS thinker_traditions CASCADE;
