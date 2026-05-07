const rawApiBase = import.meta.env.VITE_API_BASE_URL || ''

export const API_BASE_URL = rawApiBase.replace(/\/$/, '')

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}
