# Knowledge Services Architecture

AI is a consumer of this layer — not the layer itself.

## Stack

```
Knowledge
    │
    ▼
Knowledge Engine
    │
    ▼
Search Engine
    │
    ▼
Recommendation Engine
    │
    ▼
AI Engine
```

AI sits at the bottom — it is the last resort, not the first answer.

## 5 Levels of Intelligence

### Level 1 — No AI (Foundation)

Build first. No LLM required.

| Service | Mechanism | Example |
|---------|-----------|---------|
| Semantic Search | PostgreSQL tsvector + trigram | "Shadow" → "เงา" → "Shadow Archetype" |
| Auto Related | Relationship graph traversal | Read "Psychological Types" → show "Functions" |
| Auto References | Reference → Object linking | DOI lookup, citation formatting |
| Knowledge Graph | Relationship data → UI | Click to explore connections |
| Collections | User-curated groupings | "My Jung Reading List" |

### Level 2 — Rule-based

Deterministic logic. If-else. No model required.

| Service | Mechanism | Example |
|---------|-----------|---------|
| Basic Recommendation | "Users who read X also read Y" | Read "Shadow" → suggest "Persona" |
| Content Validation | Regex + pattern matching | Check reference format, detect duplicates |
| Taxonomy Assignment | Keyword → Discipline mapping | "Unconscious" → Psychology |
| Reading Time Estimate | Word count + difficulty factor | Article: 15 min read |

### Level 3 — Embedding

Vector representations. Semantic similarity without generation.

| Service | Mechanism | Example |
|---------|-----------|---------|
| Semantic Similarity | Embedding cosine distance | Find concepts similar to "Shadow" |
| Concept Clustering | Embedding clustering | Auto-group related concepts |
| Graph Embedding | Node2Vec / GraphSAGE | Suggest new relationships |
| Smart Search | Dense retrieval + sparse retrieval | Hybrid search ranking |

### Level 4 — Retriever

RAG architecture. Retrieve knowledge, then answer.

| Service | Mechanism | Example |
|---------|-----------|---------|
| Question Answering | Retrieve + Generate | "What did Jung say about dreams?" |
| Contextual Companion | Knowledge Graph + RAG | Answer with citations |
| Explain Concept | Retrieve definition + related | "Explain the Shadow in simple terms" |
| Summarize | Retrieve article + summarize | "Summarize this concept" |

### Level 5 — LLM

Full language model capabilities. Used only when lower levels cannot answer.

| Service | Mechanism | Example |
|---------|-----------|---------|
| AI Companion | GPT / Claude / Gemini | Natural conversation about topics |
| Writer Assistant | LLM + structured output | Suggest outline, improve clarity |
| Research Assistant | LLM + Knowledge Graph | Find connections across domains |
| Knowledge Curator | LLM + validation | Suggest new concepts, relationships |

## Level Selection Rule

```
User Request
    │
    ▼
Level 1: Can we answer without AI?
    ├── Yes → Return result (fast, cheap)
    │
    └── No → Level 2: Can rules handle it?
            ├── Yes → Apply rule
            │
            └── No → Level 3: Embedding similarity?
                    ├── Yes → Vector search
                    │
                    └── No → Level 4: RAG?
                            ├── Yes → Retrieve + Generate
                            │
                            └── No → Level 5: LLM fallback
```

Lower levels are always preferred. AI is the last resort.
