"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}

export function useDebouncedCallback<T>(
  callback: (value: T) => void,
  delay: number,
): (value: T) => void {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return useCallback(
    (value: T) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => callbackRef.current(value), delay)
    },
    [delay],
  )
}