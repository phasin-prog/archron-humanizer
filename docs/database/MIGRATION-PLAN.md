# Database Migration Plan

Version: 1.0  
Status: Planning Phase  
Purpose: แผนการ migrate database สำหรับ Constellation Model และ Academic Seals System

---

## ภาพรวม

Migration นี้เพิ่ม **10 tables ใหม่** และ **ขยาย 2 tables เดิม** (thinkers, knowledge_objects):

### Constellation Model (6 tables ใหม่)
- `domains` — 12 domains หลัก
- `constellation_layers` — 5 layers
- `constellations` — กลุ่มดาวนักคิด
- `thinker_domains` — many-to-many: thinkers ↔ domains
- `thinker_relationships` — relationships ระหว่างนักคิด
- `traditions` — สำนักความคิด
- `thinker_traditions` — many-to-many: thinkers ↔ traditions
- **Extend:** `thinkers` — เพิ่ม constellation columns

### Academic Seals System (4 tables)
- `academic_seals` — catalog 21 seals
- `user_seals` — seals ที่ user ได้รับ
- `seal_progress` — ความคืบหน้าสู่ seal
- `reading_activities` — ติดตามการอ่าน (สำหรับ award logic)

---

## Migration Dependencies

**สำคัญ:** Migrations ต้องรันตามลำดับนี้เท่านั้น

```
Phase 1: Constellation (001-009)
    ↓
Phase 2: Seals (010-015)
    ↓
Phase 3: Seed Data (016-019)
```

**เหตุผล:**
- Seals tables มี foreign key ไป `domains` table
- ต้อง deploy Constellation schema ก่อน Seals schema เสมอ

```
001_create_enums
    ↓
002_create_domains
    ↓
003_create_constellation_layers
    ↓
004_create_constellations
    ↓
005_extend_thinkers ←─ ต้องมี thinkers table อยู่แล้ว
    ↓
006_create_thinker_domains
    ↓
007_create_thinker_relationships
    ↓
008_create_traditions
    ↓
009_create_thinker_traditions
    ↓
010_create_academic_seals ←─ ใช้ domains table
    ↓
011_create_user_seals
    ↓
012_create_seal_progress
    ↓
013_create_reading_activities
    ↓
014_update_knowledge_objects
    ↓
015_add_indexes
    ↓
016-019_seed_data
```

---

## Phase 1: Constellation Model

### Migration 001: Create enums

```sql
-- File: migrations/001_create_enums.sql

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
  'teacher_student'
);

-- Seals enums (จะใช้ใน Phase 2)
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
```

### Migration 002: Create domains table

```sql
-- File: migrations/002_create_domains.sql

CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_th VARCHAR(200),
  description TEXT,
  color VARCHAR(7) NOT NULL,
  icon VARCHAR(50),
  sort_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_domains_slug ON domains(slug);
CREATE INDEX idx_domains_sort_order ON domains(sort_order);

-- Seed 12 domains
INSERT INTO domains (slug, name, name_th, color, sort_order) VALUES
  ('psychology', 'Psychology', 'จิตวิทยา', '#5A9FB5', 1),
  ('philosophy', 'Philosophy', 'ปรัชญา', '#9688B8', 2),
  ('anthropology', 'Anthropology', 'มานุษยวิทยา', '#B8866F', 3),
  ('history', 'History', 'ประวัติศาสตร์', '#8B7D6B', 4),
  ('language', 'Language', 'ภาษา', '#6FA589', 5),
  ('mythology', 'Mythology', 'เทพนิยาย', '#B56A6A', 6),
  ('religion', 'Religion', 'ศาสนา', '#9B8D7E', 7),
  ('science', 'Science', 'วิทยาศาสตร์', '#7B9DA5', 8),
  ('symbolism', 'Symbolism', 'สัญลักษณ์วิทยา', '#A8869B', 9),
  ('art', 'Art', 'ศิลปะ', '#A89B7E', 10),
  ('ai', 'AI', 'ปัญญาประดิษฐ์', '#6B8FA5', 11),
  ('civilization', 'Civilization', 'อารยธรรม', '#9A8B6D', 12);
```

### Migration 003: Create constellation_layers table

