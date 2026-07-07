# Knowledge Reputation Engine

Reputation is not measured by post count, likes, or followers. It is measured by **knowledge quality**.

## Core Principle

```
High Quality Contribution
        │
        ▼
Accepted by Reviewer
        │
        ▼
Cited by Other Content
        │
        ▼
Improves Knowledge Graph
        │
        ▼
Reputation Increases
```

## Reputation Sources

### Primary Sources (highest weight)

| Source | Weight | Example |
|--------|--------|---------|
| Peer citations | High | An Article citing your Concept |
| Reviewer acceptance | High | Your Draft approved with minimal changes |
| Knowledge Graph improvement | High | Your new Concept fills a gap in the Graph |
| Error correction accepted | High | Your fix improves published content |
| Reference validation | High | You added a verified DOI to an Object |

### Secondary Sources (medium weight)

| Source | Weight | Example |
|--------|--------|---------|
| Published content | Medium | Article published |
| Review completion | Medium | Review completed on time |
| Translation | Medium | Object translated to another language |
| Collection curation | Medium | Collection with > 10 objects |
| Guide creation | Medium | Guide completed and published |

### Tertiary Sources (low weight)

| Source | Weight | Example |
|--------|--------|---------|
| Issue report | Low | Bug or content issue reported |
| Suggestion accepted | Low | Reference suggestion adopted |
| Comment | Low | Helpful comment on discussion |

## Reputation Penalties

| Action | Impact |
|--------|--------|
| Published content found to contain significant errors | −20 reputation + content marked for review |
| Repeated low-quality submissions | Reviewer flag + reduced submission priority |
| Plagiarism or copyright violation | −100 reputation + account suspension |
| Abusive review feedback | Reviewer role review |
| Gaming the system (artificial reputation farming) | Reputation reset + role demotion |

## Reputation Levels

| Level | Reputation | Title | Privilege |
|-------|------------|-------|-----------|
| 0 | 0 | Seeker | Basic read |
| 1 | 50 | Apprentice | Create Collections |
| 2 | 150 | Scholar | Suggest corrections |
| 3 | 350 | Researcher | Apply for Writer role |
| 4 | 650 | Authority | Apply for Reviewer role |
| 5 | 1000 | Sage | Early access to features |
| 6 | 1500 | Luminary | Mentor new writers |
| 7 | 2500 | Pillar | Curator role eligibility |
| 8 | 4000 | Guardian | Editor nomination weight |

## Reputation Decay

- Reputation does not decay over time (knowledge contributions are permanent)
- Reputation only decreases through quality penalties (not inactivity)
- A user may stop contributing for 2 years and retain their reputation level
- Active contributors get a small "activity bonus" (+1 per week of activity)

## Transparency

- Reputation calculation is fully transparent — users can see exactly how each point was earned
- Every reputation change is logged: `"Earned +15 for Article 'The Shadow' approved"`
- No hidden multipliers or secret scoring
- Reputation is displayed on the user's Profile
- Formula: `Reputation = Σ(contribution_value × quality_multiplier) − penalties`
