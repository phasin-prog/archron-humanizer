# ARCHRON Agent Architecture v2

Version: 2.0
Status: Foundation

---

# Philosophy

ARCHRON agents are not chatbots.

Each agent is a specialized system worker with a clearly defined scope.

Agents collaborate through the Orchestrator.

No agent may exceed its responsibility.

Every output must be deterministic, reviewable, and traceable.

Knowledge always takes priority over AI generation.

---

# Layer Architecture

                         ORCHESTRATOR
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
 Knowledge Layer         Product Layer        Engineering Layer
        │                      │                      │
        └─────────────── Quality Layer ───────────────┘

---

# 1. Orchestrator Layer

Purpose

Coordinate the entire workflow.

Responsibilities

- Select agents
- Execute workflow
- Resolve conflicts
- Merge outputs
- Validate completion
- Report execution

Never

- Edit UI
- Write articles
- Modify database directly

---

# 2. Knowledge Layer

Purpose

Own every knowledge object.

Agents

## Knowledge Architect

Responsible for

- Ontology
- Object Model
- Taxonomy
- Knowledge Structure

---

## Semantic Architect

Responsible for

- Relationships
- Knowledge Graph
- Backlinks
- Aliases
- Related Concepts

---

## Reference Architect

Responsible for

- Citations
- Academic References
- DOI
- ISBN
- Source Validation

---

## Timeline Architect

Responsible for

- Historical Timeline
- Chronology
- Events

---

## Knowledge Quality

Responsible for

- Duplicate Detection
- Missing References
- Broken Links
- Consistency

---

# 3. Product Layer

Purpose

Everything users experience.

Agents

## UX Architect

Responsibilities

- UX Flow
- Navigation
- User Journey
- Information Hierarchy

---

## Design System Architect

Responsibilities

- Components
- Typography
- Colors
- Motion
- Layout

Must follow

- `docs/DESIGN-CONSTITUTION.md` (mandatory)
- All color decisions validated against constitution
- No deviation without documented reason

---

## Studio Architect

Responsibilities

- Workspace
- Dashboard
- Studio Experience

---

## Editor Architect

Responsibilities

- Markdown
- Live Preview
- Commands
- Writing Experience

---

## Public Platform Architect

Responsibilities

- Homepage
- Reading Experience
- Search Experience
- Guides
- Companion

---

# 4. Engineering Layer

Purpose

Build the platform.

Agents

## Frontend Architect

Responsibilities

- React
- Next.js
- Tailwind
- Three.js

---

## Backend Architect

Responsibilities

- API
- Auth
- Server Actions
- Business Logic

---

## Rendering Architect

Responsibilities

- Renderer
- Markdown
- AST
- Components

---

## Database Architect

Responsibilities

- PostgreSQL
- PLpgSQL
- Drizzle
- Migrations

---

## Search Architect

Responsibilities

- Search
- Ranking
- Index
- Semantic Search

---

## Performance Architect

Responsibilities

- Bundle
- Caching
- Optimization
- Core Web Vitals

---

# 5. Quality Layer

Purpose

Maintain platform quality.

Agents

## QA Architect

Responsibilities

- Testing
- Responsive
- Accessibility

---

## SEO Architect

Responsibilities

- Metadata
- Schema
- Sitemap
- Canonical

---

## Documentation Architect

Responsibilities

- Documentation
- Context
- Standards

---

## Security Architect

Responsibilities

- Authentication
- Authorization
- Security Review

---

# Agent Communication

Every agent receives

Input

↓

Processes

↓

Returns

1. Summary

2. Decisions

3. Files Changed

4. Risks

5. Recommendations

6. Next Actions

---

# Scope Rules

An agent may never modify another layer.

Example

Frontend Architect

Cannot redesign UX.

Database Architect

Cannot modify Design System.

Knowledge Architect

Cannot implement React Components.

Every change must pass through the Orchestrator.

---

# Principles

Single Responsibility

Clear Ownership

Small Context

Deterministic Output

Reviewable Changes

Composable Workflow

Long-term Maintainability

---

# Toolchain Governance

## Enforcement Level: ABSOLUTE

Every AI agent operating on this repository **MUST** use both tools below.

No exception. No workaround.

---

# A. Caveman — Workflow Hooks

## What

Caveman injects hooks into AI coding agents (Claude Code, OpenCode, Gemini CLI,
Codex) that enforce structured, reviewable, traceable agent behavior.

It is NOT a CLI binary. It is a plugin that lives inside each agent.

**Repository**: `JuliusBrussee/caveman`

## Installation (One-Time)

