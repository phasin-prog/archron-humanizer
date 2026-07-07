# Component Registry

Every piece of content maps to a registered component. There is no template system.

## Registry Structure

```typescript
interface ComponentRegistry {
  // Inline components (rendered inside text flow)
  inline: Map<ASTNodeType, InlineComponent>
  
  // Block components (take full width)
  block: Map<ASTNodeType, BlockComponent>
  
  // Page-level components (full page layout)
  page: Map<ObjectType, PageComponent>
  
  // Context overrides (same type, different context)
  context: Map<string, ComponentOverride>
}
```

## Registered Components

### Inline Components

| AST Node | Component | Description |
|----------|-----------|-------------|
| `text` | `Text` | Plain text with formatting |
| `bold` | `Bold` | Strong emphasis |
| `italic` | `Italic` | Emphasis |
| `link` | `Link` | External hyperlink |
| `code` | `InlineCode` | Inline code fragment |
| `wikilink_concept` | `ConceptLink` | Linked concept name + tooltip |
| `wikilink_thinker` | `ThinkerLink` | Linked thinker name + tooltip |
| `wikilink_book` | `BookLink` | Linked book title |
| `wikilink_symbol` | `SymbolLink` | Linked symbol name |
| `wikilink_quote` | `QuoteInline` | Inline quote reference |
| `citation` | `Citation` | Inline citation badge |
| `footnote_ref` | `FootnoteRef` | Footnote reference number |

### Block Components

| AST Node | Component | Description |
|----------|-----------|-------------|
| `heading` | `Heading` | Section heading with anchor link |
| `paragraph` | `Paragraph` | Text paragraph |
| `list_ul` | `UnorderedList` | Bullet list |
| `list_ol` | `OrderedList` | Numbered list |
| `blockquote` | `Blockquote` | Block quote |
| `code_block` | `CodeBlock` | Code block with syntax highlighting |
| `image` | `Image` | Image with caption |
| `table` | `Table` | Data table |
| `divider` | `Divider` | Horizontal rule |
| `callout` | `Callout` | Info/warning/tip callout |
| `accordion` | `Accordion` | Collapsible section |
| `tabs` | `Tabs` | Tabbed content |
| `concept_card` | `ConceptCard` | Full concept card with definition |
| `thinker_card` | `ThinkerCard` | Thinker profile card |
| `book_card` | `BookCard` | Book reference card |
| `symbol_display` | `SymbolDisplay` | Symbol with visualization |
| `quote_block` | `QuoteBlock` | Styled quote presentation |
| `timeline` | `Timeline` | Interactive timeline |
| `gallery` | `Gallery` | Image gallery |
| `figure` | `Figure` | Image with caption and metadata |
| `graph` | `KnowledgeGraph` | Interactive knowledge graph |
| `compare` | `CompareView` | Side-by-side comparison |
| `related` | `RelatedContent` | Auto-generated related content |
| `table_of_contents` | `TableOfContents` | Auto-generated TOC |

### Page Components

| Object Type | Layout Component | Description |
|-------------|------------------|-------------|
| `concept` | `ConceptLayout` | Full concept page |
| `thinker` | `ThinkerLayout` | Full thinker page |
| `theory` | `TheoryLayout` | Full theory page |
| `school` | `SchoolLayout` | Full school page |
| `book` | `BookLayout` | Full book page |
| `article` | `ArticleLayout` | Full article page |
| `symbol` | `SymbolLayout` | Full symbol page |
| `guide` | `GuideLayout` | Full guide page |
| `quote` | `QuotePage` | Single quote page |
| `timeline_event` | `TimelineEventPage` | Single event page |
| `collection` | `CollectionLayout` | Collection page |
| `glossary` | `GlossaryLayout` | Glossary page |

## Registry Rules

- Every registered component must have a loading state and an error state
- Unknown AST node types render as a `Fragment` (silently skipped)
- Context overrides take priority over default mappings
- Components can be lazy-loaded — the Registry supports dynamic imports
- No component may query the database — all data comes pre-resolved from the Knowledge Resolver
