const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000"

function withProtocol(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

export function getApiBaseUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL?.trim()

  if (!rawUrl) {
    return DEFAULT_API_BASE_URL
  }

  return withProtocol(rawUrl).replace(/\/+$/, "")
}

