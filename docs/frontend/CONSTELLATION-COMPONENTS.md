# Constellation Components Architecture

Version: 1.0  
Status: Design Specification  
Created: 2026-07-07

---

## ภาพรวม

เอกสารนี้กำหนดโครงสร้าง React components สำหรับระบบ Constellation ตาม `docs/domains/CONSTELLATION-MODEL.md`

Constellation เป็นระบบแสดง **กลุ่มดาวนักคิด** — เครือข่ายของผู้คิดที่เชื่อมโยงกันข้ามเวลาและสาขาวิชา

---

## หลักการออกแบบ

### 1. ไม่ใช่ Social Network Graph

Constellation ไม่ใช่กราฟโซเชียลเน็ตเวิร์ก มันคือ **แผนที่ความคิด**

- ไม่มี followers/following count
- ไม่มี like/share buttons
- ไม่มี viral mechanics

### 2. เน้นความหมายทางวิชาการ

- แสดงความสัมพันธ์ทางความคิด ไม่ใช่ความสัมพันธ์ส่วนตัว
- ใช้สีตาม Domain (`docs/DESIGN-CONSTITUTION.md`)
- Typography สงบ อ่านง่าย

### 3. Progressive Disclosure

- Overview: แสดงภาพรวม 12 Domains
- Domain View: แสดง Constellation ของแต่ละ Domain
- Thinker View: แสดงรายละเอียดและเครือข่าย

---

## Component Tree

```
ConstellationView
├── DomainGrid
│   └── DomainCard (×12)
│
└── DomainConstellationView
    ├── LayerSection
    │   ├── OriginsSection
    │   ├── FoundationalSection
    │   └── ConstellationSection
    │
    ├── ConstellationMap (Interactive Graph)
    │   └── ThinkerNode (×N)
    │
    └── ThinkerList
        └── ThinkerCard (×N)

ThinkerProfileView
├── ThinkerProfileHeader
├── ThinkerBio
├── ConstellationPosition (แสดงตำแหน่งใน Constellation)
├── RelatedThinkers
│   └── ThinkerCard (×N)
└── ConceptsGrid
    └── ConceptCard (×N)
```

---

## Components Specification

### 1. ConstellationView

**Purpose:** หน้าหลักของ Constellation — แสดง 12 Domains

**Props:**
```typescript
interface ConstellationViewProps {
  domains: Domain[];
  selectedDomainId?: string;
  onDomainSelect: (domainId: string) => void;
}

interface Domain {
  id: string;
  slug: string; // 'psychology'
  name: string; // 'Psychology'
  nameLocal: string; // 'จิตวิทยา'
  description: string;
  color: string; // '#5A9FB5'
  thinkerCount: number;
  icon: React.ReactNode; // Domain glyph
}
```

**Layout:**
```
┌────────────────────────────────────────┐
│  Constellation                         │
│  แผนที่แห่งความคิดของมนุษยชาติ         │
│  ────────────────────────────────────  │
│                                        │
│  [Psychology] [Philosophy] [Anthro]   │
│  [History]    [Language]   [Myth]     │
│  [Religion]   [Science]    [Symbol]   │
│  [Art]        [AI]         [Civili]   │
└────────────────────────────────────────┘
```

**Behavior:**
- Grid layout: 3 columns desktop, 2 columns tablet, 1 column mobile
- Click card → navigate to `/constellation/{domain-slug}`
- Hover: subtle lift (2px translateY)

---

### 2. DomainCard

**Purpose:** Card แสดงแต่ละ Domain พร้อม icon และจำนวนนักคิด

**Props:**
```typescript
interface DomainCardProps {
  domain: Domain;
  onClick: () => void;
  className?: string;
}
```

**Visual Structure:**
```
┌──────────────────────┐
│   ⬡ Psychology       │
│   จิตวิทยา           │
│   ──────────────     │
│   การศึกษาจิตและ...  │
│   42 thinkers        │
└──────────────────────┘
```

