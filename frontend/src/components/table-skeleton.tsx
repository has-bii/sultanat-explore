import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TableSkeletonProps {
  rowCount?: number
  columns?: number
}

export function TableSkeleton({ rowCount = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i} className={i === 0 ? "pl-4" : undefined}>
                <Skeleton className="h-6 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} className={colIndex === 0 ? "pl-4" : undefined}>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
