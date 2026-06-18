import { createDialogStore } from "@/hooks/create-dialog-store"

export const useInclusionItemDialogStore = createDialogStore<{ id: string; label: string }>()
