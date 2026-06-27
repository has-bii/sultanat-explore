import { createDialogStore } from "@/hooks/create-dialog-store"

export type OpenTripDialogMode = "archive" | "delete"
export interface OpenTripDialogMeta {
  id: string
  mode: OpenTripDialogMode
}

export const useOpenTripActionDialogStore = createDialogStore<OpenTripDialogMeta>()
