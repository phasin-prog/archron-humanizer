-- +migrate Up
-- Migration 007: Create thinker_relationships table
-- Created: 2026-07-07
-- Purpose: Track relationships between thinkers (influenced, opposed, collaborated, etc.)

CREATE TABLE thinker_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_thinker_id UUID NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE,
  target_thinker_id UUID NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL,
  description TEXT,
  weight INTEGER DEFAULT 1,
  confidence VARCHAR(20) DEFAULT 'suggested',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CHECK (source_thinker_id != target_thinker_id)
);

-- Indexes for queries
CREATE INDEX idx_thinker_rels_source ON thinker_relationships(source_thinker_id);
CREATE INDEX idx_thinker_rels_target ON thinker_relationships(target_thinker_id);
CREATE INDEX idx_thinker_rels_type ON thinker_relationships(relationship_type);
CREATE INDEX idx_thinker_rels_weight ON thinker_relationships(weight DESC);

-- Comments
COMMENT ON TABLE thinker_relationships IS 'Directional relationships between thinkers';
COMMENT ON COLUMN thinker_relationships.relationship_type IS 'Type: influenced, opposed, collaborated, student_of, contemporary, responded_to, extended';
COMMENT ON COLUMN thinker_relationships.weight IS 'Strength of relationship (1-10)';
COMMENT ON COLUMN thinker_relationships.confidence IS 'Confidence level: verified, suggested, speculative';
COMMENT ON CONSTRAINT thinker_relationships_check ON thinker_relationships IS 'Prevent self-referential relationships';

-- +migrate Down
-- Rollback: Drop thinker_relationships table
DROP TABLE IF EXISTS thinker_relationships CASCADE;
