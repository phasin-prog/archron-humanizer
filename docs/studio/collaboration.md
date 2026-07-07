# Collaboration (Future)

## Feature Set

### Comments
- Inline comments on specific text selections
- Threaded replies
- Resolve / unresolve
- @mention to notify specific users
- Comment history preserved

### Suggestions
- Proposed edits that the Writer can accept/reject
- Similar to Google Docs suggestion mode
- Each suggestion tracked as a diff
- Batch accept/reject

### Review Workflow
- Assign Reviewer to Draft
- Reviewer sees: Draft + Comments + Validation Results
- Review actions: Approve, Request Changes, Needs Discussion
- Reviewer checklist visible to Writer
- Notifications on status change

### Approval Chain
```
Writer submits
    │
    ▼
Reviewer approves
    │
    ▼
Editor publishes
```

Optional: Senior Editor approval for sensitive domains.

### Assignments
- Editor assigns Drafts to specific Writers
- Writers see assigned work on Dashboard
- Due dates and priority levels
- Assignment notifications
- Workload overview for Editors

## Data Model

```typescript
interface Comment {
  id: string
  draftId: string
  userId: string
  text: string
  selection?: { start: number; end: number } // text range
  parentId?: string // for replies
  resolved: boolean
  createdAt: timestamp
}

interface Suggestion {
  id: string
  draftId: string
  userId: string
  originalText: string
  suggestedText: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: timestamp
}

interface Assignment {
  id: string
  draftId: string
  assignedBy: string
  assignedTo: string
  dueDate?: timestamp
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
}
```
