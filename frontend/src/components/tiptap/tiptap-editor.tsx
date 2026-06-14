"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import { useState } from "react"

import { useDebouncedCallback } from "@/hooks/use-debounced-value"
import { cn } from "@/lib/utils"
import type { JSONContent } from "@tiptap/core"
import ImageExtension from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"

import { TiptapImagePicker } from "./tiptap-image-picker"
import { TiptapToolbar } from "./tiptap-toolbar"

interface TiptapEditorProps {
  content?: JSONContent | null
  onChange?: (content: JSONContent) => void
  className?: string
  placeholder?: string
}

export function TiptapEditor({ content, onChange, className, placeholder }: TiptapEditorProps) {
  const [imagePickerOpen, setImagePickerOpen] = useState(false)

  const debouncedOnChange = useDebouncedCallback(onChange ?? (() => {}), 300)

  const insertImage = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run()
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Tulis sesuatu…",
      }),
    ],
    content: content ?? undefined,
    immediatelyRender: true,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      debouncedOnChange(editor.getJSON())
    },
  })

  if (!editor) return null

  return (
    <div
      className={cn(
        "bg-background rounded-md border [&_ol]:list-decimal [&_ul]:list-disc",
        className,
      )}
    >
      <TiptapToolbar editor={editor} onOpenImagePicker={() => setImagePickerOpen(true)} />
      <EditorContent editor={editor} />
      <TiptapImagePicker
        open={imagePickerOpen}
        onOpenChange={setImagePickerOpen}
        onSelect={insertImage}
      />
    </div>
  )
}
