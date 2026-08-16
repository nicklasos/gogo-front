import { test, expect } from '@playwright/test'
import dbHelper from './helpers/db-helper.js'
import { LoginPage } from './pages/LoginPage.js'
import { AppShell } from './pages/AppShell.js'

test.describe('Authentication', () => {
  let loginPage
  let appShell

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    appShell = new AppShell(page)
    await page.goto('/')
    await appShell.clearAuthStorage()
  })

  test.afterEach(async ({ page }) => {
    await page
      .evaluate(() => {
        localStorage.removeItem('gogo-auth')
      })
      .catch(() => {})
  })

  test('should display login form', async () => {
    await loginPage.goto()
    await expect(loginPage.form).toBeVisible()
    await expect(loginPage.emailInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.submitButton).toBeVisible()
  })

  test('should show validation errors for empty fields', async () => {
    await loginPage.goto()
    await loginPage.submitEmpty()
    await expect(loginPage.validationErrors.first()).toBeVisible({ timeout: 5000 })
    await expect(loginPage.validationErrors).toHaveCount(2)
  })

  test('should show error for invalid credentials', async () => {
    await loginPage.goto()
    await loginPage.loginExpectingError('invalid@example.com', 'wrongpassword')
    await expect(loginPage.errorAlert).toBeVisible({ timeout: 10000 })
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    const user = await dbHelper.createUser()
    await loginPage.login(user.email, user.password)
    await expect(appShell.mainContent).toBeVisible()
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })

  test('should persist login state after page refresh', async ({ page }) => {
    const user = await dbHelper.createUser()
    await loginPage.login(user.email, user.password)
    await page.reload()
    await expect(appShell.mainContent).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })

  test('should show login when accessing routes without authentication', async ({ page }) => {
    await page.goto('/examples')
    await expect(loginPage.emailInput).toBeVisible()
  })

  test('should logout successfully', async () => {
    const user = await dbHelper.createUser()
    await loginPage.login(user.email, user.password)
    await appShell.logoutViaUI()
    await expect(loginPage.form).toBeVisible()
  })

  test('should prevent access after logout', async ({ page }) => {
    const user = await dbHelper.createUser()
    await loginPage.login(user.email, user.password)
    await appShell.logoutViaUI()
    await page.goto('/examples')
    await expect(loginPage.emailInput).toBeVisible()
  })
})