```sql
-- File: migrations/003_create_constellation_layers.sql

CREATE TABLE constellation_layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_th VARCHAR(200),
  description TEXT,
  sequence INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

INSERT INTO constellation_layers (slug, name, name_th, sequence) VALUES
  ('origins', 'Origins', 'รากกำเนิด', 1),
  ('foundational', 'Foundational Thinkers', 'ผู้วางรากฐาน', 2),
  ('constellation', 'Constellation of Thinkers', 'กลุ่มดาวนักคิด', 3),
  ('traditions', 'Major Traditions', 'สำนักสำคัญ', 4),
  ('modern', 'Modern Development', 'พัฒนาการสมัยใหม่', 5);
```

### Migration 004: Create constellations table

```sql
-- File: migrations/004_create_constellations.sql

CREATE TABLE constellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  name VARCHAR(300) NOT NULL,
  name_th VARCHAR(300),
  description TEXT,
  time_period VARCHAR(100),
  central_question TEXT,
  layer_id UUID REFERENCES constellation_layers(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_constellations_domain ON constellations(domain_id);
CREATE INDEX idx_constellations_layer ON constellations(layer_id);
```

### Migration 005: Extend thinkers table

```sql
-- File: migrations/005_extend_thinkers.sql

ALTER TABLE thinkers
ADD COLUMN primary_domain_id UUID REFERENCES domains(id),
ADD COLUMN constellation_id UUID REFERENCES constellations(id),
ADD COLUMN layer_id UUID REFERENCES constellation_layers(id),
ADD COLUMN influence_score INTEGER DEFAULT 0,
ADD COLUMN time_period VARCHAR(100),
ADD COLUMN primary_work TEXT,
ADD COLUMN key_concepts TEXT[];

CREATE INDEX idx_thinkers_constellation ON thinkers(constellation_id);
CREATE INDEX idx_thinkers_layer ON thinkers(layer_id);
CREATE INDEX idx_thinkers_domain ON thinkers(primary_domain_id);
```

### Migration 006: Create thinker_domains table

```sql
-- File: migrations/006_create_thinker_domains.sql

CREATE TABLE thinker_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thinker_id UUID NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  contribution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(thinker_id, domain_id)
);

CREATE INDEX idx_thinker_domains_thinker ON thinker_domains(thinker_id);
CREATE INDEX idx_thinker_domains_domain ON thinker_domains(domain_id);
CREATE INDEX idx_thinker_domains_primary ON thinker_domains(is_primary) WHERE is_primary = true;
```

### Migration 007: Create thinker_relationships table

```sql
-- File: migrations/007_create_thinker_relationships.sql

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

CREATE INDEX idx_thinker_rels_source ON thinker_relationships(source_thinker_id);
CREATE INDEX idx_thinker_rels_target ON thinker_relationships(target_thinker_id);
CREATE INDEX idx_thinker_rels_type ON thinker_relationships(relationship_type);

COMMENT ON COLUMN thinker_relationships.relationship_type IS 
  'influenced, opposed, collaborated, student_of, contemporary, responded_to, extended';
```

### Migration 008: Create traditions table

```sql
-- File: migrations/008_create_traditions.sql

CREATE TABLE traditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_th VARCHAR(200),
  description TEXT,
  domain_id UUID REFERENCES domains(id),
  time_period VARCHAR(100),
  key_principles TEXT[],
  founder_ids UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_traditions_domain ON traditions(domain_id);
CREATE INDEX idx_traditions_slug ON traditions(slug);
```

### Migration 009: Create thinker_traditions table

```sql
-- File: migrations/009_create_thinker_traditions.sql

CREATE TABLE thinker_traditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thinker_id UUID NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE,
  tradition_id UUID NOT NULL REFERENCES traditions(id) ON DELETE CASCADE,
  role VARCHAR(50),
  contribution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(thinker_id, tradition_id)
);

CREATE INDEX idx_thinker_traditions_thinker ON thinker_traditions(thinker_id);
CREATE INDEX idx_thinker_traditions_tradition ON thinker_traditions(tradition_id);

COMMENT ON COLUMN thinker_traditions.role IS 
  'founder, major_contributor, follower, critic';
```

---

## Phase 2: Academic Seals System

### Migration 010: Create seal enums