**Styling:**
- IconBox with domain color
- Card background: `#293241` (Surface)
- Border: domain color on hover
- Typography: Inter 600 for name, Lora 400 for description

---

### 3. DomainConstellationView

**Purpose:** แสดง Constellation ของ Domain เดียว พร้อม Layers

**Props:**
```typescript
interface DomainConstellationViewProps {
  domain: Domain;
  origins: Origin[];
  foundational: Thinker[];
  constellation: Thinker[];
  traditions: Tradition[];
  modernDevelopment: string[];
}

interface Origin {
  id: string;
  title: string;
  description: string;
  era?: string; // 'Ancient Greece', 'Medieval'
}

interface Thinker {
  id: string;
  slug: string;
  fullName: string;
  shortName?: string; // 'Jung' instead of 'Carl Gustav Jung'
  lifespan: string; // '1875-1961'
  domains: string[]; // ['psychology', 'mythology']
  description: string;
  portraitUrl?: string;
  position?: { x: number; y: number }; // สำหรับ graph layout
}

interface Tradition {
  id: string;
  name: string;
  description: string;
  thinkers: string[]; // thinker IDs
  color?: string;
}
```

**Layout:**
```
┌────────────────────────────────────────────────┐
│  ← Back to Constellation                       │
│                                                │
│  Psychology Constellation                      │
│  จิตวิทยา                                      │
│  ──────────────────────────────────────────    │
│                                                │
│  Origins ▼                                     │
│    ○ Greek Philosophy                          │
│    ○ Ancient Medicine                          │
│                                                │
│  Foundational Thinkers ▼                       │
│    [Wundt]  [James]                           │
│                                                │
│  Constellation ▼                               │
│    [Interactive Graph View]                    │
│    or                                          │
│    [Grid of Thinker Cards]                    │
│                                                │
│  Major Traditions ▼                            │
│    • Psychoanalysis                           │
│    • Behaviorism                              │
│    • Humanistic Psychology                    │
│                                                │
│  Modern Development ▼                          │
│    • Neuropsychology                          │
│    • Positive Psychology                      │
└────────────────────────────────────────────────┘
```

---

### 4. LayerSection

**Purpose:** Section component สำหรับแสดง Origins/Foundational/Constellation

**Props:**
```typescript
interface LayerSectionProps {
  title: string;
  description?: string;
  layer: 'origins' | 'foundational' | 'constellation';
  defaultExpanded?: boolean;
  children: React.ReactNode;
}
```

**Visual:**
```
┌────────────────────────────────────┐
│  Origins ▼                         │
│  รากกำเนิดของความรู้                │
│  ────────────────────────────      │
│                                    │
│  {children}                        │
└────────────────────────────────────┘
```

**Behavior:**
- Collapsible (ใช้ `Collapsible` component)
- Smooth expand/collapse animation (220ms)
- Icon chevron rotates เมื่อ expand/collapse

---

### 5. ConstellationMap

**Purpose:** Interactive graph visualization แสดงนักคิดและความสัมพันธ์

**Props:**
```typescript
interface ConstellationMapProps {
  thinkers: Thinker[];
  connections: Connection[];
  selectedThinkerId?: string;
  onThinkerClick: (thinkerId: string) => void;
  viewMode: 'graph' | 'grid';
}

interface Connection {
  from: string; // thinker ID
  to: string;
  type: 'influenced' | 'critiqued' | 'collaborated' | 'contemporary';
  label?: string;
}
```

**Implementation Options:**

**Option A: Canvas-based (recommended)**
- ใช้ Canvas API หรือ WebGL
- Performance ดีกว่าเมื่อมีนักคิดเยอะ (50+)
- Libraries: `react-force-graph-2d`, `vis-network`, custom Canvas

**Option B: SVG-based**
- ใช้ SVG + D3.js
- Accessibility ดีกว่า
- Performance ต่ำกว่าเมื่อมีโหนดเยอะ

**Recommendation:** เริ่มต้นด้วย Grid View ก่อน แล้วค่อยเพิ่ม Graph View ใน Phase 2

---

