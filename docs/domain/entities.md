# Entities

Every entity the system understands.

## User Entities

| Entity | Description |
|--------|-------------|
| User | Registered member with authentication |
| Profile | Public information about a User |
| Role | Permission level (Guest → Administrator) |

## Knowledge Entities

| Entity | Description |
|--------|-------------|
| Concept | Core psychological or philosophical idea |
| Thinker | Philosopher, psychologist, or intellectual |
| Theory | Structured explanatory framework |
| School | Intellectual tradition or school of thought |
| Discipline | Broad knowledge domain |
| Book | Published reference or primary source |
| Article | Long-form analytical or interpretive essay |
| Symbol | Sign, image, or archetype with defined meaning |
| Quote | Notable passage from a thinker or work |
| Timeline Event | Dated historical occurrence |
| Glossary | Set of defined terms within a domain |
| Term | A single defined word or phrase within a Glossary |

## Content Entities

| Entity | Description |
|--------|-------------|
| Draft | In-progress Object not yet published |
| Reference | Academic source or citation |
| Media | Binary asset (image, audio, video) |
| Comment | User feedback on an Object |

## Social Entities

| Entity | Description |
|--------|-------------|
| Collection | User-curated grouping of Objects |
| Guide | Structured learning journey of sequential lessons |
| Achievement | Earned recognition for contribution |
| Level | Progression tier based on reputation |
| Notification | System-triggered message to User |

## Entity Rules

- Every entity has a unique ID (UUID)
- Every entity has a `created_at` and `updated_at` timestamp
- Knowledge entities are immutable once published
- Social entities (Collection, Guide) can be updated by their owner
- Achievements and Levels are system-controlled — never directly editable by users
