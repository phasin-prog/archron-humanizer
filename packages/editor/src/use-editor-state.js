"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { createInitialState, countWords, estimateReadingTime } from "./index";
export function useEditorState(initial) {
    const [state, setState] = useState(createInitialState(initial));
    const intervalRef = useRef(undefined);
    const setContent = useCallback((markdown) => {
        setState((s) => ({
            ...s,
            markdown,
            wordCount: countWords(markdown),
        }));
    }, []);
    const setTitle = useCallback((title) => {
        setState((s) => ({ ...s, title }));
    }, []);
    const setStatus = useCallback((status) => {
        setState((s) => ({ ...s, status }));
    }, []);
    const addTag = useCallback((tag) => {
        setState((s) => s.tags.includes(tag) ? s : { ...s, tags: [...s.tags, tag] });
    }, []);
    const removeTag = useCallback((tag) => {
        setState((s) => ({ ...s, tags: s.tags.filter((t) => t !== tag) }));
    }, []);
    const save = useCallback(async () => {
        setState((s) => ({ ...s, lastSaved: new Date().toISOString() }));
        return state;
    }, [state]);
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setState((s) => ({ ...s, lastSaved: new Date().toISOString() }));
        }, 30000);
        return () => clearInterval(intervalRef.current);
    }, []);
    return {
        state,
        setContent,
        setTitle,
        setStatus,
        addTag,
        removeTag,
        save,
        readingTime: estimateReadingTime(state.wordCount),
    };
}
