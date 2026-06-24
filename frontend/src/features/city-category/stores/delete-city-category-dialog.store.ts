import { createDialogStore } from "@/hooks/create-dialog-store"

export const useDeleteCityCategoryDialogStore = createDialogStore<{ id: string; name: string }>()