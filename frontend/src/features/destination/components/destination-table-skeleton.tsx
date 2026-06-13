import { TableSkeleton } from "@/components/table-skeleton"

export function DestinationTableSkeleton() {
  return <TableSkeleton rowCount={5} columns={6} />
}