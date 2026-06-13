import { create } from "zustand"

interface State {
  open: boolean
  selectedAttractionId: string | null
  onOpen: (attractionId: string | null) => void
  onClose: () => void
}

export const useAttractionDialogStore = create<State>()((set) => ({
  open: false,
  selectedAttractionId: null,
  onClose: () => set({ open: false }),
  onOpen: (attractionId: string | null) => {
    set({ selectedAttractionId: attractionId, open: true })
  },
}))