```powershell
# Windows PowerShell 5.1+
irm https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.ps1 | iex
```

## Plugins Per Platform

| Platform   | Command |
|------------|---------|
| Claude Code | `claude plugin install caveman@caveman` |
| OpenCode   | Auto-installed via install.ps1 or `rtk init -g --opencode` |
| Gemini CLI | `gemini extensions install https://github.com/JuliusBrussee/caveman` |
| Codex/Cursor | Auto-installed via install.ps1 |

## Hook Behavior

Caveman hooks fire at:

| Trigger | Action |
|---------|--------|
| **SessionStart** | Verify environment, check context, enforce architecture rules |
| **UserPromptSubmit** | Validate prompt against agent scope before execution |

## Compliance

An agent or developer operating **without caveman hooks active** is operating
**outside the governed workflow**. Outputs are NOT valid ARCHRON contributions.

---

# B. RTK — Token Optimizer

## What

RTK (Rust Token Killer) is a CLI binary that wraps shell commands and filters
output to reduce LLM token consumption by 60–99%.

Every shell command an agent issues **MUST** pass through `rtk`.

**Repository**: `rtk-ai/rtk` (NOT `reachingforthejack/rtk`)

## Installation

```powershell
# Download latest Windows binary
$version = "0.43.0"
$url = "https://github.com/rtk-ai/rtk/releases/download/v$version/rtk-x86_64-pc-windows-msvc.zip"
$tmp = "$env:TEMP\rtk.zip"
Invoke-WebRequest $url -OutFile $tmp
Expand-Archive $tmp -DestinationPath "$env:TEMP\rtk" -Force
Copy-Item "$env:TEMP\rtk\rtk.exe" "$env:USERPROFILE\.cargo\bin\rtk.exe" -Force
# Ensure ~\.cargo\bin is in PATH
```

## Verification

```bash
rtk --version   # Must output: rtk 0.43.0
rtk gain        # Must show token savings stats
```

**CRITICAL**: If `rtk gain` fails, you have the WRONG `rtk` installed (Rust Type Kit).
Uninstall immediately: `cargo uninstall rtk`

## Mandatory Usage Rules

### RULE 1: Use `rtk` as shell command proxy

```bash
# WRONG  — raw commands
git status
pnpm install
vitest run

# RIGHT  — through rtk
rtk git status
rtk pnpm install
rtk vitest run
```

### RULE 2: All high-output commands must use rtk

| Category | Commands |
|----------|----------|
| Git | `rtk git status`, `rtk git diff`, `rtk git log`, `rtk git add`, `rtk git commit`, `rtk git push` |
| Package Manager | `rtk pnpm install`, `rtk pnpm list`, `rtk pnpm outdated` |
| Testing | `rtk vitest`, `rtk jest`, `rtk playwright test` |
| File Ops | `rtk ls`, `rtk read`, `rtk grep` |
| Build | `rtk cargo build`, `rtk pnpm build` |

### RULE 3: Verify after every session

```bash
rtk gain            # Show token savings
rtk gain --history  # Show command history
```

## Token Savings (Real Benchmarks)

| Operation | Without RTK | With RTK | Reduction |
|-----------|------------|----------|-----------|
| `vitest` | 102,199 chars | 377 chars | **-99.6%** |
| `git status` | 529 chars | 217 chars | **-59%** |
| `pnpm list` | ~8,000 tokens | ~2,400 tokens | **-70%** |
| `pnpm outdated` | ~12,000 tokens | ~1,200-2,400 tokens | **-80–90%** |
| 30 min session | ~150,000 tokens | ~45,000 tokens | **-70%** |

---

# Execution Order

Both tools form the **mandatory toolchain gate** below the Orchestrator:

```
    CAVEMAN HOOKS  ──►  validates session, enforces scope
            │
    ORCHESTRATOR   ──►  selects agents, coordinates workflow
            │
    RTK (all commands) ──►  reduces token output 60–99%
            │
    ── Layer Architecture ──
```

An agent that does not pass through **both** Caveman and RTK is in violation.

---

# Quick Reference Card

<table>
<tr><th>Tool</th><th>Purpose</th><th>Install</th><th>Verify</th></tr>
<tr><td><b>Caveman</b></td><td>Workflow hooks, scope enforcement</td><td><code>install.ps1</code></td><td>Plugin visible in agent settings</td></tr>
<tr><td><b>RTK</b></td><td>Token reduction, command filtering</td><td>GitHub Release binary</td><td><code>rtk gain</code></td></tr>
</table>

**Both are mandatory. Zero tolerance for non-compliance.**

---

End of Agent Architecture v2
