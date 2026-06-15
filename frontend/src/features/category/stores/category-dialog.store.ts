import { createDialogStore } from "@/hooks/create-dialog-store"

export const useCategoryDialogStore = createDialogStore<{ id: string; name: string }>()
