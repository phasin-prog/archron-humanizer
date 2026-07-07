# Three.js

## Import Strategy

Always import from the module entry — never from internal paths:

```typescript
// ✓ Correct
import { Scene, PerspectiveCamera, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

// ✗ Wrong
import * as THREE from "three/build/three.module.js"
import { OrbitControls } from "three/examples/controls/OrbitControls"
```

## Package Setup

```json
{
  "dependencies": {
    "three": "^0.185",
    "@types/three": "^0.185"
  }
}
```

## Bundle Optimization

Three.js is a large library (~500KB min+gzip for full build). Strategy:

| Technique | What It Does |
|-----------|--------------|
| Tree shaking | Import only what you use — `import { Scene }` not `import * as THREE` |
| Dynamic import | Knowledge Graph loads Three.js only on user interaction |
| Lazy component | `<Suspense>` wrapper, Graph loads when scrolled into view |
| Single instance | One `WebGLRenderer` shared across all graph components |
| Dispose pattern | Clean up geometries, materials, renderer on unmount |

## Lazy Load Pattern

```typescript
// packages/graph/src/KnowledgeGraph.tsx
"use client"

import { lazy, Suspense } from "react"

const GraphCanvas = lazy(() => import("./GraphCanvas"))

export function KnowledgeGraph({ objectId }: { objectId: string }) {
  return (
    <Suspense fallback={<GraphSkeleton />}>
      <GraphCanvas objectId={objectId} />
    </Suspense>
  )
}
```

```typescript
// packages/graph/src/GraphCanvas.tsx
import { useEffect, useRef } from "react"
import { Scene, PerspectiveCamera, WebGLRenderer } from "three"

export default function GraphCanvas({ objectId }: { objectId: string }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = new Scene()
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    // ... setup, animate, cleanup
  }, [objectId])

  return <div ref={mountRef} />
}
```

## Usage Locations

| Component | Package | Loading |
|-----------|---------|---------|
| Constellation View | `@archron/graph` | Dynamic import |
| Knowledge Graph | `@archron/graph` | Dynamic import |
| Timeline (3D) | `@archron/graph` | Future |
| Symbol visualization | `@archron/graph` | Future |

## Cleanup Pattern

```typescript
useEffect(() => {
  const renderer = new WebGLRenderer()
  const scene = new Scene()
  // ...set up

  return () => {
    // Dispose all geometries and materials
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
    renderer.dispose()
  }
}, [])
```

## Performance Targets

| Metric | Target |
|--------|--------|
| First load | < 50KB (Three.js loaded dynamically) |
| Frame rate | 60fps at 200+ nodes |
| Memory | < 100MB for typical graph |
| Load time | < 1s from click to interactive |
| Reduced motion | static SVG fallback when `prefers-reduced-motion` |
