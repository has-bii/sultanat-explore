import { createDialogStore } from "@/hooks/create-dialog-store"

export const useDeleteInclusionItemDialogStore = createDialogStore<{
  id: string
  label: string
}>()
