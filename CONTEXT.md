# ARCHRON — Knowledge Platform Context

A human knowledge platform that organizes, connects, and transforms multidisciplinary knowledge about human beings into an interconnected knowledge ecosystem. Every piece of content is an object, and pages are generated from objects.

## Language

### Knowledge Objects

**Object**:
The atomic unit of knowledge. Everything in the system is an object — concepts, thinkers, articles, books, symbols, timeline events, quotes, collections, guides.
_Avoid_: Entry, item, entity (overloaded)

**Concept**:
A core psychological or philosophical idea catalogued in the system (e.g., Unconscious, Shadow, Ego).
_Avoid_: Topic, notion, idea

**Thinker**:
A philosopher, psychologist, or intellectual whose work is catalogued (e.g., Jung, Freud, Nietzsche).
_Avoid_: Person, author, figure

**School**:
An intellectual tradition or school of thought that groups thinkers and concepts (e.g., Analytical Psychology, Existentialism).
_Avoid_: Movement, discipline (overloaded)

**Theory**:
A structured framework or set of explanatory principles within a school.
_Avoid_: Model, doctrine

**Article**:
A long-form analytical or interpretive essay rendered through the reading system.
_Avoid_: Post, entry, writing

**Book**:
A published reference work or primary source in the bibliography.
_Avoid_: Volume, text, work

**Reference**:
An academic source or citation that supports content accuracy.
_Avoid_: Citation (overloaded), footnote

**Symbol**:
A sign, image, or archetype with defined meaning within the knowledge system.
_Avoid_: Icon, motif

**Timeline Event**:
A dated historical occurrence linked to thinkers, concepts, or schools.
_Avoid_: Milestone, date, occurrence

**Guide**:
A structured learning journey composed of sequential lessons referencing other objects.
_Avoid_: Course, tutorial, pathway

**Collection**:
A user-curated grouping of objects for personal or shared reference.
_Avoid_: Playlist, folder, reading list

**Media**:
A binary asset (image, audio, video) stored in object storage and referenced by objects.
_Avoid_: File, attachment, asset

### People

**Member**:
A registered user with a profile, reading history, and ability to create collections.
_Avoid_: Reader, user (generic)

**Writer**:
A member who creates and submits content for review.
_Avoid_: Author, contributor (overloaded)

**Reviewer**:
A domain-expert writer who validates content accuracy, citations, and academic quality.
_Avoid_: Editor (wrong role), moderator

**Editor**:
A trusted writer with authority to publish, archive, and manage system content.
_Avoid_: Publisher, admin (overloaded)

**Administrator**:
A system-level role with full access to users, roles, configuration, and moderation.
_Avoid_: Admin, superuser, root

### Content States

**Draft**:
An in-progress object visible only to its writer and invited reviewers.
_Avoid_: Unpublished, WIP

**Review**:
A draft submitted for human validation, awaiting an approve/reject/revision decision.
_Avoid_: Pending, submitted, in review

**Published**:
A reviewed and approved object that is live, indexed, publicly accessible, and immutable.
_Avoid_: Live, active, released

**Archived**:
A previously-published object removed from search results but preserving its URL.
_Avoid_: Deleted, removed, expired

### Engines

**Knowledge Engine**:
The core business-logic layer that resolves objects, relations, permissions, and taxonomy queries.
_Avoid_: Backend, API layer

**Rendering Engine**:
The Markdown-to-Component pipeline — parses source, resolves wikilinks via the Knowledge Engine, and maps AST nodes to registered React components.
_Avoid_: Parser, template engine

**Knowledge Graph**:
The typed relationship network connecting all objects — traversed for recommendations, backlinks, and visualization.
_Avoid_: Graph, node network

**Search Engine**:
The full-text and alias-based discovery system backed by PostgreSQL tsvector.
_Avoid_: Query engine, search index

**Slug Engine**:
The system that generates, validates, and redirects immutable URL slugs for all objects.
_Avoid_: URL handler, path resolver

**Learning Engine**:
The rule-based recommendation layer that decides what content to suggest, in what order, to which user.
_Avoid_: Recommender, suggestion engine
