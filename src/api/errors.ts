export type FieldErrors = Record<string, string[]>

export class ApiError extends Error {
  readonly status: number
  readonly errorKey: string
  readonly fieldErrors?: FieldErrors

  constructor(status: number, errorKey: string, message: string, fieldErrors?: FieldErrors) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errorKey = errorKey
    this.fieldErrors = fieldErrors
  }

  static fromBody(status: number, body: unknown): ApiError {
    const data = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
    const errorKey = typeof data.error_key === 'string' ? data.error_key : ''
    const message = typeof data.message === 'string' ? data.message : ''
    const fieldErrors = isFieldErrors(data.errors) ? data.errors : undefined
    return new ApiError(status, errorKey, message, fieldErrors)
  }
}

function isFieldErrors(value: unknown): value is FieldErrors {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return Object.values(value).every((list) => Array.isArray(list))
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
