# ARCHRON Loop Redesign — Master Plan

Version: 1.0
Date: 2026-07-07
Status: Planning Phase

---

## เป้าหมาย (Goal)

**Loop Redesign All Structure ด้วยภาษาไทย**

ใช้ multi-agent architecture ในการทำงาน

ARCHRON คือแพลตฟอร์มงานเขียนสำหรับทำความเข้าใจมนุษย์ทั้งหมด อิงจากนักคิดหลายท่าน (ไม่ใช่แค่ Psychological Type)

**กระบวนการ:** เขียน → รีวิว → แก้ไข → รีวิว → เทส → จนกว่างานจะสมบูรณ์

---

## หลักการสำคัญ

### 1. ไม่ใช่ "ประวัติศาสตร์บุคคล"

> **เราไม่ได้พูดถึง Jung แต่พูดถึงจิต**
>
> **เราไม่ได้พูดถึง Nietzsche แต่พูดถึงมนุษย์**
>
> **เราไม่ได้พูดถึงศาสนาใดศาสนาหนึ่ง แต่พูดถึงการแสวงหาความหมาย**

### 2. โครงสร้าง Domain แบบ Constellation

แทนที่จะยกใครคนเดียวเป็น "ผู้ก่อตั้ง" ใช้:

```
Domain
  ↓
Origins (รากกำเนิด)
  ↓
Foundational Thinkers (ผู้วางรากฐาน)
  ↓
Constellation of Thinkers (กลุ่มดาวนักคิด)
  ↓
Major Traditions (สำนักสำคัญ)
  ↓
Modern Development (พัฒนาการสมัยใหม่)
```

**ความหมาย:** ความรู้เกิดจากการเชื่อมโยง ไม่ใช่จากอัจฉริยะเพียงคนเดียว

### 3. Achievement System → Academic Seals

**ไม่ใช่:**
- เหรียญเกม (Bronze/Silver/Gold)
- Badge สีสดใส
- Gaming achievement

**เป็น:**
- Academic Seals (ตราประทับวิชาการ)
- Scholarly recognition
- University emblem style

**Level progression:**
```
Seed → Explorer → Scholar → Curator → Architect → Companion
```

**Design:**
- Flat SVG, outline only
- Monochrome (Slate → Blue → Silver → Gold)
- ไม่มี gradient, shadow, 3D
- Animation: Opacity → Scale → Glow (300ms)

---

## การจัดโครงสร้าง 12 Domains

### 1. Psychology
**Origins:** ตำนานและพิธีกรรม, ปรัชญากรีก, การแพทย์โบราณ
**Foundational:** Wilhelm Wundt, William James
**Constellation:** Freud, Jung, Adler, Lacan, Rogers, Frankl, Piaget

### 2. Philosophy
**Origins:** Thales
**Foundational:** Socrates, Plato, Aristotle

### 3. Anthropology
**Foundational:** Edward Burnett Tylor, Franz Boas

### 4. History
**Origins:** Herodotus
**Development:** Thucydides

### 5. Language
**Origins:** Pāṇini
**Modern:** Ferdinand de Saussure, Noam Chomsky

### 6. Mythology
**Origins:** มหากาพย์เมโสโปเตเมีย, กรีก, อียิปต์, อินเดีย
**Modern Study:** Joseph Campbell, Mircea Eliade

### 7. Religion
**Origins:** ศาสนาโบราณ, พิธีกรรม, ชามาน
**Modern Study:** Rudolf Otto, Mircea Eliade

### 8. Science
**Origins:** ธรรมชาติวิทยา
**Foundational:** Galileo Galilei, Isaac Newton

### 9. Symbolism
**Foundational:** Ferdinand de Saussure, Charles Sanders Peirce, Ernst Cassirer

### 10. Art
**Origins:** ศิลปะก่อนประวัติศาสตร์
**Foundational Theory:** Aristotle

### 11. AI
**Foundational:** Alan Turing, John McCarthy

### 12. Civilization
**Major Thinkers:** Arnold J. Toynbee, Oswald Spengler, Samuel P. Huntington

---

## Agent Assignment ตาม AGENT-ARCHITECTURE-v2

### Orchestrator (หลัก)
- ประสานงานทุก agent
- Validate ความสมบูรณ์
- Report execution

### Knowledge Layer

#### 1. Knowledge Architect Agent
**งาน:**
- ออกแบบ Domain structure ใหม่ (12 domains)
- กำหนด Constellation of Thinkers
- จัดโครงสร้าง Origins → Foundational → Constellation

