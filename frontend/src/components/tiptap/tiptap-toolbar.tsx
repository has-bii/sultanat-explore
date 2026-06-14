"use client"

import type { Editor } from "@tiptap/react"
import { useEditorState } from "@tiptap/react"
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Props {
  editor: Editor
  onOpenImagePicker: () => void
}

function ToolbarButton({
  label,
  shortcut,
  icon,
  onClick,
  isActive = false,
  disabled = false,
}: {
  label: string
  shortcut?: string
  icon: React.ReactNode
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={isActive ? "secondary" : "ghost"}
          size="icon-sm"
          disabled={disabled}
          onClick={onClick}
          aria-label={label}
          aria-pressed={isActive}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {label}
        {shortcut && <kbd className="ml-1.5 text-[10px] opacity-60">{shortcut}</kbd>}
      </TooltipContent>
    </Tooltip>
  )
}

export function TiptapToolbar({ editor, onOpenImagePicker }: Props) {
  const { isBold, isItalic, isHeading2, isHeading3, isBulletList, isOrderedList, isBlockquote } =
    useEditorState({
      editor,
      selector: ({ editor: e }) => ({
        isBold: e.isActive("bold"),
        isItalic: e.isActive("italic"),
        isHeading2: e.isActive("heading", { level: 2 }),
        isHeading3: e.isActive("heading", { level: 3 }),
        isBulletList: e.isActive("bulletList"),
        isOrderedList: e.isActive("orderedList"),
        isBlockquote: e.isActive("blockquote"),
      }),
    })

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="flex flex-wrap items-center gap-0.5 border-b p-1.5"
        role="toolbar"
        aria-label="Formatting"
      >
        {/* Text formatting */}
        <ToolbarButton
          label="Tebal"
          shortcut="Ctrl+B"
          icon={<Bold />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={isBold}
        />
        <ToolbarButton
          label="Miring"
          shortcut="Ctrl+I"
          icon={<Italic />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={isItalic}
        />

        <Separator
          orientation="vertical"
          className="mx-2 my-auto data-[orientation=vertical]:h-4"
        />

        {/* Headings */}
        <ToolbarButton
          label="Judul 2"
          shortcut="Ctrl+Alt+2"
          icon={<Heading2 />}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={isHeading2}
        />
        <ToolbarButton
          label="Judul 3"
          shortcut="Ctrl+Alt+3"
          icon={<Heading3 />}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={isHeading3}
        />

        <Separator
          orientation="vertical"
          className="mx-2 my-auto data-[orientation=vertical]:h-4"
        />

        {/* Lists */}
        <ToolbarButton
          label="Daftar Bullet"
          icon={<List />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={isBulletList}
        />
        <ToolbarButton
          label="Daftar Nomor"
          icon={<ListOrdered />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={isOrderedList}
        />

        <Separator
          orientation="vertical"
          className="mx-2 my-auto data-[orientation=vertical]:h-4"
        />

        {/* Block elements */}
        <ToolbarButton
          label="Kutipan"
          icon={<Quote />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={isBlockquote}
        />
        <ToolbarButton
          label="Garis Horizontal"
          icon={<Minus />}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />

        <Separator
          orientation="vertical"
          className="mx-2 my-auto data-[orientation=vertical]:h-4"
        />

        {/* Image */}
        <ToolbarButton label="Sisip Gambar" icon={<ImageIcon />} onClick={onOpenImagePicker} />
      </div>
    </TooltipProvider>
  )
}
