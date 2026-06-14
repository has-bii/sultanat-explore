import { TableSkeleton } from "@/components/table-skeleton"

export function ArticleTableSkeleton() {
  return <TableSkeleton rowCount={5} columns={5} />
}
