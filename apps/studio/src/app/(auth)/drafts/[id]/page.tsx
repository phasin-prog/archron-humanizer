
"use client"

import { useRef, useState, useEffect, use } from "react"
import type { Editor } from "@tiptap/react"
import {
  EditorCore,
  EditorToolbar,
  StatusBar,
  LivePreview,
  EditorLayout,
  useEditorState,
} from "@archron/editor"
import { Input, Button } from "@archron/ui"

export default function DraftEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  // TODO: Load draft content from database using id
  void id
  const { state, setContent, setTitle, setStatus, save, readingTime } =
    useEditorState()
  const editorRef = useRef<Editor | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)

  useEffect(() => {
    setEditor(editorRef.current)
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-4 border-b px-6 py-3 bg-muted/20">
        <Input
          value={state.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Draft"
          className="max-w-lg border-0 bg-transparent text-page-title font-serif font-bold shadow-none focus-visible:ring-0"
        />
        <div className="ml-auto flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatus("review")}
          >
            Submit for Review
          </Button>
          <Button size="sm" onClick={save}>
            Save
          </Button>
        </div>
      </div>

      <EditorLayout className="flex-1 min-h-0">
        <div className="p-4">
          <p className="text-caption text-muted-foreground">Outline</p>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          {editor && <EditorToolbar editor={editor} />}
          <EditorCore
            content={state.markdown}
            onChange={setContent}
            editorRef={editorRef}
            className="flex-1"
          />
        </div>

        <LivePreview markdown={state.markdown} />
      </EditorLayout>

      <StatusBar
        wordCount={state.wordCount}
        readingTime={readingTime}
        lastSaved={state.lastSaved ? new Date(state.lastSaved) : null}
        status={state.status}
      />
    </div>
  )
}
