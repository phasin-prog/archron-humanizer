"use client"

import { useState } from "react"
import { IconBox } from "@archron/ui"
import {
  // Knowledge Objects
  ConceptIcon,
  ThinkerIcon,
  ArticleIcon,
  BookIcon,
  QuoteIcon,
  TimelineIcon,
  GuideIcon,
  SymbolIcon,
  CollectionIcon,
  // Domains
  PsychologyIcon,
  PhilosophyIcon,
  AnthropologyIcon,
  HistoryIcon,
  LanguageIcon,
  MythologyIcon,
  ReligionIcon,
  ScienceIcon,
  SymbolismIcon,
  ArtIcon,
  AIIcon,
  CivilizationIcon,
  // Actions
  SearchIcon,
  ExploreIcon,
  ConstellationIcon,
  ReadIcon,
  BookmarkIcon,
  ShareIcon,
  EditIcon,
  DeleteIcon,
  SettingsIcon,
  NotificationIcon,
  ProfileIcon,
  PlusIcon,
  CloseIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  FilterIcon,
  SortIcon,
  MenuIcon,
  MoreIcon,
  // Status
  ProgressIcon,
  CompleteIcon,
  DraftIcon,
  PublishedIcon,
  FeaturedIcon,
  ArchivedIcon,
} from "@archron/ui"

const iconCategories = [
  {
    name: "Knowledge Objects",
    icons: [
      { name: "ConceptIcon", Icon: ConceptIcon },
      { name: "ThinkerIcon", Icon: ThinkerIcon },
      { name: "ArticleIcon", Icon: ArticleIcon },
      { name: "BookIcon", Icon: BookIcon },
      { name: "QuoteIcon", Icon: QuoteIcon },
      { name: "TimelineIcon", Icon: TimelineIcon },
      { name: "GuideIcon", Icon: GuideIcon },
      { name: "SymbolIcon", Icon: SymbolIcon },
      { name: "CollectionIcon", Icon: CollectionIcon },
    ],
  },
  {
    name: "Domains",
    icons: [
      { name: "PsychologyIcon", Icon: PsychologyIcon },
      { name: "PhilosophyIcon", Icon: PhilosophyIcon },
      { name: "AnthropologyIcon", Icon: AnthropologyIcon },
      { name: "HistoryIcon", Icon: HistoryIcon },
      { name: "LanguageIcon", Icon: LanguageIcon },
      { name: "MythologyIcon", Icon: MythologyIcon },
      { name: "ReligionIcon", Icon: ReligionIcon },
      { name: "ScienceIcon", Icon: ScienceIcon },
      { name: "SymbolismIcon", Icon: SymbolismIcon },
      { name: "ArtIcon", Icon: ArtIcon },
      { name: "AIIcon", Icon: AIIcon },
      { name: "CivilizationIcon", Icon: CivilizationIcon },
    ],
  },
  {
    name: "Actions",
    icons: [
      { name: "SearchIcon", Icon: SearchIcon },
      { name: "ExploreIcon", Icon: ExploreIcon },
      { name: "ConstellationIcon", Icon: ConstellationIcon },
      { name: "ReadIcon", Icon: ReadIcon },
      { name: "BookmarkIcon", Icon: BookmarkIcon },
      { name: "ShareIcon", Icon: ShareIcon },
      { name: "EditIcon", Icon: EditIcon },
      { name: "DeleteIcon", Icon: DeleteIcon },
      { name: "SettingsIcon", Icon: SettingsIcon },
      { name: "NotificationIcon", Icon: NotificationIcon },
      { name: "ProfileIcon", Icon: ProfileIcon },
      { name: "PlusIcon", Icon: PlusIcon },
      { name: "CloseIcon", Icon: CloseIcon },
      { name: "CheckIcon", Icon: CheckIcon },
      { name: "ArrowLeftIcon", Icon: ArrowLeftIcon },
      { name: "ArrowRightIcon", Icon: ArrowRightIcon },
      { name: "FilterIcon", Icon: FilterIcon },
      { name: "SortIcon", Icon: SortIcon },
      { name: "MenuIcon", Icon: MenuIcon },
      { name: "MoreIcon", Icon: MoreIcon },
    ],
  },
  {
    name: "Status",
    icons: [
      { name: "ProgressIcon", Icon: ProgressIcon },
      { name: "CompleteIcon", Icon: CompleteIcon },
      { name: "DraftIcon", Icon: DraftIcon },
      { name: "PublishedIcon", Icon: PublishedIcon },
      { name: "FeaturedIcon", Icon: FeaturedIcon },
      { name: "ArchivedIcon", Icon: ArchivedIcon },
    ],
  },
]

export default function IconPreviewPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSize, setSelectedSize] = useState<"sm" | "md" | "lg">("md")
  const [selectedVariant, setSelectedVariant] = useState<"default" | "knowledge" | "featured" | "success">("default")

  const filteredCategories = iconCategories.map((category) => ({
    ...category,
    icons: category.icons.filter((icon) =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }))

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-container-page">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-display font-bold text-text">
            ARCHRON Icon Library
          </h1>
          <p className="mt-2 font-serif text-body text-text-muted">
            47 icons — 2px stroke, outline style, academic precision
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search icons..."
            className="w-full rounded-lg border border-border bg-card px-4 py-2 text-body text-text placeholder:text-text-disabled focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 md:max-w-xs"
          />

          {/* Size selector */}
          <div className="flex items-center gap-2">
            <span className="text-caption text-text-muted">Size:</span>
            {(["sm", "md", "lg"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-lg px-3 py-1 text-caption font-medium transition-colors ${
                  selectedSize === size
                    ? "bg-primary text-white"
                    : "bg-card text-text-muted hover:bg-elevated"
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Variant selector */}
          <div className="flex items-center gap-2">
            <span className="text-caption text-text-muted">Variant:</span>
            {(["default", "knowledge", "featured", "success"] as const).map((variant) => (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={`rounded-lg px-3 py-1 text-caption font-medium capitalize transition-colors ${
                  selectedVariant === variant
                    ? "bg-primary text-white"
                    : "bg-card text-text-muted hover:bg-elevated"
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Grid */}
        {filteredCategories.map(
          (category) =>
            category.icons.length > 0 && (
              <div key={category.name} className="mb-12">
                <h2 className="mb-4 font-serif text-section font-semibold text-text">
                  {category.name}
                  <span className="ml-2 font-mono text-caption text-text-disabled">
                    ({category.icons.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {category.icons.map(({ name, Icon }) => (
                    <div key={name} className="flex flex-col items-center gap-3">
                      <IconBox
                        icon={<Icon />}
                        size={selectedSize}
                        variant={selectedVariant}
                      />
                      <span className="text-center font-mono text-caption text-text-muted">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}

        {/* Empty state */}
        {filteredCategories.every((cat) => cat.icons.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-body text-text-muted">No icons found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
