# Constellation & Seals — Frontend Components

Version: 1.0  
Status: Design Phase  
Purpose: Component architecture สำหรับ Constellation และ Academic Seals

---

## Component Tree

```
App
├── ConstellationModule
│   ├── DomainCard
│   ├── DomainPage
│   │   ├── LayerSection
│   │   └── ThinkerCard
│   ├── ThinkerProfile
│   │   ├── ThinkerHeader
│   │   ├── CoreIdeas
│   │   ├── RelatedThinkers
│   │   └── RelatedContent
│   └── ConstellationMap (optional graph view)
│
└── SealsModule
    ├── SealCard
    ├── SealGallery
    ├── SealProgress
    ├── SealNotification
    └── SealDetailModal
```

---

## Constellation Components

### 1. DomainCard

**Purpose:** แสดง domain pill บน homepage

```typescript
interface DomainCardProps {
  slug: string          // 'psychology'
  name: string          // 'Psychology'
  nameTh?: string       // 'จิตวิทยา'
  icon: string          // icon name
  color: string         // '#5F8DCE'
  onClick?: () => void
}
```

**Design:**
- Pill shape, rounded-full
- Icon + label
- Hover: border color change

---

### 2. DomainPage

**Purpose:** หน้า domain เต็ม แสดง 6 layers

```typescript
interface DomainPageProps {
  domain: Domain
  layers: {
    origins: string[]
    foundational: Thinker[]
    constellation: Thinker[]
    traditions: string[]
    modern: string[]
  }
}
```

**Layout:**
- Vertical stack
- Each layer เป็น section
- Sticky header

---

### 3. ThinkerCard

**Purpose:** Card แสดงนักคิดแต่ละคน

```typescript
interface ThinkerCardProps {
  id: string
  name: string
  era: string           // '1875-1961'
  domain: string        // 'Psychology'
  tradition?: string    // 'Psychoanalysis'
  imageUrl?: string
  onClick?: () => void
}
```

**Design:**
- Card 200×260px
- Image/avatar top
- Name + era
- Tradition badge (ถ้ามี)

---

### 4. ThinkerProfile

**Purpose:** หน้า profile นักคิดเต็ม

```typescript
interface ThinkerProfileProps {
  thinker: {
    name: string
    era: string
    nationality: string
    domain: string[]
    coreIdeas: string[]
    influencedBy: Thinker[]
    influenced: Thinker[]
    majorWorks: Work[]
  }
  relatedContent: {
    concepts: number
    articles: number
    guides: number
  }
}
```

**Sections:**
1. Header (name, era, photo)
2. Core Ideas (list)
3. Related Thinkers (influenced by/influenced)
4. Major Works (books)
5. Related Content (link ไป concepts/articles)

---

### 5. ConstellationMap (Optional)

**Purpose:** Graph visualization ของความสัมพันธ์

```typescript
interface ConstellationMapProps {
  nodes: ThinkerNode[]
  edges: Relationship[]
  onNodeClick: (id: string) => void
}

interface ThinkerNode {
  id: string
  name: string
  x: number
  y: number
}

interface Relationship {
  from: string
  to: string
  type: 'influenced' | 'disagreed' | 'collaborated'
}
```

**Implementation:**
- ใช้ D3.js หรือ React Flow
- Force-directed layout
- SVG rendering

---

## Seals Components

### 1. AcademicSeal

**Purpose:** SVG component สำหรับ seal แต่ละอัน

```typescript
interface AcademicSealProps {
  sealId: string        // 'the-scholar'
  isEarned: boolean
  size?: 'sm' | 'md' | 'lg'  // 48px | 64px | 96px
  color: string         // 'slate' | 'blue' | 'silver' | 'gold'
  onClick?: () => void
}
```

**Design:**
- SVG inline
- 2px stroke
- Monochrome (ตาม color prop)
- Animate on unlock

---

### 2. SealCard

**Purpose:** Card แสดง seal พร้อมข้อมูล

```typescript
interface SealCardProps {
  seal: {
    id: string
    name: string
    level: number
    color: string
    requirement: string
    isEarned: boolean
    earnedAt?: Date
    progress?: {
      current: number
      total: number
    }
  }
  onClick?: () => void
}
```

