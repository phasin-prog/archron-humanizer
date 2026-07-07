# Academic Seals Database Schema

Version: 1.0  
Status: Design Phase  
Purpose: Database schema สำหรับ Academic Seals System — 21 seals catalog

---

## ภาพรวม

Academic Seals System ต้องการ database schema ที่:

1. **เก็บนิยาม 21 seals** — catalog ของ seals ทั้งหมด
2. **บันทึก seals ที่ user ได้รับ** — user_seals
3. **ติดตามความคืบหน้า** — seal_progress สู่ seal แต่ละอัน
4. **Integration กับ activities** — เชื่อมกับ reads, collections, level

**หมายเหตุ:** ระบบเดิมมี `achievements` + `user_achievements` อยู่แล้ว แต่ Academic Seals มี structure เฉพาะ (shape, color, level, category) จึงออกแบบเป็น tables ใหม่แยกต่างหาก และสามารถ deprecate achievements เดิมได้ในอนาคต

---

## Enums

```typescript
sealShapeEnum = ['circle', 'octagon', 'hexagon', 'diamond', 'compass']

sealCategoryEnum = ['progression', 'domain', 'time', 'support']

sealTierEnum = ['slate', 'blue', 'silver', 'gold']
// Slate: Level 1-2, Blue: Level 3-4, Silver: Level 5-6, Gold: Level 7

sealProgressStatusEnum = ['locked', 'in_progress', 'earned']
```

---

## ตาราง 1: `academic_seals`

นิยามของ 21 seals ทั้งหมด (catalog)

```typescript
academic_seals {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  slug: varchar(100) UNIQUE NOT NULL       // 'the-seeker', 'the-scholar'
  name: varchar(200) NOT NULL              // 'The Seeker'
  name_th: varchar(200)                    // ชื่อภาษาไทย (optional)
  description: text NOT NULL               // คำอธิบายความหมาย
  requirement: text NOT NULL               // เงื่อนไขการได้รับ (คำอธิบาย)
  
  // Visual
  symbol: text NOT NULL                    // SVG path หรือ Unicode
  shape: sealShapeEnum NOT NULL            // 'circle', 'octagon', etc.
  color: varchar(7) NOT NULL               // '#465264' hex color
  tier: sealTierEnum NOT NULL              // 'slate', 'blue', 'silver', 'gold'
  
  // Classification
  level: integer                           // 1-7, NULL for special seals
  category: sealCategoryEnum NOT NULL      // 'progression', 'domain', 'time', 'support'
  domain_id: uuid REFERENCES domains(id)   // สำหรับ domain seals เท่านั้น
  
  // Award logic
  criteria: jsonb NOT NULL                 // machine-readable requirement
  sort_order: integer DEFAULT 0
  is_active: boolean DEFAULT true
  
  created_at: timestamp DEFAULT now()
  updated_at: timestamp DEFAULT now()
}
```

**Indexes:**
```sql
CREATE INDEX idx_seals_slug ON academic_seals(slug);
CREATE INDEX idx_seals_category ON academic_seals(category);
CREATE INDEX idx_seals_tier ON academic_seals(tier);
CREATE INDEX idx_seals_level ON academic_seals(level);
CREATE INDEX idx_seals_domain ON academic_seals(domain_id);
```

### Criteria JSONB Structure

`criteria` เก็บเงื่อนไขแบบ machine-readable เพื่อ auto-award:

```jsonc
// The Reader — อ่าน 10 บทความ
{
  "type": "read_count",
  "target": 10,
  "objectType": "article"
}

// The Explorer — อ่านจาก 5 domains
{
  "type": "domain_diversity",
  "target": 5
}

// The Analyst — อ่านครบ 5 ประเภท
{
  "type": "object_type_diversity",
  "target": 5,
  "types": ["article", "concept", "thinker", "guide", "timeline_event"]
}

// The Devoted — อ่านทุกวัน 30 วัน
{
  "type": "daily_streak",
  "target": 30
}

// The Cartographer — Collection มี 20+ items
{
  "type": "collection_size",
  "target": 20
}

// Psychology Seal — อ่าน 50+ ใน domain
{
  "type": "domain_read_count",
  "target": 50,
  "domain": "psychology"
}

// The Companion — support membership
{
  "type": "membership",
  "membershipType": "companion"
}
```

---

## ตาราง 2: `user_seals`

seals ที่ user แต่ละคนได้รับแล้ว

```typescript
user_seals {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  user_id: uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
  seal_id: uuid NOT NULL REFERENCES academic_seals(id) ON DELETE CASCADE
  earned_at: timestamp DEFAULT now() NOT NULL
  is_displayed: boolean DEFAULT true       // แสดงบน profile หรือไม่
  display_order: integer DEFAULT 0         // ลำดับการแสดงบน profile
  metadata: jsonb                          // context เพิ่มเติม เช่น ค่าตอนที่ได้รับ
  
  UNIQUE(user_id, seal_id)                 // ได้รับ seal ละครั้งเดียว
}
```