#### 2. Semantic Architect Agent
**งาน:**
- สร้าง relationships ระหว่าง thinkers
- เชื่อม concepts ข้าม domains
- ออกแบบ Knowledge Graph navigation

#### 3. Reference Architect Agent
**งาน:**
- ตรวจสอบ citations ของทุก thinker
- เพิ่ม DOI, ISBN
- Validate แหล่งอ้างอิง

#### 4. Timeline Architect Agent
**งาน:**
- สร้าง chronology timeline
- เชื่อม events กับ thinkers
- ออกแบบ historical flow

### Product Layer

#### 5. UX Architect Agent
**งาน:**
- ออกแบบ navigation flow ใหม่
- จัด information hierarchy
- User journey สำหรับ domain exploration

#### 6. Design System Architect Agent
**งาน:**
- ออกแบบ Academic Seals system
- สร้าง seal components
- Color system สำหรับ seals

#### 7. Public Platform Architect Agent
**งาน:**
- ออกแบบ domain pages
- Constellation view
- Achievement/Seals UI

### Engineering Layer

#### 8. Frontend Architect Agent
**งาน:**
- สร้าง React components สำหรับ domain structure
- Constellation visualization
- Seal animation

#### 9. Database Architect Agent
**งาน:**
- Schema สำหรับ constellation relationships
- Achievement/Seals tables
- Domain hierarchy

#### 10. Rendering Architect Agent
**งาน:**
- Render domain content
- Thinker profiles
- Constellation links

### Quality Layer

#### 11. QA Architect Agent
**งาน:**
- Test navigation
- Responsive design
- Accessibility

#### 12. Documentation Architect Agent
**งาน:**
- เขียน documentation ภาษาไทย
- API docs
- User guides

---

## Workflow ตามลำดับ Phase

### Phase 1: Information Architecture (ปัจจุบัน: ✅ Complete)
**ต้องทบทวน:**
- Domain hierarchy ตาม Constellation model
- Navigation structure
- Metadata schema

**Agents:** Knowledge Architect, Semantic Architect

---

### Phase 2: Knowledge Object Model (ปัจจุบัน: ✅ Complete)
**ต้องเพิ่ม:**
- `Constellation` object type
- `AcademicSeal` object type
- Thinker relationships

**Agents:** Knowledge Architect, Database Architect

---

### Phase 3: Database Architecture (ปัจจุบัน: ✅ Complete)
**ต้องเพิ่ม:**
- `constellations` table
- `academic_seals` table
- `thinker_relationships` table

**Agents:** Database Architect

---

### Phase 4: Rendering Engine (ปัจจุบัน: ⚠️ Typecheck fails)
**ต้องแก้:**
- แก้ typecheck errors
- เพิ่ม constellation rendering
- Thinker profile rendering

**Agents:** Rendering Architect, QA Architect

---

### Phase 5: Design System (ปัจจุบัน: ✅ Complete)
**ต้องเพิ่ม:**
- Academic Seals components
- Constellation visualization components
- Domain color system

**Agents:** Design System Architect, Frontend Architect

---

### Phase 7: Public Platform (ปัจจุบัน: 🔌 Placeholder data)
**ต้องสร้าง:**
- Domain pages (12 domains)
- Constellation view
- Thinker profiles
- Academic Seals UI

**Agents:** Public Platform Architect, Frontend Architect, UX Architect

---

### Phase 8: Knowledge Graph (ปัจจุบัน: 🔨 Scaffold only)
**ต้องสร้าง:**
- Constellation navigation
- Force-directed layout สำหรับ thinkers
- Interactive graph

**Agents:** Frontend Architect, Semantic Architect

---

### Phase 9: Community & Companion (ปัจจุบัน: ⚠️ Auth functional, UI missing)
**ต้องสร้าง:**
- Profile page พร้อม Academic Seals
- Achievement system
- Reading progress tracking

**Agents:** Frontend Architect, Database Architect, UX Architect

---

## กระบวนการทำงาน (Loop)

```
┌─────────────────────────────────────┐
│  1. Orchestrator วางแผนงาน          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Knowledge Layer Agents          │
│     - ออกแบบโครงสร้างความรู้         │
│     - กำหนด relationships            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. Product Layer Agents            │
│     - ออกแบบ UX/UI                  │
│     - สร้าง components               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. Engineering Layer Agents        │
│     - สร้าง database schema         │
│     - เขียน code                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  5. Quality Layer Agents            │
│     - Review code                    │
│     - Test                           │
│     - Document                       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  6. Orchestrator รวมผล              │
│     - ตรวจสอบความสมบูรณ์             │
│     - Report                         │
└──────────────┬──────────────────────┘
               │
               ▼
        งานสมบูรณ์? 
               │
        ไม่ → กลับไป step 2
               │
        ใช่ → เสร็จสิ้น
```

