import { create } from "zustand"

/**
 * Generic dialog/sheet store factory.
 *
 * TMeta: data passed when opening (e.g. selected entity ID).
 * - void → simple open/close (no metadata).
 * - string → open with ID (entity selection).
 * - { id: string; name: string } → open with multiple fields.
 */
export function createDialogStore<TMeta>() {
  interface State {
    open: boolean
    meta: TMeta | null
    onOpen: (meta: TMeta | null) => void
    onClose: () => void
  }

  return create<State>()((set) => ({
    open: false,
    meta: null,
    onOpen: (meta: TMeta | null) => set({ meta, open: true }),
    onClose: () => set({ open: false, meta: null }),
  }))
}

/**
 * Specialized store for toggle-only dialogs (no metadata).
 * Provides `onOpen()` and `onOpenChange(bool)` for shadcn Dialog's `onOpenChange`.
 */
export function createToggleStore() {
  interface State {
    open: boolean
    onOpen: () => void
    onOpenChange: (open: boolean) => void
  }

  return create<State>()((set) => ({
    open: false,
    onOpen: () => set({ open: true }),
    onOpenChange: (open) => set({ open }),
  }))
}
