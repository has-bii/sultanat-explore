import { create } from "zustand"

interface State {
  open: boolean
  selectedAttractionId: string | null
  selectedAttractionName: string | null
  onOpen: (attractionId: string, attractionName: string) => void
  onClose: () => void
}

export const useDeleteAttractionDialogStore = create<State>()((set) => ({
  open: false,
  selectedAttractionId: null,
  selectedAttractionName: null,
  onClose: () => set({ open: false, selectedAttractionId: null, selectedAttractionName: null }),
  onOpen: (attractionId: string, attractionName: string) => {
    set({ selectedAttractionId: attractionId, selectedAttractionName: attractionName, open: true })
  },
}))