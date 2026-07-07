# Constellation Navigation — UX Flow

Version: 1.0  
Status: Design Phase  
Purpose: การออกแบบ User Experience สำหรับการสำรวจ Constellation Model

---

## หลักการออกแบบ

### Knowledge First
- ความรู้ = Primary
- นักคิด = Secondary
- Navigation = Tertiary

### Interface Invisible
UI ต้องหายไปหลังจาก 5 นาที

---

## Entry Points

Homepage → Domain Pills → Domain Page → Thinker Profile

---

## Domain Page Layout

```
Psychology

Origins (รากกำเนิด)
• ตำนานและพิธีกรรม
• ปรัชญากรีก

Foundational Thinkers
[Wundt] [James]

Constellation (กลุ่มดาว)
[Freud] [Jung] [Adler]
[Lacan] [Rogers] [Frankl]

Traditions
• Psychoanalysis
• Behaviorism

Modern
• Neuropsychology
```

---

## Thinker Profile

```
Carl Jung
1875-1961

Core Ideas
• Collective Unconscious
• Archetypes

Related
Influenced by: Freud
Influenced: Campbell

Content
[12 Concepts] [8 Articles]
```

---

## Navigation Patterns

### Breadcrumb

```
Home > Explore > Psychology > Constellation > Carl Jung
```

- แสดงเสมอด้านบนสุด
- ทุก level คลิกได้
- Responsive: mobile แสดงแค่ 2 levels สุดท้าย

### Tabs (ใน Domain Page)

```
[ Overview ] [ Graph View ] [ Timeline ]
```

- Overview: แสดง 5 layers แนวตั้ง
- Graph View: force-directed graph
- Timeline: เรียงตามยุคสมัย

### Filters

```
Filter by Tradition:
[ All ] [ Psychoanalysis ] [ Behaviorism ] [ Humanistic ]
```

---

## Search & Discovery

### Global Search

```
┌─────────────────────────┐
│  Search...              │
│  ○ Thinkers             │
│  ○ Concepts             │
│  ○ Articles             │
└─────────────────────────┘
```

### Domain Search

ใน Domain page มี search แยก:
- ค้นหานักคิดใน domain นี้เท่านั้น
- Filter by layer, tradition

---

## Mobile Navigation

### Hamburger Menu

```
☰
├── Home
├── Explore ▾
│   ├── 12 Domains
│   ├── Constellation Map
│   └── Timeline
├── Search
└── Profile
```

### Domain Page (Mobile)

Stack แนวตั้ง:
```
Psychology

[ Overview ] [ Graph ] [ Timeline ]

Origins
[Expand ▾]

Foundational
[Card]
[Card]

Constellation
[Card] [Card]
[Card] [Card]

[Load More]
```

---

## Accessibility

### Keyboard Navigation

- `Tab`: ข้ามไป card ถัดไป
- `Enter`: เปิด thinker profile
- `Esc`: ปิด modal/overlay
- `Arrow keys`: navigate graph nodes

### Screen Reader

```html
<nav aria-label="Domain navigation">
  <h1>Psychology</h1>
  <section aria-labelledby="origins">
    <h2 id="origins">Origins</h2>
    ...
  </section>
</nav>
```

### Focus States

- Outline ชัดเจนเมื่อ focus
- High contrast mode support
- Skip to content link

---

## Error States

### Empty Domain

```
┌──────────────────────┐
│  Coming Soon         │
│                      │
│  เรากำลังรวบรวม      │
│  นักคิดใน domain นี้ │
│                      │
│  [Explore Others]    │
└──────────────────────┘
```

### Loading

```
┌──────────────────────┐
│  ○ ○ ○               │
│  Loading...          │
└──────────────────────┘
```

### Network Error

```
┌──────────────────────┐
│  ⚠️ Connection Error │
│                      │
│  [Retry]             │
└──────────────────────┘
```

---

## Performance

### Lazy Loading

- Load 6-8 thinker cards ต่อหน้า
- Infinite scroll หรือ pagination
- Defer graph visualization

### Prefetch

- Prefetch domain data เมื่อ hover pill
- Prefetch thinker profile เมื่อ hover card

---

End of UX Flow
