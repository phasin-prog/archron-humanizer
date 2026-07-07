# Information Flow

The journey of knowledge.

## User Journey

```
Question
   │
   ▼
Search / Browse
   │
   ▼
Object (landing page)
   │
   ├──→ Related Objects (graph traversal)
   ├──→ Deep Reading (Article, Book)
   ├──→ Save to Collection
   ├──→ Timeline Context
   └──→ Continue to Guide
           │
           ▼
        Next Lesson
           │
           ▼
        Companion (AI-assisted learning)
```

## Flow Principles

1. **Entry** — User arrives with a Question (via search, browse, or external link)
2. **Anchor** — User lands on an Object page that provides the answer
3. **Expand** — User explores Related Objects, deepening their understanding
4. **Save** — User curates their learning path via Collections
5. **Structure** — User follows a Guide for systematic learning
6. **Deepen** — User engages with Articles and Books for deeper knowledge
7. **Connect** — User sees how everything fits together via the Knowledge Graph

## State Transitions

| From | To | Trigger |
|------|----|---------|
| Question | Search | User types query |
| Search | Object | User clicks result |
| Object | Related Object | User clicks related link |
| Object | Article | User clicks "Read more" |
| Object | Timeline | User clicks timeline link |
| Object | Collection | User clicks "Save" |
| Object | Guide | User clicks "Start guide" |
| Guide | Guide Lesson | User clicks next lesson |
| Guide | Object | Lesson references an Object |
| Any | Graph | User clicks "Explore connections" |

## Expected Flows

### Casual Reader
Question → Search → Object → Related Objects → Done

### Student
Question → Search → Object → Guide → Lessons → Collection → Companion

### Researcher
Question → Search → Object → References → Related Objects → Timeline → Collection
