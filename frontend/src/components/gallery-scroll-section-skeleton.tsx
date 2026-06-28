import { motion } from "motion/react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ColumnSkeletonProps {
  className?: string
  comparator?: 0 | 1
  duration?: number
}

function ColumnSkeleton({ className, duration, comparator = 1 }: ColumnSkeletonProps) {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-1 flex-col gap-6 pb-6"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("w-full border", i % 2 === comparator ? "aspect-4/3" : "aspect-10/16")}
          />
        ))}
      </motion.div>
    </div>
  )
}

export function GalleryScrollSectionSkeleton() {
  return (
    <div className="mt-10 flex max-h-185 w-full justify-center gap-6 overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
      <ColumnSkeleton comparator={0} duration={15} className="flex-1" />
      <ColumnSkeleton comparator={1} duration={19} className="hidden flex-1 md:block" />
      <ColumnSkeleton comparator={0} duration={17} className="hidden flex-1 lg:block" />
    </div>
  )
}
