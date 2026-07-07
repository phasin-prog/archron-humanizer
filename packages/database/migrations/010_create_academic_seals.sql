-- +migrate Up
-- Migration 010: Create academic_seals table
-- Created: 2026-07-07
-- Purpose: Catalog of 21 academic seals (achievements system)

CREATE TABLE academic_seals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_th VARCHAR(200),
  description TEXT NOT NULL,
  requirement TEXT NOT NULL,

  -- Visual properties
  symbol TEXT NOT NULL,
  shape seal_shape NOT NULL,
  color VARCHAR(7) NOT NULL,
  tier seal_tier NOT NULL,

  -- Classification
  level INTEGER,
  category seal_category NOT NULL,
  domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,

  -- Award logic
  criteria JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes for queries
CREATE INDEX idx_seals_slug ON academic_seals(slug);
CREATE INDEX idx_seals_category ON academic_seals(category);
CREATE INDEX idx_seals_tier ON academic_seals(tier);
CREATE INDEX idx_seals_level ON academic_seals(level);
CREATE INDEX idx_seals_domain ON academic_seals(domain_id);
CREATE INDEX idx_seals_sort ON academic_seals(sort_order);
CREATE INDEX idx_seals_active ON academic_seals(is_active) WHERE is_active = true;

-- Comments
COMMENT ON TABLE academic_seals IS 'Catalog of academic seals (21 seals system)';
COMMENT ON COLUMN academic_seals.slug IS 'URL-safe identifier (e.g., the-seeker)';
COMMENT ON COLUMN academic_seals.symbol IS 'SVG path or Unicode symbol';
COMMENT ON COLUMN academic_seals.shape IS 'Visual shape: circle, octagon, hexagon, diamond, compass';
COMMENT ON COLUMN academic_seals.tier IS 'slate (L1-2), blue (L3-4), silver (L5-6), gold (L7)';
COMMENT ON COLUMN academic_seals.level IS 'User level requirement (1-7), NULL for special seals';
COMMENT ON COLUMN academic_seals.category IS 'progression, domain, time, support';
COMMENT ON COLUMN academic_seals.domain_id IS 'For domain-specific seals only';
COMMENT ON COLUMN academic_seals.criteria IS 'Machine-readable award criteria (JSON)';

-- +migrate Down
-- Rollback: Drop academic_seals table
DROP TABLE IF EXISTS academic_seals CASCADE;
