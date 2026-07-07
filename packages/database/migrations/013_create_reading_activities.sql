-- +migrate Up
-- Migration 013: Create reading_activities table
-- Created: 2026-07-07
-- Purpose: Track reading activities for seal award logic

CREATE TABLE reading_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  object_id UUID NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  object_type VARCHAR(50) NOT NULL,
  domain VARCHAR(100),
  read_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  read_duration INTEGER,
  UNIQUE(user_id, object_id)
);

-- Indexes for queries
CREATE INDEX idx_reading_user ON reading_activities(user_id);
CREATE INDEX idx_reading_object ON reading_activities(object_id);
CREATE INDEX idx_reading_domain ON reading_activities(user_id, domain);
CREATE INDEX idx_reading_completed ON reading_activities(user_id, is_completed)
  WHERE is_completed = true;
CREATE INDEX idx_reading_date ON reading_activities(user_id, read_at DESC);
CREATE INDEX idx_reading_type ON reading_activities(user_id, object_type);

-- Comments
COMMENT ON TABLE reading_activities IS 'Track reading activities for seal calculations';
COMMENT ON COLUMN reading_activities.object_type IS 'Denormalized from objects table (article, concept, thinker, etc.)';
COMMENT ON COLUMN reading_activities.domain IS 'Denormalized primary domain for faster queries';
COMMENT ON COLUMN reading_activities.is_completed IS 'Whether user read the full object';
COMMENT ON COLUMN reading_activities.read_duration IS 'Read time in seconds';
COMMENT ON CONSTRAINT reading_activities_user_id_object_id_key ON reading_activities IS 'One read record per user per object';

-- +migrate Down
-- Rollback: Drop reading_activities table
DROP TABLE IF EXISTS reading_activities CASCADE;
