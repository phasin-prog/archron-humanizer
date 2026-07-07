# Visualization Language

All visualizations — Timeline, Constellation, Graph, Tree, Network — must feel like they come from the same design system.

## Shared Visual Language

### Nodes

- All nodes are circular with consistent radius
- Node colors follow Knowledge Object type colors (Concept = blue, Thinker = green, etc.)
- Node size varies by relationship count (more connections = larger)
- Active/hovered node: scale 1.15 + glow
- Default node: flat, no border, subtle shadow

### Edges

- All edges are curved lines (not straight)
- Edge thickness varies by relationship weight (primary = thick, tertiary = thin)
- Edge color is neutral grey, not colored
- Edge opacity: 0.3 default, 0.6 on hover
- Direction indicated by subtle arrow or gradient

### Layout

- Force-directed layout for Knowledge Graph
- Radial layout for Constellation view
- Vertical hierarchy for Tree view
- Horizontal linear for Timeline
- All layouts respect padding — no nodes clip at edges

### Interaction

- Pan: drag background
- Zoom: scroll / pinch
- Click node: show info panel
- Double-click node: navigate to Object page
- Hover node: highlight connected edges + fade others
- Drag node: reposition (temporary, resets on reload)

## Visualization Types

### Knowledge Graph
- Force-directed layout
- Show connected nodes within 2 degrees
- Filter by Object type
- Search within graph
- "This node is connected to X others" label
- Zoom-to-fit button

### Timeline
- Horizontal scrolling axis
- Events as vertical markers on the axis
- Grouped by decade/century
- Click event: show detail card
- Filter by Domain, Thinker, Object type
- "Now" indicator line

### Constellation
- Radial layout centered on current Object
- First ring: directly related Objects
- Second ring: their related Objects
- Opacity decreases with distance
- Click to navigate to any visible Object

### Tree (Taxonomy)
- Vertical hierarchy
- Discipline → School → Theory → Concept
- Expand/collapse at each level
- Count badge: "12 Concepts"

## Visualization Rules

- All visualizations share the same color palette
- All visualizations share the same node/edge interaction patterns
- All visualizations support dark mode
- All visualizations are lazy-loaded (not on initial page load)
- Mobile: simplified version with "Open full" link
- No 3D — all visualizations are 2D
- Performance: > 30fps with 500+ nodes
- Every visualization has a loading state and empty state
