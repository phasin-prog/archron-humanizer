# Academic Seals — UX Flow

Version: 1.0  
Status: Design Phase  
Purpose: การออกแบบ User Experience สำหรับ Academic Seals System

---

## หลักการ UX

### ไม่ใช่เกม

Seals ไม่ใช่ achievement ที่มารบกวนการอ่าน

Seals เป็นการรับรองความสำเร็จทางความรู้ แบบเงียบ ๆ

---

## Seal Unlock Experience

### 1. Silent Notification (ไม่รบกวน)

```
┌─────────────────────────┐
│  🔖 The Scholar         │
│  อ่าน 100 บทความแล้ว     │
│                         │
│  [View]  [Dismiss]     │
└─────────────────────────┘
```

**Timing:** แสดง 5 วินาที มุมขวาบน
**Animation:** Fade in → Hold → Fade out
**Sound:** ไม่มีเสียง

---

## Profile — Seals Section

```
┌──────────────────────────────────┐
│  Your Academic Seals             │
├──────────────────────────────────┤
│                                  │
│  ○ The Scholar   ● The Reader   │
│  ◇ The Curator   ○ The Seeker   │
│  ⬢ The Architect                │
│                                  │
│  [View All Seals]                │
└──────────────────────────────────┘
```

**Layout:**
- แสดง 5 seals ล่าสุด
- Earned = filled, Locked = outline
- Click → Seal detail

---

## Seals Gallery Page

```
/profile/seals

┌────────────────────────────────────┐
│  Academic Seals                    │
│                                    │
│  Filter: [All] [Earned] [Locked]  │
├────────────────────────────────────┤
│                                    │
│  Progress (7/21)                   │
│  ━━━━━━━━━━────────── 33%         │
│                                    │
│  Level 1-2: Slate Seals            │
│  ● The Seeker     ● The Reader    │
│  ○ The Collector                   │
│                                    │
│  Level 3-4: Blue Seals             │
│  ● The Scholar    ○ The Analyst   │
│  ○ The Explorer   ○ The Archivist │
│                                    │
│  Level 5-6: Silver Seals           │
│  ○ The Curator    ○ The Sage      │
│                                    │
│  Level 7: Gold Seals               │
│  ○ The Architect  ○ The Companion │
│                                    │
└────────────────────────────────────┘
```

---

## Seal Detail Modal

Click seal → แสดง modal:

```
┌─────────────────────────────┐
│         ○                   │
│    The Scholar              │
│    Level 3 · Blue           │
├─────────────────────────────┤
│                             │
│  Requirement                │
│  อ่าน 100 บทความครบถ้วน     │
│                             │
│  Progress                   │
│  ━━━━━━━━━━──── 87/100     │
│                             │
│  Earned: 15 Jan 2026        │
│                             │
│  [Close]                    │
└─────────────────────────────┘
```

**Features:**
- แสดง progress bar (ถ้ายังไม่ได้)
- แสดง earned date (ถ้าได้แล้ว)
- Animation เมื่อเปิด modal

---

## Progress Tracking

### Inline Progress (ไม่รบกวน)

ในหน้า Profile sidebar:

```
┌──────────────────┐
│  Next Seal       │
├──────────────────┤
│  ○ The Analyst   │
│  Progress        │
│  ━━━━────── 3/5  │
│                  │
│  Read objects:   │
│  ✓ Articles      │
│  ✓ Concepts      │
│  ✓ Thinkers      │
│  ○ Guides        │
│  ○ Timeline      │
└──────────────────┘
```

---

## Mobile UX

### Profile Seals (Mobile)

```
Academic Seals

○ ○ ● ○ ○
○ ● ○ ○ ○

7 of 21 earned

[View All]
```

### Gallery (Mobile)

Stack vertically, 2 seals per row

---

## Interaction States

### Seal Card

**Locked (ยังไม่ได้):**
```
○ The Scholar
Outline, opacity 40%
```

**Earned:**
```
● The Scholar
Filled, full color
```

**Hover (Locked):**
```
○ The Scholar
Show progress tooltip
```

**Hover (Earned):**
```
● The Scholar
Slight scale (1.05)
Show earned date
```

---

## Animation Specs

### Unlock Animation

```
1. Fade In (100ms)
2. Outline Draw (150ms)
3. Scale 1.0 → 1.03 → 1.0 (50ms)
Total: 300ms
```

### Notification

```
1. Slide in from right (200ms)
2. Hold (5000ms)
3. Fade out (200ms)
```

---

## Accessibility

### Screen Reader

```html
<div role="status" aria-live="polite">
  Academic Seal unlocked: The Scholar
</div>
```

### Keyboard

- Tab: navigate seals
- Enter: open detail
- Esc: close modal

---

## Privacy

Seals เป็นข้อมูลส่วนตัว — แสดงเฉพาะเจ้าของ profile เท่านั้น

ไม่มี leaderboard, ไม่มี public comparison

---

## Summary

**Entry:** Profile → Seals section  
**Gallery:** Filter earned/locked, grouped by level  
**Detail:** Modal แสดง requirement + progress  
**Unlock:** Silent notification, no interruption  
**Goal:** รับรู้ความสำเร็จ แต่ไม่รบกวนการอ่าน  

---

End of Seals UX Flow
