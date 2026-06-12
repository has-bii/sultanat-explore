/** Lightweight logger — single source of truth for console output in backend.
 *  Keep console.error for failures; no console.log in production. */
export const logger = {
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error("[backend]", ...args)
  },
}
