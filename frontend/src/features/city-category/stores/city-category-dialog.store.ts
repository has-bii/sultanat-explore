import { createDialogStore } from "@/hooks/create-dialog-store"

export const useCityCategoryDialogStore = createDialogStore<{ id: string; name: string }>()