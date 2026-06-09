import { create } from "zustand"

interface State {
  selectedIds: Set<string>
  toggle: (id: string) => void
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
  clear: () => set({ selectedIds: new Set<string>() }),
}))