**Indexes:**
```sql
CREATE INDEX idx_user_seals_user ON user_seals(user_id);
CREATE INDEX idx_user_seals_seal ON user_seals(seal_id);
CREATE INDEX idx_user_seals_earned ON user_seals(earned_at);
CREATE INDEX idx_user_seals_displayed ON user_seals(user_id, is_displayed) WHERE is_displayed = true;
```

---

## ตาราง 3: `seal_progress`

ติดตามความคืบหน้าสู่ seal แต่ละอัน (สำหรับ seals ที่ยังไม่ได้รับ)

```typescript
seal_progress {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  user_id: uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
  seal_id: uuid NOT NULL REFERENCES academic_seals(id) ON DELETE CASCADE
  
  current_value: integer DEFAULT 0 NOT NULL  // ค่าปัจจุบัน (เช่น อ่านไปแล้ว 7 บทความ)
  target_value: integer NOT NULL             // ค่าเป้าหมาย (เช่น 10)
  progress_percent: integer DEFAULT 0        // 0-100 (computed หรือ cached)
  status: sealProgressStatusEnum DEFAULT 'locked'
  
  progress_data: jsonb                       // รายละเอียด เช่น domains ที่อ่านแล้ว
  last_updated_at: timestamp DEFAULT now()
  created_at: timestamp DEFAULT now()
  
  UNIQUE(user_id, seal_id)
}
```

**Indexes:**
```sql
CREATE INDEX idx_seal_progress_user ON seal_progress(user_id);
CREATE INDEX idx_seal_progress_seal ON seal_progress(seal_id);
CREATE INDEX idx_seal_progress_status ON seal_progress(user_id, status);
CREATE INDEX idx_seal_progress_near ON seal_progress(user_id, progress_percent) 
  WHERE status = 'in_progress';
```

### Progress Data JSONB

เก็บ intermediate state สำหรับ criteria ที่ซับซ้อน:

```jsonc
// Explorer — track domains ที่อ่านแล้ว
{
  "domainsRead": ["psychology", "philosophy", "history"],
  "count": 3
}

// Analyst — track object types
{
  "typesRead": ["article", "concept", "thinker"],
  "count": 3
}

// Devoted — daily streak
{
  "currentStreak": 12,
  "lastReadDate": "2026-07-06",
  "longestStreak": 15
}
```

---

## Integration กับระบบเดิม

### 1. เชื่อมกับ `users`

```sql
user_seals.user_id → users.id
seal_progress.user_id → users.id
```

### 2. เชื่อมกับ Activity Tracking

Seals ต้องการข้อมูล activity เพื่อคำนวณ progress ซึ่งต้องมี table ติดตาม reads

**ต้องสร้าง table ใหม่ (ถ้ายังไม่มี):** `reading_activities`

```typescript
reading_activities {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  user_id: uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
  object_id: uuid NOT NULL REFERENCES objects(id) ON DELETE CASCADE
  object_type: varchar(50) NOT NULL        // denormalized จาก objects
  domain: varchar(100)                     // denormalized domain
  read_at: timestamp DEFAULT now() NOT NULL
  is_completed: boolean DEFAULT false      // อ่านครบถ้วนหรือไม่
  read_duration: integer                   // วินาที
  
  UNIQUE(user_id, object_id)               // 1 read record ต่อ object
}
```

**Indexes:**
```sql
CREATE INDEX idx_reading_user ON reading_activities(user_id);
CREATE INDEX idx_reading_object ON reading_activities(object_id);
CREATE INDEX idx_reading_domain ON reading_activities(user_id, domain);
CREATE INDEX idx_reading_completed ON reading_activities(user_id, is_completed) 
  WHERE is_completed = true;
CREATE INDEX idx_reading_date ON reading_activities(user_id, read_at);
```

### 3. เชื่อมกับ `collections`

Seals ประเภท Collector/Archivist/Cartographer ใช้ข้อมูลจาก `collections` + `collection_items` ที่มีอยู่แล้ว

```sql
-- The Cartographer: Collection มี 20+ items
SELECT c.id FROM collections c
WHERE c.owner_id = $user_id AND c.item_count >= 20;

-- The Archivist: 5+ collections
SELECT COUNT(*) FROM collections WHERE owner_id = $user_id;
```

### 4. เชื่อมกับ `profiles.level`

Seals ประเภท progression ใช้ `profiles.level`

```sql
-- The Architect: Level 7
SELECT id FROM profiles WHERE user_id = $user_id AND level >= 7;
```

---

## Award Logic Flow

```
User activity เกิดขึ้น (read, collect, level up)
        ↓
Update reading_activities / collections / profiles
        ↓
Trigger: Recalculate seal_progress สำหรับ seals ที่เกี่ยวข้อง
        ↓
ถ้า current_value >= target_value:
        ↓
  1. INSERT INTO user_seals (mark as earned)
  2. UPDATE seal_progress SET status = 'earned'
  3. CREATE notification (silent, priority: low)
```

---

