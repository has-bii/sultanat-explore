import { createDialogStore } from "@/hooks/create-dialog-store"

export const useDeleteCategoryDialogStore = createDialogStore<{ id: string; name: string }>()
