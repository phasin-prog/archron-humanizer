"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Card, Input } from "@archron/ui"
import { ChatIcon } from "@archron/ui"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

const suggestions = [
  "What is the Shadow?",
  "Explain Archetypes",
  "Compare Jung vs Freud",
]

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: "I am your knowledge companion. Ask me anything about psychology, philosophy, or the thinkers and concepts in the ARCHRON ecosystem.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.response ?? "I am still learning. Check back soon.",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "I am temporarily unavailable. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSend(input)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-container-page flex-col px-6">
      <div className="flex items-center gap-2.5 py-6">
        <ChatIcon className="h-5 w-5 text-primary" />
        <h1 className="font-serif text-section font-semibold text-text">Companion</h1>
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 pb-4">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSend(s)}
              disabled={loading}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-caption text-text-secondary transition-colors duration-[var(--motion-fast)] hover:border-primary/40 hover:text-text disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <Card className="flex flex-1 flex-col overflow-hidden border-0 bg-transparent shadow-none">
        <div className="flex-1 overflow-y-auto px-1 py-4 scrollbar-thin">
          <div className="mx-auto flex max-w-[720px] flex-col gap-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-body leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary/10 text-text"
                      : "bg-card text-text-secondary animate-in fade-in slide-in-from-bottom-1 duration-[var(--motion-normal)]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1.5 rounded-2xl bg-card px-5 py-3.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[720px] pb-6 pt-2">
          <form onSubmit={handleSubmit} className="flex gap-2.5">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any concept, thinker, or theory..."
              disabled={loading}
              className="flex-1 rounded-xl bg-card text-text placeholder:text-text-disabled"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-hover disabled:opacity-50"
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </form>
        </div>
      </Card>
    </div>
  )
}
