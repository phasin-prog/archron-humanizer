-- +migrate Up
-- Migration 014: Update knowledge_objects with seal-related fields
-- Created: 2026-07-07
-- Purpose: Add fields to track object engagement for seal calculations

-- Add read_count for popular content tracking
ALTER TABLE objects
ADD COLUMN read_count INTEGER DEFAULT 0,
ADD COLUMN unique_readers INTEGER DEFAULT 0,
ADD COLUMN last_read_at TIMESTAMP WITH TIME ZONE;

-- Indexes for seal queries
CREATE INDEX idx_objects_read_count ON objects(read_count DESC);
CREATE INDEX idx_objects_unique_readers ON objects(unique_readers DESC);

-- Comments
COMMENT ON COLUMN objects.read_count IS 'Total number of reads (including repeats)';
COMMENT ON COLUMN objects.unique_readers IS 'Count of unique users who read this';
COMMENT ON COLUMN objects.last_read_at IS 'Most recent read timestamp';

-- +migrate Down
-- Rollback: Remove seal-related columns from objects
ALTER TABLE objects
DROP COLUMN IF EXISTS last_read_at,
DROP COLUMN IF EXISTS unique_readers,
DROP COLUMN IF EXISTS read_count;
