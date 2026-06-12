export interface CursorArgs {
  cursor?: string
  limit: number
}

/** Returns prisma findMany args fragment for cursor pagination (fetches limit+1). */
export function cursorArgs({ cursor, limit }: CursorArgs) {
  return {
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  }
}

/** Splits an over-fetched (limit+1) row array into page data + nextCursor. */
export function toPage<T extends { id: string }>(rows: T[], limit: number) {
  const data = rows.slice(0, limit)
  const nextCursor = rows.length > limit ? data[data.length - 1].id : null
  return { data, nextCursor }
}
