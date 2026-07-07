# Knowledge Graph Storage

The Knowledge Graph is not a UI feature. It is the data model itself.

## Data Model

The graph is stored in two tables — Nodes and Edges.

### Nodes

```
graph_nodes
├── id (UUID, PK)
├── object_id (UUID, FK → objects, UNIQUE)
├── node_type (VARCHAR)        -- concept, thinker, book, etc.
├── label (VARCHAR)            -- Display name
├── weight (FLOAT)             -- Centrality score (computed)
├── metadata (JSONB)           -- Additional node properties
├── embedding (VECTOR(384))    -- For semantic similarity (future)
├── created_at
└── updated_at
```

### Edges

```
graph_edges
├── id (UUID, PK)
├── source_node_id (UUID, FK → graph_nodes)
├── target_node_id (UUID, FK → graph_nodes)
├── relation_type (VARCHAR)    -- created, influenced, appears_in, etc.
├── weight (FLOAT)             -- Edge strength (0.0 to 1.0)
├── confidence (ENUM)          -- verified, suggested, automatic
├── metadata (JSONB)           -- Context, notes, citations
├── created_at
└── updated_at
```

## Graph Queries

### Direct Connections

```sql
-- Get all directly connected nodes to a given node
SELECT n.*, e.relation_type, e.weight
FROM graph_edges e
JOIN graph_nodes n ON n.id = CASE
  WHEN e.source_node_id = :node_id THEN e.target_node_id
  ELSE e.source_node_id
END
WHERE e.source_node_id = :node_id OR e.target_node_id = :node_id
ORDER BY e.weight DESC;
```

### Shortest Path (via recursive CTE)

```sql
-- Find shortest path between two nodes
WITH RECURSIVE path AS (
  SELECT source_node_id, target_node_id, 1 AS depth,
         ARRAY[source_node_id, target_node_id] AS path_nodes
  FROM graph_edges
  WHERE source_node_id = :start_id

  UNION ALL

  SELECT e.source_node_id, e.target_node_id, p.depth + 1,
         p.path_nodes || e.target_node_id
  FROM graph_edges e
  JOIN path p ON p.target_node_id = e.source_node_id
  WHERE NOT e.target_node_id = ANY(p.path_nodes)
    AND p.depth < 6
)
SELECT * FROM path WHERE target_node_id = :end_id
ORDER BY depth LIMIT 1;
```

### Related Concepts (recommendation)

```sql
-- Get concepts frequently connected to the same nodes as this one
SELECT n.*, COUNT(*) AS connection_strength
FROM graph_edges e1
JOIN graph_edges e2 ON (e1.source_node_id = e2.source_node_id OR e1.target_node_id = e2.target_node_id)
  AND e2.id != e1.id
JOIN graph_nodes n ON n.id = CASE
  WHEN e2.source_node_id != :node_id THEN e2.source_node_id
  ELSE e2.target_node_id
END
WHERE (e1.source_node_id = :node_id OR e1.target_node_id = :node_id)
  AND n.object_id != :node_id
GROUP BY n.id
ORDER BY connection_strength DESC
LIMIT 10;
```

## Graph Sync Strategy

The graph tables are not written directly by the application. They are synchronized from the relationship tables:

```
relationships table
    │
    ▼
Graph Sync (trigger + scheduled job)
    │
    ├── Insert/update nodes from objects
    ├── Insert/update edges from relationships
    ├── Recalculate centrality weights
    └── Update embeddings (future)
    │
    ▼
graph_nodes + graph_edges
```

## Future Capabilities

- **Embeddings**: Store vector embeddings for semantic graph traversal
- **Centrality**: Compute PageRank-inspired centrality for "important" nodes
- **Clustering**: Auto-detect concept clusters within the graph
- **Recommendation**: Walk the graph to suggest related content
- **Visualization**: The graph tables are the data source for all UI visualizations (constellation, timeline, etc.)
- **Timeline**: Graph nodes with temporal data feed the timeline view
