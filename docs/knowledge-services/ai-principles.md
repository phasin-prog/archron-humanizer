# AI Principles

## Hard Rules

Never allow the AI to invent knowledge.

AI must explain existing knowledge.

AI must never replace references.

Every AI answer must be traceable back to objects stored inside ARCHRON.

## What AI Does

| ✅ Allowed | ❌ Forbidden |
|-----------|-------------|
| Explain existing Concepts | Generate new Concepts |
| Summarize Articles | Write Articles without review |
| Compare Objects | Create fake relationships |
| Suggest related content | Invent citations |
| Translate existing content | Paraphrase without source |
| Generate quiz questions | Answer without traceability |
| Outline based on structure | Generate entire drafts |
| Improve clarity of writer's text | Replace writer's voice |

## AI Roles (4 agents, not 1 chatbot)

### Reader Companion
- Help readers understand content
- Answer questions about the current page
- Suggest next steps in learning
- Never invent — always cite

### Writer Assistant
- Suggest outlines based on existing Objects
- Improve clarity and grammar
- Auto-generate references from DOIs
- Check consistency with existing content
- Never write for the writer — only assist

### Research Assistant
- Find connections across domains
- Suggest related Concepts and Thinkers
- Generate timeline from existing data
- Identify gaps in the Knowledge Graph
- Never introduce unverified information

### Knowledge Curator
- Suggest new Concepts based on gaps
- Propose relationship additions
- Flag duplicate or inconsistent content
- Recommend merges and splits
- All suggestions require human approval

## Traceability

Every AI-generated output must include:

```
Source: Concept "Shadow" (archron.com/concept/shadow)
Source: Article "Understanding the Shadow" (archron.com/article/understanding-shadow)
Source: Book "Man and His Symbols" (archron.com/book/man-and-his-symbols)
```

If a response cannot cite at least one ARCHRON Object, it should not be shown.

## Quality Rules

- AI output is always marked as "AI-generated" with a disclaimer
- AI suggestions are clearly distinguished from verified content
- AI never modifies published Objects directly
- All AI actions are logged for audit
- Users can disable AI features entirely
- No data is sent to third-party AI providers without clear disclosure
