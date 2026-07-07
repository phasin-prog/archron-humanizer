"use client";
import React from "react";
import { cn } from "@archron/ui";
export function EditorToolbar({ editor, className }) {
    const buttons = [
        { label: "H1", icon: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive("heading", { level: 1 }) },
        { label: "H2", icon: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive("heading", { level: 2 }) },
        { label: "H3", icon: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive("heading", { level: 3 }) },
        { label: "Bold", icon: "B", action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive("bold") },
        { label: "Italic", icon: "I", action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive("italic") },
        { label: "Strike", icon: "S", action: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive("strike") },
        { label: "Code", icon: "<>", action: () => editor.chain().focus().toggleCode().run(), isActive: () => editor.isActive("code") },
        { label: "Quote", icon: "\"", action: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive("blockquote") },
        { label: "Bullet", icon: "\u2022", action: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive("bulletList") },
        { label: "Ordered", icon: "1.", action: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive("orderedList") },
        { label: "HR", icon: "\u2014", action: () => editor.chain().focus().setHorizontalRule().run(), isActive: () => false },
        { label: "CodeBlock", icon: "{ }", action: () => editor.chain().focus().toggleCodeBlock().run(), isActive: () => editor.isActive("codeBlock") },
        { label: "Undo", icon: "\u21A9", action: () => editor.chain().focus().undo().run(), isActive: () => false },
        { label: "Redo", icon: "\u21AA", action: () => editor.chain().focus().redo().run(), isActive: () => false },
    ];
    return (<div className={cn("flex items-center gap-0.5 p-1 border-b bg-muted/30 overflow-x-auto", className)}>
      {buttons.map((btn) => (<button key={btn.label} type="button" onClick={btn.action} className={cn("rounded px-2 py-1 text-caption font-medium hover:bg-muted transition-colors", btn.isActive() && "bg-muted text-primary")} title={btn.label}>
          {btn.icon}
        </button>))}
    </div>);
}
