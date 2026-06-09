import { create } from "zustand"

export type ImagePickerMode = "single" | "multi"

interface State {
  open: boolean
  mode: ImagePickerMode
  onOpen: (mode?: ImagePickerMode) => void
  onClose: () => void
}

export const useImagePickerDialogStore = create<State>()((set) => ({
  open: false,
  mode: "single",
  onOpen: (mode: ImagePickerMode = "single") => set({ open: true, mode }),
  onClose: () => set({ open: false }),
}))
