import { create } from "zustand"

interface DialogState {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpen: () => void
}

export const useUploadImagesDialogStore = create<DialogState>()((set) => ({
  open: false,
  onOpenChange: (open) => set(() => ({ open })),
  onOpen: () => set(() => ({ open: true })),
}))
