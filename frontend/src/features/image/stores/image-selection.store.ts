import { create } from "zustand"

interface State {
  selectedIds: Set<string>
  toggle: (id: string) => void
  toggleAll: (ids: string[]) => void
  clear: () => void
}

export const useImageSelectionStore = create<State>()((set) => ({
  selectedIds: new Set<string>(),
  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { selectedIds: next }
    }),
  toggleAll: (ids) =>
    set((state) => {
      const allSelected = ids.every((id) => state.selectedIds.has(id))
      if (allSelected) return { selectedIds: new Set<string>() }
      return { selectedIds: new Set(ids) }
    }),
  clear: () => set({ selectedIds: new Set<string>() }),
}))
