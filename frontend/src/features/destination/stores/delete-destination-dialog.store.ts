import { createDialogStore } from "@/hooks/create-dialog-store"

export const useDeleteDestinationDialogStore = createDialogStore<{ id: string; name: string }>()
