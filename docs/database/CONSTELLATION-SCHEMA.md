# Constellation Model Database Schema

Version: 1.0  
Status: Design Phase  
Purpose: Database schema สำหรับ Constellation Model — การจัดโครงสร้างนักคิด 12 domains

---

## ภาพรวม

Constellation Model ต้องการ database schema ที่:

1. **รองรับ 12 Domains** — Psychology, Philosophy, Anthropology, etc.
2. **จัดระดับชั้น 5 layers** — Origins, Foundational, Constellation, Traditions, Modern
3. **เชื่อมโยง Thinkers** — ความสัมพันธ์ระหว่างนักคิด cross-domain
4. **Integration กับ Objects** — เชื่อมกับ knowledge objects ที่มีอยู่

---

## ตาราง 1: `domains`

เก็บข้อมูล 12 domains หลักของ ARCHRON

```typescript
domains {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  slug: varchar(100) UNIQUE NOT NULL  // 'psychology', 'philosophy'
  name: varchar(200) NOT NULL          // 'Psychology', 'Philosophy'
  name_th: varchar(200)                // 'จิตวิทยา', 'ปรัชญา'
  description: text
  color: varchar(7) NOT NULL           // '#5A9FB5' (ตาม Design Constitution)
  icon: varchar(50)                    // icon name or emoji
  sort_order: integer NOT NULL
  is_active: boolean DEFAULT true
  created_at: timestamp DEFAULT now()
  updated_at: timestamp DEFAULT now()
}
```

**Indexes:**
```sql
CREATE INDEX idx_domains_slug ON domains(slug);
CREATE INDEX idx_domains_sort_order ON domains(sort_order);
```

**Data:**
```sql
INSERT INTO domains (slug, name, name_th, color, sort_order) VALUES
  ('psychology', 'Psychology', 'จิตวิทยา', '#5A9FB5', 1),
  ('philosophy', 'Philosophy', 'ปรัชญา', '#9688B8', 2),
  ('anthropology', 'Anthropology', 'มานุษยวิทยา', '#B8866F', 3),
  -- ... 9 domains อื่นๆ
```

---

## ตาราง 2: `constellation_layers`

เก็บนิยาม 5 layers ของ Constellation Model

```typescript
constellation_layers {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  slug: varchar(50) UNIQUE NOT NULL     // 'origins', 'foundational'
  name: varchar(200) NOT NULL           // 'Origins', 'Foundational Thinkers'
  name_th: varchar(200)                 // 'รากกำเนิด', 'ผู้วางรากฐาน'
  description: text
  sequence: integer NOT NULL            // 1-5
  created_at: timestamp DEFAULT now()
}
```

**Data:**
```sql
INSERT INTO constellation_layers (slug, name, name_th, sequence) VALUES
  ('origins', 'Origins', 'รากกำเนิด', 1),
  ('foundational', 'Foundational Thinkers', 'ผู้วางรากฐาน', 2),
  ('constellation', 'Constellation of Thinkers', 'กลุ่มดาวนักคิด', 3),
  ('traditions', 'Major Traditions', 'สำนักสำคัญ', 4),
  ('modern', 'Modern Development', 'พัฒนาการสมัยใหม่', 5);
```

---

## ตาราง 3: `constellations`

กลุ่มดาวนักคิดในแต่ละ domain

```typescript
constellations {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  domain_id: uuid NOT NULL REFERENCES domains(id) ON DELETE CASCADE
  name: varchar(300) NOT NULL          // 'Psychoanalytic Constellation'
  name_th: varchar(300)
  description: text
  time_period: varchar(100)            // '1890-1960', 'Late 19th - Early 20th Century'
  central_question: text               // คำถามหลักที่กลุ่มนี้ตอบ
  layer_id: uuid REFERENCES constellation_layers(id)
  sort_order: integer DEFAULT 0
  created_at: timestamp DEFAULT now()
  updated_at: timestamp DEFAULT now()
}
```

**Indexes:**
```sql
CREATE INDEX idx_constellations_domain ON constellations(domain_id);
CREATE INDEX idx_constellations_layer ON constellations(layer_id);
```

---

## ตาราง 4: `thinkers` (ปรับปรุงจากเดิม)

เพิ่ม fields สำหรับ Constellation Model ใน table `thinkers` ที่มีอยู่

```typescript
ALTER TABLE thinkers ADD COLUMN:
  primary_domain_id: uuid REFERENCES domains(id)
  constellation_id: uuid REFERENCES constellations(id)
  layer_id: uuid REFERENCES constellation_layers(id)
  influence_score: integer DEFAULT 0    // คะแนนอิทธิพล
  time_period: varchar(100)             // '1856-1939'
  primary_work: text                    // งานสำคัญที่สุด
  key_concepts: text[]                  // แนวคิดหลัก
```

