export type ID = number

export interface Timestamps {
  created_at: string
  updated_at: string
}

export interface MessageResponse {
  message: string
}

export interface PaginationMeta {
  total: number
  current_page: number
  last_page: number
  per_page: number
}

/** A paginated list response: `api.getPage` keeps `pagination`, which `api.get` drops. */
export interface Page<T> {
  data: T[]
  pagination: PaginationMeta
}

export type PageParams = {
  page: number
  page_size: number
}
