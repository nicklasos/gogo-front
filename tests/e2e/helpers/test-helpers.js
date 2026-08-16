import { expect } from '@playwright/test'
import dbHelper from './db-helper.js'

const TEST_BACKEND_PORT = process.env.TEST_BACKEND_PORT || '8183'
const DEFAULT_API_BASE =
  process.env.VITE_E2E_API_BASE_URL || `http://localhost:${TEST_BACKEND_PORT}/api/v1`

export class AuthHelper {
  constructor(page) {
    this.page = page
    this.baseURL = DEFAULT_API_BASE
  }

  async createTestUser(userData = {}) {
    return dbHelper.createUser(userData)
  }

  async loginViaAPI(email, password) {
    const response = await this.page.request.post(`${this.baseURL}/auth/login`, {
      data: { email, password },
    })

    if (!response.ok()) {
      const body = await response.text()
      throw new Error(`Login failed: ${response.status()} ${body}`)
    }

    const body = await response.json()
    const data = body.data ?? body

    await this.page.addInitScript((payload) => {
      localStorage.setItem(
        'gogo-auth',
        JSON.stringify({
          state: {
            token: payload.access_token,
            refreshToken: payload.refresh_token,
            user: payload.user,
            isAuthenticated: true,
          },
          version: 0,
        })
      )
    }, data)

    return data
  }

  async logout() {
    await this.page.evaluate(() => {
      localStorage.removeItem('gogo-auth')
    })
    await this.page.goto('/')
    await expect(this.page.getByTestId('login-email-input')).toBeVisible({ timeout: 10000 })
  }
}

export { dbHelper }
