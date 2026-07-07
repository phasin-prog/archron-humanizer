-- +migrate Up
-- Migration 011: Create user_seals table
-- Created: 2026-07-07
-- Purpose: Track seals earned by users

CREATE TABLE user_seals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seal_id UUID NOT NULL REFERENCES academic_seals(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_displayed BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  metadata JSONB,
  UNIQUE(user_id, seal_id)
);

-- Indexes for queries
CREATE INDEX idx_user_seals_user ON user_seals(user_id);
CREATE INDEX idx_user_seals_seal ON user_seals(seal_id);
CREATE INDEX idx_user_seals_earned ON user_seals(earned_at DESC);
CREATE INDEX idx_user_seals_displayed ON user_seals(user_id, is_displayed) WHERE is_displayed = true;

-- Comments
COMMENT ON TABLE user_seals IS 'Seals earned by users';
COMMENT ON COLUMN user_seals.is_displayed IS 'Whether to show on user profile';
COMMENT ON COLUMN user_seals.display_order IS 'Order for profile display';
COMMENT ON COLUMN user_seals.metadata IS 'Additional context (e.g., value when earned)';
COMMENT ON CONSTRAINT user_seals_user_id_seal_id_key ON user_seals IS 'Each seal can only be earned once per user';

-- +migrate Down
-- Rollback: Drop user_seals table
DROP TABLE IF EXISTS user_seals CASCADE;
