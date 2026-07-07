# Accessibility

Built from the start, not retrofitted.

## Standards

- Target: WCAG 2.2 AA (minimum), AAA where feasible
- Compliance checked automatically and manually
- No accessibility debt — violations are release-blocking

## Contrast

| Element | Required Ratio | Our Target |
|---------|----------------|------------|
| Normal text | 4.5:1 | 7:1 |
| Large text (≥18px bold / ≥24px) | 3:1 | 4.5:1 |
| UI components | 3:1 | 4.5:1 |
| Decorative elements | No requirement | Still maintain 2:1 |

## Keyboard

- Every interactive element is keyboard-accessible
- Tab order follows visual order (left-to-right, top-to-bottom)
- Focus indicators are always visible (accent outline ring)
- Skip-to-content link is the first focusable element
- All dropdowns, modals, and menus use standard keyboard patterns (Esc to close, Arrow keys to navigate)
- No keyboard traps — focus can always move away

## Screen Reader

- All images have `alt` text (auto-generated from metadata when writer omits)
- Decorative icons use `aria-hidden="true"`
- Semantic HTML: headings in order (h1 → h2 → h3), landmarks (nav, main, aside)
- Dynamic content changes use `aria-live` regions
- Complex components (Knowledge Graph, Timeline) have text alternatives
- Status changes (loading, saving, published) are announced

## Focus Order

- Logical reading order — not all links first
- Skip navigation links at page start
- Modals trap focus within the modal
- Focus returns to trigger element after modal closes
- Tab key navigates forward, Shift+Tab backward

## Reduced Motion

- Respect `prefers-reduced-motion: reduce`
- No animations when reduced motion is enabled
- Page transitions use opacity only (no translate/move)
- Tooltips appear instantly instead of fading
- Knowledge Graph renders static

## Screen Sizes

- Support from 320px (small mobile) to 1920px (desktop)
- Text can be scaled up to 200% without loss of functionality
- No horizontal scrolling at any viewport width
- Touch targets minimum 44x44px

## Testing

| Tool | Frequency | Purpose |
|------|-----------|---------|
| axe-core | Every build | Automated accessibility checks |
| Lighthouse | Every PR | Performance + accessibility score |
| Manual keyboard test | Every feature | Tab order, focus, interaction |
| Screen reader test | Weekly | VoiceOver + NVDA |
| Contrast checker | Every color change | WCAG compliance |