**ไม่ต้องสร้าง table ใหม่** — ใช้ `thinkers` ที่มีอยู่แล้วและเพิ่ม columns

---

## ตาราง 5: `thinker_domains`

นักคิด 1 คนสามารถอยู่ใน หลาย domains ได้ (many-to-many)

```typescript
thinker_domains {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  thinker_id: uuid NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE
  domain_id: uuid NOT NULL REFERENCES domains(id) ON DELETE CASCADE
  is_primary: boolean DEFAULT false     // domain หลักของนักคิด
  contribution: text                    // ผลงานใน domain นี้
  created_at: timestamp DEFAULT now()
  
  UNIQUE(thinker_id, domain_id)
}
```

**Indexes:**
```sql
CREATE INDEX idx_thinker_domains_thinker ON thinker_domains(thinker_id);
CREATE INDEX idx_thinker_domains_domain ON thinker_domains(domain_id);
CREATE INDEX idx_thinker_domains_primary ON thinker_domains(is_primary) WHERE is_primary = true;
```

---

## ตาราง 6: `thinker_relationships`

ความสัมพันธ์ระหว่างนักคิด — influenced, opposed, collaborated, etc.

```typescript
thinker_relationships {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  source_thinker_id: uuid NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE
  target_thinker_id: uuid NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE
  relationship_type: varchar(50) NOT NULL  // 'influenced', 'opposed', 'collaborated', 'student_of', 'contemporary'
  description: text                        // อธิบายความสัมพันธ์
  weight: integer DEFAULT 1                // 1-10 น้ำหนักความสัมพันธ์
  confidence: varchar(20) DEFAULT 'suggested'  // 'verified', 'suggested', 'speculative'
  created_at: timestamp DEFAULT now()
  updated_at: timestamp DEFAULT now()
  
  CHECK (source_thinker_id != target_thinker_id)
}
```

**Indexes:**
```sql
CREATE INDEX idx_thinker_rels_source ON thinker_relationships(source_thinker_id);
CREATE INDEX idx_thinker_rels_target ON thinker_relationships(target_thinker_id);
CREATE INDEX idx_thinker_rels_type ON thinker_relationships(relationship_type);
```

**Relationship Types:**
- `influenced` — A มีอิทธิพลต่อ B
- `opposed` — A คัดค้าน/ต่อต้าน B
- `collaborated` — A ร่วมงานกับ B
- `student_of` — A เป็นศิษย์ของ B
- `contemporary` — A และ B อยู่ในยุคเดียวกัน
- `responded_to` — A ตอบสนองต่อแนวคิดของ B
- `extended` — A ขยายแนวคิดของ B

---

## ตาราง 7: `traditions`

สำนักความคิด — Psychoanalysis, Existentialism, Structuralism

```typescript
traditions {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  slug: varchar(100) UNIQUE NOT NULL
  name: varchar(200) NOT NULL
  name_th: varchar(200)
  description: text
  domain_id: uuid REFERENCES domains(id)  // domain หลัก (ถ้ามี)
  time_period: varchar(100)
  key_principles: text[]                  // หลักการสำคัญ
  founder_ids: uuid[]                     // array of thinker IDs
  created_at: timestamp DEFAULT now()
  updated_at: timestamp DEFAULT now()
}
```

**Indexes:**
```sql
CREATE INDEX idx_traditions_domain ON traditions(domain_id);
CREATE INDEX idx_traditions_slug ON traditions(slug);
```

---

## ตาราง 8: `thinker_traditions`

นักคิดสามารถสังกัดหลาย traditions ได้

```typescript
thinker_traditions {
  id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
  thinker_id: uuid NOT NULL REFERENCES thinkers(id) ON DELETE CASCADE
  tradition_id: uuid NOT NULL REFERENCES traditions(id) ON DELETE CASCADE
  role: varchar(50)             // 'founder', 'major_contributor', 'follower', 'critic'
  contribution: text
  created_at: timestamp DEFAULT now()
  
  UNIQUE(thinker_id, tradition_id)
}
```

**Indexes:**
```sql
CREATE INDEX idx_thinker_traditions_thinker ON thinker_traditions(thinker_id);
CREATE INDEX idx_thinker_traditions_tradition ON thinker_traditions(tradition_id);
```

---

## Integration กับระบบเดิม

### 1. เชื่อมกับ `objects` table

`thinkers` table มี `object_id` อยู่แล้ว → ไม่ต้องเปลี่ยนแปลง

