import { create } from "zustand"

interface State {
  open: boolean
  selectedImageId: string | null
  onOpen: (imageId: string) => void
  onClose: () => void
}

export const useImageDetailSheetStore = create<State>()((set) => ({
  open: false,
  selectedImageId: null,
  onOpen: (imageId) => set({ selectedImageId: imageId, open: true }),
  onClose: () => {
    set({ open: false })
    setTimeout(() => set({ selectedImageId: null }), 300)
  },
}))
