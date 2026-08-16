import { useAuthStore } from '../stores/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.refreshPromise = null
  }

  async request(url, options = {}) {
    const { getAuthHeaders } = useAuthStore.getState()

    const headers = {
      ...getAuthHeaders(),
      ...options.headers,
    }

    if (options.body instanceof FormData) {
      delete headers['Content-Type']
    }

    const fullUrl = `${this.baseURL}${url}`

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      })

      if (response.status === 401 && !url.includes('/auth/refresh')) {
        const refreshResult = await this.handleTokenRefresh()

        if (refreshResult.success) {
          const newHeaders = {
            ...useAuthStore.getState().getAuthHeaders(),
            ...options.headers,
          }
          if (options.body instanceof FormData) {
            delete newHeaders['Content-Type']
          }

          return fetch(fullUrl, {
            ...options,
            headers: newHeaders,
          })
        }
      }

      return response
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('API request failed:', error)
      }
      throw error
    }
  }

  async handleTokenRefresh() {
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = useAuthStore.getState().refreshAccessToken()
    const result = await this.refreshPromise
    this.refreshPromise = null

    return result
  }

  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' })
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
  }

  async put(url, data, options = {}) {
    const requestOptions = {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }
    if (data !== undefined) {
      requestOptions.body = JSON.stringify(data)
    }
    return this.request(url, requestOptions)
  }

  async patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
export default apiClient
