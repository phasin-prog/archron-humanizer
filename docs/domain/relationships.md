# Domain Relationships

Typed connections between all entities.

## User Relationships

```
User
 ├── owns → Draft
 ├── writes → Article
 ├── authors → Book
 ├── creates → Collection
 ├── creates → Guide
 ├── earns → Achievement
 ├── attains → Level
 ├── has → Profile
 ├── receives → Notification
 └── submits → Comment
```

## Knowledge Object Relationships

```
Article
 ├── references → Book
 ├── references → Thinker
 ├── contains → Concept
 ├── belongs_to → Discipline
 ├── belongs_to → School
 ├── tagged_with → Symbol
 └── rendered_by → Renderer

Concept
 ├── related_to → Concept
 ├── appears_in → Book
 ├── appears_in → Article
 ├── created_by → Thinker
 ├── defined_by → Theory
 ├── belongs_to → School
 ├── mapped_to → Symbol
 └── visualized_in → Knowledge Graph

Thinker
 ├── authored → Book
 ├── created → Theory
 ├── influenced → Thinker
 ├── influenced_by → Thinker
 ├── associated_with → School
 ├── belongs_to → Discipline
 └── appears_in → Timeline Event

Book
 ├── authored_by → Thinker
 ├── contains → Concept
 ├── discusses → Symbol
 ├── referenced_by → Article
 └── appears_in → Timeline Event

Theory
 ├── created_by → Thinker
 ├── belongs_to → School
 ├── contains → Concept
 └── supported_by → Reference

School
 ├── belongs_to → Discipline
 ├── includes → Theory
 └── associated_with → Thinker

Timeline Event
 ├── involves → Thinker
 ├── relates_to → Concept
 ├── marks → Book Publication
 └── occurs_in → Discipline

Quote
 ├── attributed_to → Thinker
 ├── appears_in → Book
 └── relates_to → Concept

Symbol
 ├── represents → Concept
 ├── appears_in → Book
 ├── appears_in → Article
 └── associated_with → Culture
```

## Content Relationships

```
Draft
 ├── authored_by → User
 ├── references → Reference
 └── becomes → Article (on publish)

Reference
 ├── supports → Article
 ├── supports → Concept
 └── published_as → Book

Media
 ├── belongs_to → Object
 └── uploaded_by → User

Comment
 ├── posted_by → User
 └── belongs_to → Object

Collection
 ├── curated_by → User
 ├── contains → Object
 └── tagged_with → Tag

Guide
 ├── created_by → User
 ├── contains → Lesson
 └── references → Object
```

## Social Relationships

```
Achievement
 ├── earned_by → User
 └── belongs_to → Level

Level
 ├── requires → Reputation
 └── unlocks → Achievement

Notification
 ├── sent_to → User
 └── triggered_by → Event
```
