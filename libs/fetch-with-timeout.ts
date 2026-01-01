/**
 * A wrapper around fetch that supports timeouts.
 * Standard timeout is 5-10s as per Satus Project Guidelines.
 */
export async function fetchWithTimeout(
  resource: string | URL | Request,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: controller.signal,
    })
    return response
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`[fetchWithTimeout] Request timed out after ${timeout}ms`)
    }
    throw error
  } finally {
    clearTimeout(id)
  }
}
