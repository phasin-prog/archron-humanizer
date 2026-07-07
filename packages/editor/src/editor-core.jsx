"use client";
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { cn } from "@archron/ui";
export function EditorCore({ content = "", onChange, placeholder = "เริ่มเขียนที่นี่...", readOnly = false, className, editorRef, }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4, 5, 6] },
                codeBlock: false,
            }),
            Placeholder.configure({ placeholder }),
            Highlight,
        ],
        content,
        editable: !readOnly,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn("prose prose-neutral max-w-none outline-none min-h-[400px] p-6 text-body", "font-sans text-body leading-relaxed", className),
            },
        },
    });
    useEffect(() => {
        if (editorRef)
            editorRef.current = editor;
    }, [editor, editorRef]);
    if (!editor)
        return null;
    return <EditorContent editor={editor}/>;
}
