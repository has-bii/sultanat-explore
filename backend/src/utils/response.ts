export function successResponse<T>(data: T, message = "Success") {
  return { success: true as const, data, message }
}

export function errorResponse(message: string, error?: unknown, data: null = null) {
  return { success: false as const, data, message, error: error ?? message }
}
