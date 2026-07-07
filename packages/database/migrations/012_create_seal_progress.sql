-- +migrate Up
-- Migration 012: Create seal_progress table
-- Created: 2026-07-07
-- Purpose: Track user progress toward earning seals

CREATE TABLE seal_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seal_id UUID NOT NULL REFERENCES academic_seals(id) ON DELETE CASCADE,

  current_value INTEGER DEFAULT 0 NOT NULL,
  target_value INTEGER NOT NULL,
  progress_percent INTEGER DEFAULT 0,
  status seal_progress_status DEFAULT 'locked',

  progress_data JSONB,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

  UNIQUE(user_id, seal_id)
);

-- Indexes for queries
CREATE INDEX idx_seal_progress_user ON seal_progress(user_id);
CREATE INDEX idx_seal_progress_seal ON seal_progress(seal_id);
CREATE INDEX idx_seal_progress_status ON seal_progress(user_id, status);
CREATE INDEX idx_seal_progress_near ON seal_progress(user_id, progress_percent DESC)
  WHERE status = 'in_progress';

-- Comments
COMMENT ON TABLE seal_progress IS 'Track progress toward seals not yet earned';
COMMENT ON COLUMN seal_progress.current_value IS 'Current progress value (e.g., 7 articles read)';
COMMENT ON COLUMN seal_progress.target_value IS 'Target value (e.g., 10 articles)';
COMMENT ON COLUMN seal_progress.progress_percent IS 'Cached percentage (0-100)';
COMMENT ON COLUMN seal_progress.status IS 'locked, in_progress, earned';
COMMENT ON COLUMN seal_progress.progress_data IS 'Additional tracking data (e.g., domains read, streak days)';

-- +migrate Down
-- Rollback: Drop seal_progress table
DROP TABLE IF EXISTS seal_progress CASCADE;
