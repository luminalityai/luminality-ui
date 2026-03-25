export function parseJsonError(error: unknown): string {
  if (error instanceof SyntaxError) {
    return error.message
  }

  return "Invalid JSON"
}

export function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}
