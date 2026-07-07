// ============================================
// CLIENT HOOKS — React hooks for data fetching
// ============================================

"use client"

import { useState, useEffect, useCallback } from "react"

type ObjectResult = any
type SearchResponse = any

/**
 * Hook to fetch object by slug
 */
export function useObject(slug: string | null) {
  const [data, setData] = useState<ObjectResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) {
      setData(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/objects/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { data, loading, error }
}

/**
 * Hook to fetch object backlinks
 */
export function useBacklinks(slug: string | null, limit: number = 10) {
  const [data, setData] = useState<ObjectResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) {
      setData([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/objects/${slug}/backlinks?limit=${limit}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((result) => {
        if (!cancelled) {
          setData(result.backlinks || [])
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug, limit])

  return { data, loading, error }
}

/**
 * Hook to fetch object recommendations
 */
export function useRecommendations(slug: string | null, limit: number = 5) {
  const [data, setData] = useState<ObjectResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) {
      setData([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/objects/${slug}/recommendations?limit=${limit}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((result) => {
        if (!cancelled) {
          setData(result.recommendations || [])
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug, limit])

  return { data, loading, error }
}

/**
 * Hook for search with debouncing
 */
export function useSearch(initialTerm: string = "", debounceMs: number = 300) {
  const [term, setTerm] = useState(initialTerm)
  const [debouncedTerm, setDebouncedTerm] = useState(initialTerm)
  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Debounce term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [term, debounceMs])

  // Fetch on debounced term change
  useEffect(() => {
    if (!debouncedTerm || debouncedTerm.length < 2) {
      setData(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/search?q=${encodeURIComponent(debouncedTerm)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [debouncedTerm])

  const search = useCallback((newTerm: string) => {
    setTerm(newTerm)
  }, [])

  const clear = useCallback(() => {
    setTerm("")
    setDebouncedTerm("")
    setData(null)
  }, [])

  return {
    term,
    search,
    clear,
    data,
    loading,
    error,
  }
}

/**
 * Hook to fetch object relations
 */
export function useRelations(slug: string | null) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) {
      setData([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/objects/${slug}/relations`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((result) => {
        if (!cancelled) {
          setData(result || [])
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { data, loading, error }
}