```sql
-- File: migrations/010_create_seal_enums.sql

CREATE TYPE seal_shape AS ENUM ('circle', 'octagon', 'hexagon', 'diamond', 'compass');
CREATE TYPE seal_category AS ENUM ('progression', 'domain', 'time', 'support');
CREATE TYPE seal_tier AS ENUM ('slate', 'blue', 'silver', 'gold');
CREATE TYPE seal_progress_status AS ENUM ('locked', 'in_progress', 'earned');
```

### Migration 011: Create academic_seals table

```sql
-- File: migrations/011_create_academic_seals.sql

CREATE TABLE academic_seals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_th VARCHAR(200),
  description TEXT NOT NULL,
  requirement TEXT NOT NULL,
  
  symbol TEXT NOT NULL,
  shape seal_shape NOT NULL,
  color VARCHAR(7) NOT NULL,
  tier seal_tier NOT NULL,
  
  level INTEGER,
  category seal_category NOT NULL,
  domain_id UUID REFERENCES domains(id),
  
  criteria JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_seals_slug ON academic_seals(slug);
CREATE INDEX idx_seals_category ON academic_seals(category);
CREATE INDEX idx_seals_tier ON academic_seals(tier);
CREATE INDEX idx_seals_level ON academic_seals(level);
CREATE INDEX idx_seals_domain ON academic_seals(domain_id);
```

### Migration 012: Seed academic_seals

```sql
-- File: migrations/012_seed_seals.sql

-- Progression Seals (13 seals)
INSERT INTO academic_seals (slug, name, description, requirement, symbol, shape, color, tier, level, category, criteria, sort_order) VALUES
  ('the-seeker', 'The Seeker', 'You entered the library and began your journey', 'Create account and read first article', '○·', 'circle', '#465264', 'slate', 1, 'progression', '{"type":"read_count","target":1}', 1),
  ('the-reader', 'The Reader', 'You read continuously', 'Read 10 complete articles', '⌇', 'circle', '#465264', 'slate', 2, 'progression', '{"type":"read_count","target":10,"objectType":"article"}', 2),
  -- ... (เหลืออีก 11 progression seals)
  
-- Domain Seals (4 seals — เริ่มต้น)
INSERT INTO academic_seals (slug, name, description, requirement, symbol, shape, color, tier, level, category, domain_id, criteria, sort_order) VALUES
  ('psychology-seal', 'Psychology Seal', 'Master of psychological knowledge', 'Read 50+ articles in Psychology', '⬢', 'hexagon', '#5A9FB5', 'blue', NULL, 'domain', 
   (SELECT id FROM domains WHERE slug = 'psychology'),
   '{"type":"domain_read_count","target":50,"domain":"psychology"}', 16),
  -- ... (เหลืออีก 3 domain seals)

-- Time Seals (2 seals)
-- Support Seals (2 seals)
```

### Migration 013: Create user_seals table

```sql
-- File: migrations/013_create_user_seals.sql

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

CREATE INDEX idx_user_seals_user ON user_seals(user_id);
CREATE INDEX idx_user_seals_seal ON user_seals(seal_id);
CREATE INDEX idx_user_seals_earned ON user_seals(earned_at);
CREATE INDEX idx_user_seals_displayed ON user_seals(user_id, is_displayed) WHERE is_displayed = true;
```

### Migration 014: Create seal_progress table

```sql
-- File: migrations/014_create_seal_progress.sql

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

CREATE INDEX idx_seal_progress_user ON seal_progress(user_id);
CREATE INDEX idx_seal_progress_seal ON seal_progress(seal_id);
CREATE INDEX idx_seal_progress_status ON seal_progress(user_id, status);
CREATE INDEX idx_seal_progress_near ON seal_progress(user_id, progress_percent) 
  WHERE status = 'in_progress';
```

### Migration 015: Create reading_activities table

```sql
-- File: migrations/015_create_reading_activities.sql

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

CREATE INDEX idx_reading_user ON reading_activities(user_id);
CREATE INDEX idx_reading_object ON reading_activities(object_id);
CREATE INDEX idx_reading_domain ON reading_activities(user_id, domain);
CREATE INDEX idx_reading_completed ON reading_activities(user_id, is_completed) 
  WHERE is_completed = true;
CREATE INDEX idx_reading_date ON reading_activities(user_id, read_at);
```

---

## Phase 3: Triggers & Functions

