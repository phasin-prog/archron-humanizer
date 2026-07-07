"use client";
import { useState, useCallback, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@archron/ui";
const FLAGS_BY_ID = {
    flg_001: {
        id: "flg_001",
        contentTitle: "The Shadow in Jungian Psychology",
        contentSlug: "shadow-jungian",
        contentType: "concept",
        contentExcerpt: "The shadow is a critical component of Jung's analytical psychology, representing the unconscious aspects of the personality that the conscious ego does not identify with...",
        type: "Inaccurate",
        reporter: "Jessica Wilson",
        reporterEmail: "jessica.wilson@example.com",
        date: "2026-07-06",
        description: "The article incorrectly states that Jung developed the shadow concept in 1921. The correct date is 1917, as documented in 'The Psychology of the Unconscious'.",
        status: "pending",
        owner: { name: "Dr. Marcus Chen", email: "marcus.chen@example.com" },
    },
    flg_002: {
        id: "flg_002",
        contentTitle: "Nietzsche and the Death of God",
        contentSlug: "nietzsche-death-god",
        contentType: "article",
        contentExcerpt: "Nietzsche's proclamation of the death of God represents one of the most profound critiques of Western metaphysics and morality...",
        type: "Offensive",
        reporter: "Marcus Aurelius",
        reporterEmail: "marcus.aurelius@example.com",
        date: "2026-07-05",
        description: "Contains unnecessarily inflammatory language toward religious readers. The content could present Nietzsche's ideas without antagonizing specific faith communities.",
        status: "pending",
        owner: { name: "Sarah Klein", email: "sarah.klein@example.com" },
    },
    flg_003: {
        id: "flg_003",
        contentTitle: "Freud's Interpretation of Dreams",
        contentSlug: "freud-interpretation-dreams",
        contentType: "book",
        contentExcerpt: "First published in 1899, 'The Interpretation of Dreams' introduced Freud's theory of the unconscious mind and the mechanism of dream formation...",
        type: "Copyright",
        reporter: "Sarah Chen",
        reporterEmail: "sarah.chen@example.com",
        date: "2026-07-04",
        description: "Extended quotation from Penguin Classics edition exceeds fair use limits. Requires trimming or paraphrasing with proper citation.",
        status: "resolved",
        owner: { name: "Prof. David Kim", email: "david.kim@example.com" },
        resolvedAt: "2026-07-04",
        resolutionNote: "Trimmed the quoted passage to within fair use limits and added proper Penguin Classics attribution.",
    },
    flg_004: {
        id: "flg_004",
        contentTitle: "Behaviorism: A Critical Analysis",
        contentSlug: "behaviorism-analysis",
        contentType: "article",
        contentExcerpt: "The behaviorist movement, pioneered by Watson and extended by Skinner, fundamentally challenged introspective methods in psychology...",
        type: "Spam",
        reporter: "David Kim",
        reporterEmail: "david.kim@example.com",
        date: "2026-07-03",
        description: "Content appears to be AI-generated placeholder text with no substantive analysis. Lacks citations and academic rigor.",
        status: "dismissed",
        owner: { name: "Emily Ross", email: "emily.ross@example.com" },
        resolvedAt: "2026-07-03",
        resolutionNote: "Flag dismissed — content is an early draft that the writer is still developing. Provided feedback to improve citations.",
    },
    flg_005: {
        id: "flg_005",
        contentTitle: "Existentialism and Authenticity",
        contentSlug: "existentialism-authenticity",
        contentType: "theory",
        contentExcerpt: "Authenticity, as developed by existentialist thinkers from Kierkegaard to Sartre, concerns the individual's relationship to their own existence and choices...",
        type: "Misleading",
        reporter: "Emma Davis",
        reporterEmail: "emma.davis@example.com",
        date: "2026-07-02",
        description: "Conflates Sartre's notion of bad faith with Heidegger's concept of inauthenticity. These are distinct concepts with different philosophical foundations.",
        status: "pending",
        owner: { name: "Dr. Rachel Torres", email: "rachel.torres@example.com" },
    },
    flg_006: {
        id: "flg_006",
        contentTitle: "Collective Unconscious: A Guide",
        contentSlug: "collective-unconscious",
        contentType: "guide",
        contentExcerpt: "The collective unconscious contains the archetypes — primordial images and patterns that structure human experience across cultures and historical periods...",
        type: "Duplicate",
        reporter: "Liam Nguyen",
        reporterEmail: "liam.nguyen@example.com",
        date: "2026-07-01",
        description: "This guide substantially duplicates the 'Archetypes and the Collective Unconscious' article already published. Consider merging or redirecting.",
        status: "pending",
        owner: { name: "Prof. James Hart", email: "james.hart@example.com" },
    },
};
const STATUS_VARIANT = {
    pending: "warning",
    resolved: "success",
    dismissed: "secondary",
};
function ResolveDialog({ disabled, onResolved }) {
    const [open, setOpen] = useState(false);
    const [note, setNote] = useState("");
    const [error, setError] = useState(false);
    const handleResolve = useCallback(() => {
        if (!note.trim()) {
            setError(true);
            return;
        }
        onResolved(note);
        setOpen(false);
        setNote("");
        setError(false);
    }, [note, onResolved]);
    return (<Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} disabled={disabled}>
        Resolve
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Flag</DialogTitle>
          <DialogDescription>
            Dismiss this flag as resolved. A resolution note is required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-caption font-medium">Resolution Note</label>
            <Textarea placeholder="Describe what action was taken..." value={note} onChange={(e) => { setNote(e.target.value); setError(false); }} rows={4}/>
            {error && <p className="text-caption text-destructive">A resolution note is required.</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => { setOpen(false); setError(false); }}>Cancel</Button>
          <Button size="sm" onClick={handleResolve}>Resolve Flag</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
function ActionDialog({ disabled }) {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    return (<Dialog open={open} onOpenChange={setOpen}>
      <Button variant="destructive" size="sm" onClick={() => { setOpen(true); setAction(null); setConfirmed(false); }} disabled={disabled}>
        Take Action
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Take Action</DialogTitle>
          <DialogDescription>
            Apply a moderation action to this content and its owner.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <label className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <input type="radio" name="action" value="hide" checked={action === "hide"} onChange={() => setAction("hide")} className="h-4 w-4"/>
            <div>
              <p className="text-caption font-medium">Hide Content</p>
              <p className="text-caption text-muted-foreground">Removes the content from public view. The owner can edit and resubmit.</p>
            </div>
          </label>
          <label className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <input type="radio" name="action" value="warn" checked={action === "warn"} onChange={() => setAction("warn")} className="h-4 w-4"/>
            <div>
              <p className="text-caption font-medium">Warn User</p>
              <p className="text-caption text-muted-foreground">Sends a warning message. The content remains visible.</p>
            </div>
          </label>
          {confirmed && action && (<p className="text-caption text-destructive">
              This action will immediately affect the content and notify the owner. Confirm?
            </p>)}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" size="sm" disabled={!action} onClick={() => { if (!confirmed) {
        setConfirmed(true);
    }
    else {
        setOpen(false);
    } }}>
            {confirmed ? "Confirm Action" : "Apply Action"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
export default function FlagDetailPage({ params }) {
    const { id } = use(params);
    const initialFlag = FLAGS_BY_ID[id];
    const [flag, setFlag] = useState(initialFlag ? { ...initialFlag } : null);
    const handleResolved = useCallback((note) => {
        setFlag((prev) => prev ? {
            ...prev,
            status: "resolved",
            resolutionNote: note,
            resolvedAt: new Date().toISOString().split("T")[0],
        } : null);
    }, []);
    if (!flag) {
        return (<div className="mx-auto max-w-3xl space-y-4 p-6">
        <Link href="/admin/moderation" className="text-caption text-muted-foreground hover:text-foreground">
          &larr; Back to Moderation
        </Link>
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-card-title font-serif">Flag not found</p>
            <p className="text-caption text-muted-foreground mt-2">The flag with ID {id} does not exist.</p>
          </CardContent>
        </Card>
      </div>);
    }
    return (<div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/moderation" className="text-caption text-muted-foreground hover:text-foreground">
            &larr; Back to Moderation
          </Link>
          <h1 className="text-page-title font-serif font-bold mt-1">Flag Detail</h1>
        </div>
        <Badge variant={STATUS_VARIANT[flag.status]}>{flag.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flagged Content</CardTitle>
          <CardDescription>{flag.contentType} &bull; /{flag.contentSlug}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={`/objects/${flag.contentSlug}`} className="text-card-title font-serif hover:text-primary transition-colors">
            {flag.contentTitle}
          </Link>
          <p className="mt-3 text-body text-muted-foreground leading-relaxed">{flag.contentExcerpt}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flag Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-caption">
            <div>
              <p className="text-muted-foreground">Flag ID</p>
              <p className="font-mono">{flag.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Type</p>
              <Badge variant="outline" className="mt-0.5">{flag.type}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Reporter</p>
              <p>{flag.reporter} <span className="text-muted-foreground">({flag.reporterEmail})</span></p>
            </div>
            <div>
              <p className="text-muted-foreground">Date Reported</p>
              <p>{flag.date}</p>
            </div>
          </div>
          <div>
            <p className="text-caption text-muted-foreground">Description</p>
            <p className="mt-1 text-body leading-relaxed">{flag.description}</p>
          </div>
          {flag.resolutionNote && (<div>
              <p className="text-caption text-muted-foreground">Resolution Note</p>
              <p className="mt-1 text-body leading-relaxed">{flag.resolutionNote}</p>
            </div>)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Owner</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-card-title">{flag.owner.name}</p>
            <p className="text-caption text-muted-foreground">{flag.owner.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <ResolveDialog disabled={flag.status !== "pending"} onResolved={handleResolved}/>
        <ActionDialog disabled={flag.status !== "pending"}/>
      </div>
    </div>);
}
