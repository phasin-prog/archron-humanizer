-- +migrate Up
-- Migration 001: Create enums for Constellation and Seals systems
-- Created: 2026-07-07
-- Purpose: Define all enum types used across both systems

-- Constellation enums
CREATE TYPE constellation_layer_type AS ENUM (
  'origins',
  'foundational',
  'constellation',
  'traditions',
  'modern'
);

CREATE TYPE relationship_type AS ENUM (
  'influenced',
  'disagreed',
  'collaborated',
  'teacher_student',
  'contemporary',
  'responded_to',
  'extended',
  'opposed'
);

-- Seals enums
CREATE TYPE seal_shape AS ENUM (
  'circle',
  'octagon',
  'hexagon',
  'diamond',
  'compass'
);

CREATE TYPE seal_tier AS ENUM (
  'slate',
  'blue',
  'silver',
  'gold'
);

CREATE TYPE seal_category AS ENUM (
  'progression',
  'domain',
  'time',
  'support'
);

CREATE TYPE seal_progress_status AS ENUM (
  'locked',
  'in_progress',
  'earned'
);

-- +migrate Down
-- Rollback: Drop all enums in reverse order
DROP TYPE IF EXISTS seal_progress_status CASCADE;
DROP TYPE IF EXISTS seal_category CASCADE;
DROP TYPE IF EXISTS seal_tier CASCADE;
DROP TYPE IF EXISTS seal_shape CASCADE;
DROP TYPE IF EXISTS relationship_type CASCADE;
DROP TYPE IF EXISTS constellation_layer_type CASCADE;
