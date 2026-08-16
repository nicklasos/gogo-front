import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function apiErrorPayload(data) {
  return {
    type: 'api',
    errorKey: typeof data?.error_key === 'string' ? data.error_key : '',
    message: typeof data?.message === 'string' ? data.message : '',
  }
}

function unwrapAuthPayload(body) {
  const data = body?.data ?? body ?? {}
  return {
    user: data.user ?? null,
    accessToken: data.access_token ?? data.token ?? null,
    refreshToken: data.refresh_token ?? null,
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          let body = {}
          try {
            body = await response.json()
          } catch {
            body = {}
          }

          if (!response.ok) {
            const err = apiErrorPayload(body)
            set({
              loading: false,
              error: err,
              isAuthenticated: false,
              user: null,
              token: null,
              refreshToken: null,
            })
            return { success: false, error: err }
          }

          const { user, accessToken, refreshToken } = unwrapAuthPayload(body)
          set({
            user,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            loading: false,
            error: null,
          })

          return { success: true }
        } catch (error) {
          set({
            loading: false,
            error: { type: 'raw', message: error.message },
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
          })
          return { success: false, error: { type: 'raw', message: error.message } }
        }
      },

      logout: async () => {
        const { token } = get()
        if (token) {
          try {
            await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
            })
          } catch {
            // ignore network errors on logout
          }
        }
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        })
      },

      me: async () => {
        const { token } = get()
        if (!token) return { success: false, error: 'No token' }

        set({ loading: true })

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (response.status === 401 || response.status === 403) {
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            })
            return { success: false, error: 'Session expired', unauthorized: true }
          }

          if (!response.ok) {
            set({ loading: false })
            return { success: false, error: 'Failed to get user info' }
          }

          const body = await response.json()
          const user = body?.data ?? body

          set({
            user,
            loading: false,
            isAuthenticated: true,
          })

          return { success: true, user }
        } catch (error) {
          set({
            loading: false,
            error: { type: 'raw', message: error.message },
          })
          return { success: false, error: error.message }
        }
      },

      getAuthHeaders: () => {
        const { token } = get()
        return token
          ? {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          : {
              'Content-Type': 'application/json',
            }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) return { success: false, error: 'No refresh token' }

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          })

          if (!response.ok) {
            throw new Error('Failed to refresh token')
          }

          const body = await response.json()
          const { accessToken, refreshToken: nextRefresh } = unwrapAuthPayload(body)

          set({
            token: accessToken,
            refreshToken: nextRefresh || refreshToken,
            error: null,
          })

          return { success: true, token: accessToken }
        } catch (error) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: { type: 'raw', message: error.message },
          })
          return { success: false, error: error.message }
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'gogo-auth',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
