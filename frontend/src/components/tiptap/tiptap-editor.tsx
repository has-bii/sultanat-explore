"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import { forwardRef, useImperativeHandle } from "react"

import { cn } from "@/lib/utils"
import ImageExtension from "@tiptap/extension-image"
import StarterKit from "@tiptap/starter-kit"

import { TiptapToolbar } from "./tiptap-toolbar"

interface TiptapEditorProps {
  content?: Record<string, unknown> | null
  onChange?: (content: Record<string, unknown>) => void
  onInsertImage?: () => void
  className?: string
  placeholder?: string
}

export interface TiptapEditorRef {
  insertImage: (url: string) => void
  getEditor: () => ReturnType<typeof useEditor>
}

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  function TiptapEditor(props, ref) {
    const { content, onChange, onInsertImage, className } = props

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3] },
        }),
        ImageExtension.configure({
          inline: false,
          allowBase64: false,
        }),
      ],
      content: content ?? undefined,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4",
        },
      },
      onUpdate: ({ editor }) => {
        onChange?.(editor.getJSON())
      },
    })

    useImperativeHandle(ref, () => ({
      insertImage: (url: string) => {
        editor?.chain().focus().setImage({ src: url }).run()
      },
      getEditor: () => editor as NonNullable<typeof editor>,
    }))

    return (
      <div
        className={cn(
          "bg-background rounded-md border [&_ol]:list-decimal [&_ul]:list-disc",
          className,
        )}
      >
        <TiptapToolbar editor={editor} onInsertImage={onInsertImage} />
        <EditorContent editor={editor} />
      </div>
    )
  },
)