### Function: Auto-update timestamps

```sql
-- File: migrations/016_update_triggers.sql

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_constellations_updated_at BEFORE UPDATE ON constellations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... (apply to all other tables)
```

### Function: Award seal checker

```sql
-- File: migrations/017_seal_award_functions.sql

CREATE OR REPLACE FUNCTION check_and_award_seals(p_user_id UUID)
RETURNS TABLE(seal_id UUID, seal_name VARCHAR) AS $$
DECLARE
  seal RECORD;
  current_val INTEGER;
  target_val INTEGER;
BEGIN
  -- Loop through all seals ที่ user ยังไม่ได้รับ
  FOR seal IN 
    SELECT s.* FROM academic_seals s
    WHERE s.is_active = true
      AND NOT EXISTS (
        SELECT 1 FROM user_seals us 
        WHERE us.user_id = p_user_id AND us.seal_id = s.id
      )
  LOOP
    -- Check criteria และ award ถ้าผ่าน
    -- (logic ซับซ้อน ต้อง implement แยกต่อ criteria type)
    
    -- Example: read_count type
    IF seal.criteria->>'type' = 'read_count' THEN
      SELECT COUNT(*) INTO current_val
      FROM reading_activities
      WHERE user_id = p_user_id AND is_completed = true;
      
      target_val := (seal.criteria->>'target')::INTEGER;
      
      IF current_val >= target_val THEN
        -- Award seal
        INSERT INTO user_seals (user_id, seal_id)
        VALUES (p_user_id, seal.id);
        
        RETURN QUERY SELECT seal.id, seal.name;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

## Phase 4: Data Migration

### Migrate existing thinkers to domains

```sql
-- File: migrations/018_migrate_thinker_domains.sql

-- Parse existing objects.domains array และสร้าง thinker_domains records
INSERT INTO thinker_domains (thinker_id, domain_id, is_primary)
SELECT 
  t.id as thinker_id,
  d.id as domain_id,
  (o.domains[1] = d.slug) as is_primary  -- domain แรกคือ primary
FROM thinkers t
JOIN objects o ON o.id = t.object_id
CROSS JOIN unnest(o.domains) as domain_slug
JOIN domains d ON d.slug = domain_slug
WHERE o.domains IS NOT NULL AND array_length(o.domains, 1) > 0;

-- Update thinkers.primary_domain_id
UPDATE thinkers t
SET primary_domain_id = d.id
FROM objects o
JOIN domains d ON d.slug = o.domains[1]
WHERE t.object_id = o.id 
  AND o.domains IS NOT NULL 
  AND array_length(o.domains, 1) > 0;
```

### Migrate achievements to seals (optional)

```sql
-- File: migrations/019_migrate_achievements_to_seals.sql

-- ถ้าต้องการ migrate achievements เดิมไปเป็น user_seals
-- (ต้อง map achievement codes กับ seal slugs)

INSERT INTO user_seals (user_id, seal_id, earned_at)
SELECT 
  ua.user_id,
  s.id as seal_id,
  ua.earned_at
FROM user_achievements ua
JOIN achievements a ON a.id = ua.achievement_id
JOIN academic_seals s ON s.slug = map_achievement_to_seal(a.code)
WHERE NOT EXISTS (
  SELECT 1 FROM user_seals us
  WHERE us.user_id = ua.user_id AND us.seal_id = s.id
);
```

---

## Rollback Plan

แต่ละ migration ต้องมี rollback script:

```sql
-- File: rollback/015_drop_reading_activities.sql
DROP TABLE IF EXISTS reading_activities CASCADE;

-- File: rollback/014_drop_seal_progress.sql
DROP TABLE IF EXISTS seal_progress CASCADE;

-- ... (rollback scripts สำหรับทุก migration)
```

---

## Testing Strategy

### 1. Unit Tests

Test แต่ละ migration script แยก:

```bash
# Test migration 002
psql -U postgres -d archron_test < migrations/002_create_domains.sql
# Verify: SELECT COUNT(*) FROM domains; -- should be 12

