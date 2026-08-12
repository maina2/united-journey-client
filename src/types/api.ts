export interface ApiResponse<T> {
  data: T
  message?: string
  status?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface ApiError {
  detail: string
  errors?: Record<string, string[]>
}

// Re-export all types from this file
export type { ApiResponse, PaginatedResponse, ApiError }
