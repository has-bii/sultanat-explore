import { createDialogStore } from "@/hooks/create-dialog-store"

export const useDeleteUserDialogStore = createDialogStore<{ id: string; name: string }>()
