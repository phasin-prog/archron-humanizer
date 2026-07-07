# HTML & JSX

## HTML Conventions

### Document Structure

```html
<!DOCTYPE html>
<html lang="th" class="">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{page title} — ARCHRON</title>
    <meta name="description" content="{page description}" />
  </head>
  <body>
    <skip-to-content-link />
    <header />
    <main id="main-content">{page content}</main>
    <footer />
  </body>
</html>
```

### Semantic HTML

| Element | Usage |
|---------|-------|
| `<main>` | Primary page content (one per page) |
| `<nav>` | Navigation blocks |
| `<article>` | Standalone content (Articles, Concepts) |
| `<section>` | Thematic grouping within an article |
| `<aside>` | Sidebar, related content |
| `<header>` | Page or section header |
| `<footer>` | Page or section footer |
| `<figure>` + `<figcaption>` | Images with captions |
| `<blockquote>` | Quotations |
| `<cite>` | Source citations |
| `<time>` | Dates and reading time |
| `<kbd>` | Keyboard shortcuts |

## JSX Conventions

### Self-Closing Tags

```tsx
// ✓ Correct
<ConceptCard title="Shadow" />
<Divider />
<br />

// ✗ Wrong
<ConceptCard title="Shadow"></ConceptCard>
<Divider></Divider>
<br></br>
```

### Conditional Rendering

```tsx
// ✓ Correct (short circuit)
{isLoading && <Skeleton />}

// ✓ Correct (ternary)
{status === "published" ? <Badge>Published</Badge> : <Badge>Draft</Badge>}

// ✓ Correct (early return)
if (!object) return <NotFound />

// ✗ Wrong (&& with numbers — 0 renders)
{items.length && <List items={items} />}   // BUG: 0 renders as "0"

// ✓ Correct
{items.length > 0 && <List items={items} />}
```

### List Rendering

```tsx
// ✓ Correct
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}

// ✓ Correct (stable key)
<ConceptCard key={concept.slug} concept={concept} />

// ✗ Wrong (index as key)
{items.map((item, i) => <li key={i}>{item.name}</li>)}
```

### Event Handlers

```tsx
// ✓ Correct (named function)
const handleClick = () => { /* ... */ }
return <button onClick={handleClick}>Click</button>

// ✓ Correct (inline for simple cases)
return <button onClick={() => setOpen(true)}>Open</button>

// ✗ Wrong (inline complex logic)
return <button onClick={() => { doThingA(); doThingB(); }}>Click</button>
```

### Accessibility in JSX

```tsx
// ✓ Correct
<button aria-label="Close" onClick={onClose}>
  <XIcon />
</button>

<nav aria-label="Breadcrumb">
  <ol>{/* ... */}</ol>
</nav>

<img src={url} alt={altText} />

// ✗ Wrong
<button onClick={onClose}><XIcon /></button>  // No label

<div onClick={handleClick}>Click me</div>  // Not keyboard accessible
```

## Rules

- Every `<img>` must have `alt` (empty alt for decorative = `alt=""`)
- Every `<button>` must have accessible text (visible or `aria-label`)
- Interactive elements use native HTML elements (`<button>`, `<a>`) — not `<div>` with onClick
- Forms use `<label>` elements (not `aria-label` alone)
- Heading hierarchy is sequential: `h1` → `h2` → `h3`, never skip
- No inline JSX styles — use Tailwind classes
- No dangerouslySetInnerHTML — use the Renderer's component pipeline
