# Relationship Tables

The heart of the Knowledge Graph.

## Unified Relationship Model

Rather than separate tables per relationship type, use a single unified table for maximum flexibility:

```
relationships
├── id (UUID, PK)
├── source_type (VARCHAR)
├── source_id (UUID)
├── relation_type (VARCHAR)
├── target_type (VARCHAR)
├── target_id (UUID)
├── weight (ENUM: primary, secondary, tertiary)
├── confidence (ENUM: verified, suggested, automatic)
├── context (TEXT, NULLABLE)
├── created_by (FK → users, NULLABLE)
├── created_at
└── updated_at
```

### Relation Types

| Type | Description | Direction |
|------|-------------|-----------|
| `created` | Thinker created Theory | Thinker → Theory |
| `contains` | School contains Theory | School → Theory |
| `includes` | Theory includes Concept | Theory → Concept |
| `related_to` | Bidirectional relationship | Object ↔ Object |
| `opposes` | Contradictory relationship | Concept ↔ Concept |
| `derives_from` | Concept evolved from another | Concept → Concept |
| `precedes` | Chronological priority | Object → Object |
| `influenced` | Thinker influenced another | Thinker → Thinker |
| `influenced_by` | Thinker was influenced by | Thinker → Thinker |
| `authored` | Thinker wrote Book | Thinker → Book |
| `appears_in` | Symbol/Concept appears in Book | Symbol/Concept → Book |
| `referenced_in` | Object referenced in Article | Object → Article |
| `associated_with` | Loose association | Object → Object |
| `belongs_to` | Taxonomy membership | Object → Parent |
| `analyzed_in` | Object analyzed in Article | Object → Article |
| `supports` | Reference supports Object | Reference → Object |

### Indexing

```sql
CREATE INDEX idx_relationships_source ON relationships (source_type, source_id);
CREATE INDEX idx_relationships_target ON relationships (target_type, target_id);
CREATE INDEX idx_relationships_type ON relationships (relation_type);
CREATE INDEX idx_relationships_source_type ON relationships (relation_type, source_type);
```

### Query Examples

```sql
-- All related concepts for a given object
SELECT * FROM relationships
WHERE (source_type = 'concept' AND source_id = :id)
   OR (target_type = 'concept' AND target_id = :id);

-- Full graph for a thinker
SELECT * FROM relationships
WHERE source_type = 'thinker' AND source_id = :thinker_id
UNION
SELECT * FROM relationships
WHERE target_type = 'thinker' AND target_id = :thinker_id;

-- Backlinks for an object
SELECT * FROM relationships
WHERE target_type = :type AND target_id = :id;
```

## Rules

- Every relationship is stored once — bidirectional traversal handled by the query
- No duplicate relationships (unique constraint on source + type + target)
- Confidence field separates verified human input from automated suggestions
- Weight field controls display priority in Knowledge Graph visualization
- Context field allows adding notes about the nature of the relationship
- Deletion of a relationship is soft (uses deleted_at) for audit purposes
- Relationship changes trigger backlink recalculation (via PL/pgSQL trigger)