---

## Deliverables (ผลลัพธ์ที่ต้องได้)

### 1. Documentation (ภาษาไทย)
- [ ] `docs/domains/CONSTELLATION-MODEL.md`
- [ ] `docs/domains/12-DOMAINS-STRUCTURE.md`
- [ ] `docs/community/ACADEMIC-SEALS-SYSTEM.md`
- [ ] `docs/design/SEALS-DESIGN.md`

### 2. Database Schema
- [ ] `constellations` table
- [ ] `academic_seals` table
- [ ] `thinker_relationships` table
- [ ] `user_seals` table

### 3. Components
- [ ] `AcademicSeal` component
- [ ] `ConstellationView` component
- [ ] `DomainPage` component
- [ ] `ThinkerProfile` component

### 4. Pages
- [ ] 12 domain pages (`/domains/[slug]`)
- [ ] Constellation visualization page
- [ ] Profile page with seals
- [ ] Achievement page

### 5. Tests
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

---

## ข้อจำกัด (Constraints)

1. **ห้ามทำงานนอกเหนือจาก Phase**
   - ทำทีละ Phase
   - Complete Phase หนึ่งก่อนไป Phase ถัดไป

2. **ต้องตรงตาม Design Constitution**
   - Blue primary (#5F8DCE)
   - Gold premium only (#B89A63)
   - Muted colors
   - Academic style

3. **ทุก agent ต้อง report ผลงาน**
   - Summary
   - Decisions
   - Files changed
   - Risks
   - Recommendations

4. **ภาษาไทยในเอกสาร**
   - Documentation เป็นภาษาไทย
   - Code comments เป็นภาษาไทย (ที่จำเป็น)
   - UI labels รองรับภาษาไทย

---

## ลำดับความสำคัญ (Priority)

### Priority 1 (เริ่มทันที)
1. แก้ typecheck errors ใน Phase 4
2. สร้าง Constellation model documentation
3. ออกแบบ Academic Seals system

### Priority 2 (ต่อเนื่อง)
4. สร้าง database schema
5. สร้าง components
6. สร้าง 12 domain pages

### Priority 3 (สุดท้าย)
7. Tests
8. Documentation ภาษาไทยฉบับสมบูรณ์
9. Optimization

---

## Success Criteria (เงื่อนไขความสำเร็จ)

✅ **Phase 4** typecheck ผ่าน 100%
✅ **12 Domains** มี structure แบบ Constellation ครบ
✅ **Academic Seals** ใช้งานได้จริง มี animation
✅ **Constellation View** แสดง relationships ระหว่าง thinkers
✅ **Profile Page** แสดง seals ที่ได้รับ
✅ **Documentation** ภาษาไทยครบถ้วน
✅ **Tests** coverage ≥ 80%
✅ **Design Constitution** compliance 100%

---

## Timeline (คาดการณ์)

| Phase | งาน | เวลา (ประมาณ) |
|-------|-----|---------------|
| Phase 1 | Review + ปรับ IA | 2 agents × 1 day |
| Phase 2 | เพิ่ม object models | 2 agents × 1 day |
| Phase 3 | Database schema | 1 agent × 1 day |
| Phase 4 | แก้ typecheck + rendering | 2 agents × 2 days |
| Phase 5 | Design Seals + components | 2 agents × 2 days |
| Phase 7 | สร้าง pages | 3 agents × 3 days |
| Phase 8 | Constellation graph | 2 agents × 2 days |
| Phase 9 | Profile + achievements | 2 agents × 2 days |
| Quality | Review + test + docs | 3 agents × 2 days |

**Total:** ~16 days (คาดการณ์)

---

## เริ่มต้น: Agent Assignments

### Step 1: Knowledge Architect Agent
**Task:** สร้าง `docs/domains/CONSTELLATION-MODEL.md`
- กำหนดโครงสร้าง Domain → Origins → Constellation
- เขียนเป็นภาษาไทย
- Review ก่อน implement

### Step 2: Design System Architect Agent
**Task:** สร้าง `docs/design/ACADEMIC-SEALS-DESIGN.md`
- ออกแบบ seal system
- Visual examples
- Animation specs

### Step 3: Database Architect Agent
**Task:** วางแผน schema changes
- Review ต่อจาก Knowledge Architect
- เตรียม migration

---

End of Master Plan
