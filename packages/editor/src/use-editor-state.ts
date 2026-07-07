"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { createInitialState, countWords, estimateReadingTime } from "./index"
import type { EditorState } from "./index"

export function useEditorState(initial?: Partial<EditorState>) {
  const [state, setState] = useState<EditorState>(createInitialState(initial))
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const setContent = useCallback((markdown: string) => {
    setState((s) => ({
      ...s,
      markdown,
      wordCount: countWords(markdown),
    }))
  }, [])

  const setTitle = useCallback((title: string) => {
    setState((s) => ({ ...s, title }))
  }, [])

  const setStatus = useCallback((status: EditorState["status"]) => {
    setState((s) => ({ ...s, status }))
  }, [])

  const addTag = useCallback((tag: string) => {
    setState((s) => s.tags.includes(tag) ? s : { ...s, tags: [...s.tags, tag] })
  }, [])

  const removeTag = useCallback((tag: string) => {
    setState((s) => ({ ...s, tags: s.tags.filter((t) => t !== tag) }))
  }, [])

  const save = useCallback(async () => {
    setState((s) => ({ ...s, lastSaved: new Date().toISOString() }))
    return state
  }, [state])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setState((s) => ({ ...s, lastSaved: new Date().toISOString() }))
    }, 30000)
    return () => clearInterval(intervalRef.current)
  }, [])

  return {
    state,
    setContent,
    setTitle,
    setStatus,
    addTag,
    removeTag,
    save,
    readingTime: estimateReadingTime(state.wordCount),
  }
}
