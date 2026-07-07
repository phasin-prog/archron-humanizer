# Cognitive Design

Most knowledge websites skip this step. ARCHRON does not.

## The Cognitive Timeline

Every page must pass these checkpoints:

```
0s  ─── 3s    Understand
    │        What is this page about?
    │        What type of Object am I looking at?
    │
3s  ─── 5s    Orient
    │        Where am I in the knowledge structure?
    │        What can I do here?
    │        Where can I go next?
    │
5s  ─── 30s   Learn
    │        Read the definition / description
    │        Scan the related content
    │        Form initial understanding
    │
30s ─── 5m    Deep Dive
    │        Explore related Objects
    │        Read linked Articles
    │        Follow references
    │        Save to Collection
    │        Start a Guide
    │
5m  ─── +     Companion
    │        Return for further study
    │        Build knowledge over time
    │        Contribute back
```

## Design Rules for Each Phase

### 0-3s: Understand

| Rule | Implementation |
|------|----------------|
| Object type must be instantly recognizable | Type badge, distinct layout, icon |
| Title must be large and readable | Typography hierarchy: Display at top |
| Description must be visible without scrolling | Above-the-fold content |
| No distracting elements | Minimal header, no ads, no popups |

### 3-5s: Orient

| Rule | Implementation |
|------|----------------|
| Breadcrumbs show taxonomic path | Discipline → School → Theory |
| Navigation is visible | Sidebar or top nav |
| Search is accessible | Header search bar |
| Backlinks visible | "Referenced by N articles" badge |

### 5-30s: Learn

| Rule | Implementation |
|------|----------------|
| Content is the primary focus | Generous content column, minimal chrome |
| Typography is optimized for reading | Proper line-height, measure, contrast |
| Related content is visible but secondary | Sidebar or bottom section |
| No dead ends | Every page provides next steps |

### 30s-5m: Deep Dive

| Rule | Implementation |
|------|----------------|
| Related Objects are one click away | Concept cards, thinker links |
| Knowledge Graph is accessible | "Explore connections" entry point |
| Save/bookmark available | "Add to Collection" button |
| Guides provide structure | "Start learning" CTA |

## Cognitive Load Rules

- No more than 7 items in any navigation list (Miller's Law)
- Related content sections show max 6 items (expandable)
- Sidebar information is progressively disclosed (show more on interaction)
- Tooltips provide instant context without navigation
- Loading states show skeleton outlines matching final layout (reduces perceived wait)