**Layout:**
```
┌────────────┐
│     ○      │
│ The Scholar│
│ Level 3    │
│            │
│ ━━━── 87%  │ ← progress (ถ้ายังไม่ได้)
└────────────┘
```

---

### 3. SealGallery

**Purpose:** Grid แสดง seals ทั้งหมด

```typescript
interface SealGalleryProps {
  seals: Seal[]
  filter: 'all' | 'earned' | 'locked'
  onFilterChange: (filter: string) => void
}
```

**Layout:**
- Grid 3-4 columns (desktop)
- Grid 2 columns (mobile)
- Group by level

---

### 4. SealProgress

**Purpose:** แสดง progress ถึง seal ถัดไป

```typescript
interface SealProgressProps {
  nextSeal: Seal
  progress: {
    current: number
    total: number
    breakdown?: Record<string, boolean>
  }
}
```

**Design:**
- Progress bar
- Checklist (ถ้า breakdown มี)

---

### 5. SealNotification

**Purpose:** Toast notification เมื่อ unlock

```typescript
interface SealNotificationProps {
  seal: Seal
  onDismiss: () => void
  duration?: number  // default 5000ms
}
```

**Animation:**
- Slide in from right
- Auto dismiss
- Click anywhere → dismiss

---

### 6. SealDetailModal

**Purpose:** Modal แสดงรายละเอียด seal

```typescript
interface SealDetailModalProps {
  seal: Seal
  isOpen: boolean
  onClose: () => void
}
```

**Content:**
- Seal icon (large)
- Name + level
- Requirement
- Progress (ถ้ายังไม่ได้)
- Earned date (ถ้าได้แล้ว)

---

## Data Fetching

### Constellation

```typescript
// API Routes
GET /api/domains              → Domain[]
GET /api/domains/[slug]       → DomainDetail
GET /api/thinkers/[id]        → ThinkerProfile
GET /api/constellations/[id]  → ConstellationData
```

### Seals

```typescript
// API Routes
GET /api/seals                → Seal[]
GET /api/seals/user           → UserSeal[]
GET /api/seals/progress       → SealProgress[]
POST /api/seals/award         → AwardResult
```

---

## State Management

### Constellation State

```typescript
interface ConstellationState {
  domains: Domain[]
  currentDomain: Domain | null
  thinkers: Record<string, Thinker>
  loading: boolean
}
```

### Seals State

```typescript
interface SealsState {
  catalog: Seal[]
  userSeals: UserSeal[]
  progress: SealProgress[]
  notification: Seal | null
}
```

---

## Performance

### Code Splitting

```typescript
// Lazy load heavy components
const ConstellationMap = lazy(() => import('./ConstellationMap'))
const SealGallery = lazy(() => import('./SealGallery'))
```

### Memoization

```typescript
const ThinkerCard = memo(ThinkerCardComponent)
const SealCard = memo(SealCardComponent)
```

### Virtual Scrolling

ใช้สำหรับ gallery ที่มี items เยอะ

---

## Accessibility

### ARIA Labels

```tsx
<button aria-label="View Carl Jung profile">
  <ThinkerCard name="Carl Jung" />
</button>
```

### Keyboard Nav

- Tab: navigate cards
- Enter: open detail
- Arrows: navigate graph (ถ้ามี)

---

## Styling

### Tailwind Classes

```tsx
// Domain Card
<div className="rounded-full border border-border bg-card px-5 py-2.5 
                transition-all hover:border-primary/40">

// Thinker Card  
<div className="rounded-xl border border-border bg-card p-6
                transition-shadow hover:shadow-md">

// Seal (earned)
<svg className="fill-current text-primary">

// Seal (locked)
<svg className="stroke-current text-text-disabled opacity-40">
```

---

## Summary

**Constellation:** 5 core components (Card, Page, Profile, Map)  
**Seals:** 6 core components (Seal, Card, Gallery, Progress, Notification, Modal)  
**Data:** REST API + React state  
**Style:** Tailwind + Design Constitution colors  
**Performance:** Code split + memo + virtual scroll  

---

End of Component Architecture