```sql
-- นักคิดคือ object ชนิดหนึ่ง
SELECT o.*, t.* 
FROM objects o
JOIN thinkers t ON t.object_id = o.id
WHERE o.object_type = 'thinker'
```

### 2. เชื่อมกับ `relationships` table

ใช้ `relationships` table ที่มีอยู่สำหรับ Object-level relationships

`thinker_relationships` ใช้สำหรับ Thinker-specific relationships

```sql
-- Object-level: บทความพูดถึงนักคิด
relationships WHERE relation_type = 'mentioned_in'

-- Thinker-level: นักคิด A มีอิทธิพลต่อ B
thinker_relationships WHERE relationship_type = 'influenced'
```

### 3. Domain Tags

`objects.domains` array ใช้ string slugs

```sql
-- ต้องตรงกับ domains.slug
objects.domains = ['psychology', 'philosophy']
```

---

## Queries ที่สำคัญ

### Query 1: นักคิดทั้งหมดใน Domain

```sql
SELECT t.*, d.name as domain_name
FROM thinkers t
JOIN thinker_domains td ON td.thinker_id = t.id
JOIN domains d ON d.id = td.domain_id
WHERE d.slug = 'psychology'
  AND td.is_primary = true
ORDER BY t.influence_score DESC;
```

### Query 2: Constellation ของ Domain

```sql
SELECT 
  c.name as constellation_name,
  array_agg(t.full_name ORDER BY t.influence_score DESC) as thinkers
FROM constellations c
JOIN thinkers t ON t.constellation_id = c.id
WHERE c.domain_id = (SELECT id FROM domains WHERE slug = 'psychology')
GROUP BY c.id, c.name
ORDER BY c.sort_order;
```

### Query 3: ความสัมพันธ์ของนักคิด

```sql
SELECT 
  t1.full_name as from_thinker,
  tr.relationship_type,
  t2.full_name as to_thinker,
  tr.description
FROM thinker_relationships tr
JOIN thinkers t1 ON t1.id = tr.source_thinker_id
JOIN thinkers t2 ON t2.id = tr.target_thinker_id
WHERE t1.id = $thinker_id
ORDER BY tr.weight DESC;
```

### Query 4: Layers ของ Domain

```sql
SELECT 
  cl.name as layer,
  cl.sequence,
  array_agg(t.full_name) as thinkers
FROM constellation_layers cl
LEFT JOIN thinkers t ON t.layer_id = cl.id
LEFT JOIN thinker_domains td ON td.thinker_id = t.id
WHERE td.domain_id = (SELECT id FROM domains WHERE slug = 'psychology')
GROUP BY cl.id, cl.name, cl.sequence
ORDER BY cl.sequence;
```

---

## Performance Considerations

### Indexes

ทุก foreign key ต้องมี index:

```sql
CREATE INDEX idx_thinkers_constellation ON thinkers(constellation_id);
CREATE INDEX idx_thinkers_layer ON thinkers(layer_id);
CREATE INDEX idx_thinkers_domain ON thinkers(primary_domain_id);
CREATE INDEX idx_constellations_domain ON constellations(domain_id);
```

### Materialized Views (Optional)

สำหรับ queries ที่ซับซ้อน:

```sql
CREATE MATERIALIZED VIEW domain_statistics AS
SELECT 
  d.id,
  d.slug,
  COUNT(DISTINCT td.thinker_id) as thinker_count,
  COUNT(DISTINCT c.id) as constellation_count,
  COUNT(DISTINCT tr.id) as tradition_count
FROM domains d
LEFT JOIN thinker_domains td ON td.domain_id = d.id
LEFT JOIN constellations c ON c.domain_id = d.id
LEFT JOIN traditions tr ON tr.domain_id = d.id
GROUP BY d.id, d.slug;

CREATE UNIQUE INDEX idx_domain_stats_id ON domain_statistics(id);
```

---

## สรุป Tables

| Table | Purpose | Key Relations |
|-------|---------|---------------|
| `domains` | 12 domains หลัก | → constellations, thinker_domains |
| `constellation_layers` | 5 layers | → thinkers, constellations |
| `constellations` | กลุ่มดาวนักคิด | → domains, thinkers |
| `thinkers` (extended) | นักคิดแต่ละคน | → objects, domains, constellation |
| `thinker_domains` | นักคิด ↔ domains | thinkers ↔ domains |
| `thinker_relationships` | ความสัมพันธ์นักคิด | thinkers ↔ thinkers |
| `traditions` | สำนักความคิด | → domains |
| `thinker_traditions` | นักคิด ↔ traditions | thinkers ↔ traditions |

**Total: 8 tables** (6 ใหม่ + 2 ปรับปรุง)

---

End of Constellation Schema Design