# Test rollback
psql -U postgres -d archron_test < rollback/002_drop_domains.sql
# Verify: domains table should not exist
```

### 2. Integration Tests

Test ทั้ง migration chain:

```bash
# Run all migrations
for f in migrations/*.sql; do
  psql -U postgres -d archron_test < "$f"
done

# Verify schema
psql -U postgres -d archron_test -c "\dt"
psql -U postgres -d archron_test -c "SELECT COUNT(*) FROM domains;"
psql -U postgres -d archron_test -c "SELECT COUNT(*) FROM academic_seals;"
```

### 3. Data Integrity Tests

```sql
-- Test foreign keys
SELECT COUNT(*) FROM thinker_domains td
LEFT JOIN thinkers t ON t.id = td.thinker_id
WHERE t.id IS NULL;  -- should be 0

-- Test constraints
SELECT COUNT(*) FROM thinker_relationships
WHERE source_thinker_id = target_thinker_id;  -- should be 0

-- Test indexes
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE tablename LIKE '%thinker%' OR tablename LIKE '%seal%';
```

---

## Deployment Steps

### Development

```bash
1. Create feature branch: git checkout -b feat/constellation-seals-schema
2. Run migrations on dev DB
3. Seed test data
4. Run integration tests
5. Commit migration files
```

### Staging

```bash
1. Deploy migrations to staging DB
2. Run data migration scripts
3. Verify data integrity
4. Test queries performance
5. Run application tests
```

### Production

```bash
1. Backup database: pg_dump archron_prod > backup_pre_migration.sql
2. Enable maintenance mode (optional)
3. Run migrations (use transaction if possible)
4. Verify critical queries
5. Monitor performance
6. Rollback if issues (use backup + rollback scripts)
```

---

## Performance Considerations

### Indexes

ทุก foreign key และ query column ต้องมี index — ดูในแต่ละ migration file

### Query Performance

Test queries ที่สำคัญ:

```sql
-- Constellation queries
EXPLAIN ANALYZE
SELECT t.*, c.name as constellation
FROM thinkers t
JOIN constellations c ON c.id = t.constellation_id
WHERE c.domain_id = '...';

-- Seal progress queries
EXPLAIN ANALYZE
SELECT s.*, sp.progress_percent
FROM academic_seals s
LEFT JOIN seal_progress sp ON sp.seal_id = s.id AND sp.user_id = '...'
ORDER BY s.sort_order;
```

### Data Volume Estimates

- `domains`: 12 rows
- `constellation_layers`: 5 rows
- `constellations`: ~50-100 rows (ขึ้นกับจำนวนกลุ่มดาวแต่ละ domain)
- `thinkers`: ~500-1,000 rows (existing + ใหม่)
- `thinker_domains`: ~1,500 rows (1.5 domains ต่อ thinker โดยเฉลี่ย)
- `thinker_relationships`: ~2,000-5,000 rows
- `traditions`: ~30-50 rows
- `thinker_traditions`: ~1,000 rows
- `academic_seals`: 21 rows (ขยายได้เป็น ~50 ในอนาคต)
- `user_seals`: ~10,000-100,000 rows (ขึ้นกับจำนวน users)
- `seal_progress`: ~100,000-1,000,000 rows (users × seals × in_progress)
- `reading_activities`: ~1,000,000+ rows (activity log)

**Total:** < 2M rows ในระยะแรก — performance ไม่น่ามีปัญหา

---

## Timeline Estimate

| Phase | Tasks | Duration |
|-------|-------|----------|
| 1. Schema design | Review & finalize schemas | 2 days |
| 2. Write migrations | 19 migration files | 3 days |
| 3. Testing | Unit + integration tests | 2 days |
| 4. Staging deploy | Deploy + verify | 1 day |
| 5. Data seeding | Constellations + seals data | 2 days |
| 6. Production deploy | Deploy + monitor | 1 day |

**Total: ~11 days** (2 weeks with buffer)

---

## Next Steps

1. **Review schemas** — ให้ทีมดูและ approve CONSTELLATION-SCHEMA.md และ SEALS-SCHEMA.md
2. **Write migration files** — สร้าง 19 migration files ตาม plan นี้
3. **Prepare seed data** — เตรียมข้อมูล constellations และ thinker relationships
4. **Update Drizzle schema** — sync กับ TypeScript types (`packages/database/src/schema/`)
5. **Implement award logic** — สร้าง service สำหรับ check และ award seals
6. **Test on dev DB** — verify migrations และ queries

---

End of Migration Plan
