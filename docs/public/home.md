# Homepage

The homepage has one job: answer **"What can I learn here?"** within 3 seconds.

## Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: Logo │ Explore │ Search │ About             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Hero                                                │
│  ┌─────────────────────────────────────────────┐    │
│  │  "Understand the human mind,                 │    │
│  │   one concept at a time."                    │    │
│  │                                             │    │
│  │  [Explore Knowledge]  [Start a Guide]       │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Quick Navigation                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │🔍    │ │🧠    │ │📖    │ │⏳    │ │🕸️    │     │
│  │Search│ │Concepts│ │Books │ │Timeline│ │Graph │     │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘     │
│                                                     │
│  Featured Knowledge                                  │
│  ┌────────────────┐ ┌────────────────┐ ┌───────────┐│
│  │ Shadow         │ │ Persona        │ │ Archetype  ││
│  │ Carl Jung      │ │ Carl Jung      │ │ Carl Jung   ││
│  └────────────────┘ └────────────────┘ └───────────┘│
│                                                     │
│  Learning Paths                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ 🎯 Introduction to Analytical Psychology      │   │
│  │ → 5 lessons · Beginner · 30 minutes           │   │
│  ├──────────────────────────────────────────────┤   │
│  │ 🎯 Understanding the Unconscious              │   │
│  │ → 8 lessons · Intermediate · 60 minutes       │   │
│  ├──────────────────────────────────────────────┤   │
│  │ 🎯 Jungian Typology                          │   │
│  │ → 6 lessons · Intermediate · 45 minutes       │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Recently Updated                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │Card  │ │Card  │ │Card  │ │Card  │              │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
│  Guides                                             │
│  ┌──────────────────────────────────────────────┐   │
│  │ 📚 Complete Guide to Analytical Psychology   │   │
│  │ 📚 Understanding Dreams                      │   │
│  │ 📚 Introduction to Existentialism            │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Companion                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │ 🤖 Ask me anything about psychology...       │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Footer: All disciplines │ About │ Contact          │
└─────────────────────────────────────────────────────┘
```

## Section Rules

- **Hero**: One sentence. One call to action. No carousel. No background video.
- **Quick Navigation**: Icons + labels. Direct access to primary features.
- **Featured Knowledge**: Editor-curated. Max 6 items. Showcases best content.
- **Learning Paths**: 3 featured Guides with progress indicators.
- **Recently Updated**: Latest published content. Auto-updating. Max 8 items.
- **Guides**: Featured guide collection.
- **Companion**: Subtle AI entry point — not a chatbot popup.
- **Footer**: All 12 Disciplines listed as entry points.

## Performance

- Hero is static HTML + CSS — no JS required to render
- Featured Knowledge is statically generated
- Recently Updated uses ISR (revalidate every hour)
- Companion loads on interaction, not on page load
- No third-party scripts on homepage