## Queries ที่สำคัญ

### Query 1: Seals ทั้งหมดของ user (earned + locked)

```sql
SELECT 
  s.*,
  us.earned_at,
  sp.current_value,
  sp.target_value,
  sp.progress_percent,
  CASE WHEN us.id IS NOT NULL THEN 'earned' 
       ELSE COALESCE(sp.status, 'locked') END as status
FROM academic_seals s
LEFT JOIN user_seals us ON us.seal_id = s.id AND us.user_id = $user_id
LEFT JOIN seal_progress sp ON sp.seal_id = s.id AND sp.user_id = $user_id
WHERE s.is_active = true
ORDER BY s.sort_order;
```

### Query 2: Seals ที่ user ได้รับล่าสุด (Profile overview - 5 อัน)

```sql
SELECT s.*, us.earned_at
FROM user_seals us
JOIN academic_seals s ON s.id = us.seal_id
WHERE us.user_id = $user_id AND us.is_displayed = true
ORDER BY us.earned_at DESC
LIMIT 5;
```

### Query 3: Seals ที่ใกล้ได้รับ (in progress)

```sql
SELECT s.name, sp.progress_percent, sp.current_value, sp.target_value
FROM seal_progress sp
JOIN academic_seals s ON s.id = sp.seal_id
WHERE sp.user_id = $user_id 
  AND sp.status = 'in_progress'
ORDER BY sp.progress_percent DESC
LIMIT 3;
```

### Query 4: จำนวน seals ต่อ category

```sql
SELECT s.category, COUNT(us.id) as earned_count
FROM academic_seals s
LEFT JOIN user_seals us ON us.seal_id = s.id AND us.user_id = $user_id
GROUP BY s.category;
```

---

## 21 Seals Reference (Seed Data)

| # | Slug | Name | Tier | Level | Category | Shape |
|---|------|------|------|-------|----------|-------|
| 1 | the-seeker | The Seeker | slate | 1 | progression | circle |
| 2 | the-reader | The Reader | slate | 2 | progression | circle |
| 3 | the-collector | The Collector | slate | 2 | progression | hexagon |
| 4 | the-scholar | The Scholar | blue | 3 | progression | octagon |
| 5 | the-analyst | The Analyst | blue | 3 | progression | diamond |
| 6 | the-explorer | The Explorer | blue | 4 | progression | circle |
| 7 | the-archivist | The Archivist | blue | 4 | progression | hexagon |
| 8 | the-cartographer | The Cartographer | blue | 4 | progression | hexagon |
| 9 | the-curator | The Curator | silver | 5 | progression | octagon |
| 10 | the-sage | The Sage | silver | 5 | progression | diamond |
| 11 | the-navigator | The Navigator | silver | 6 | progression | circle |
| 12 | the-luminary | The Luminary | silver | 6 | progression | circle |
| 13 | the-architect | The Architect | gold | 7 | progression | octagon |
| 14 | the-companion | The Companion | gold | 7 | support | compass |
| 15 | the-patron | The Patron | gold | 7 | support | diamond |
| 16 | psychology-seal | Psychology Seal | — | — | domain | hexagon |
| 17 | philosophy-seal | Philosophy Seal | — | — | domain | circle |
| 18 | language-seal | Language Seal | — | — | domain | diamond |
| 19 | mythology-seal | Mythology Seal | — | — | domain | compass |
| 20 | the-persistent | The Persistent | silver | — | time | circle |
| 21 | the-devoted | The Devoted | silver | — | time | octagon |

**หมายเหตุ:** Domain seals (16-19) มี `color` เฉพาะตาม domain (ไม่ใช้ tier system):
- Psychology: `#5A9FB5`
- Philosophy: `#9688B8`
- Language: `#6FA589`
- Mythology: `#B56A6A`

Domain seals สามารถขยายไปครบ 12 domains ได้ในอนาคต

---

## สรุป Tables

| Table | Purpose | Key Relations |
|-------|---------|---------------|
| `academic_seals` | catalog 21 seals | → domains |
| `user_seals` | seals ที่ user ได้รับ | users ↔ seals |
| `seal_progress` | ความคืบหน้าสู่ seal | users ↔ seals |
| `reading_activities` | ติดตามการอ่าน (ใหม่) | users ↔ objects |

**Total: 4 tables ใหม่**

---

## ความแตกต่างจาก `achievements` เดิม

| ด้าน | achievements (เดิม) | academic_seals (ใหม่) |
|------|---------------------|----------------------|
| Visual | icon string เดียว | shape + color + tier + symbol SVG |
| Level | ไม่มี | 1-7 tiered |
| Category | ไม่มี | progression/domain/time/support |
| Progress | มีแต่ percent | current/target + progress_data JSONB |
| Domain link | ไม่มี | เชื่อม domain_id |

**แนะนำ:** เก็บ `achievements` ไว้ก่อน (backward compat) แล้วค่อยๆ migrate เป็น `academic_seals` — ดู migration plan

---

End of Academic Seals Schema Design
