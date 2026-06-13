import { createDialogStore } from "@/hooks/create-dialog-store"

export const useDeleteAttractionDialogStore = createDialogStore<{ id: string; name: string }>()