import { expect } from '@playwright/test'
import { BasePage } from './BasePage.js'

export class AppShell extends BasePage {
  get userMenuTrigger() {
    return this.page.getByTestId('user-menu-button')
  }

  get userMenuLogout() {
    return this.page.getByTestId('user-menu-logout')
  }

  async logoutViaUI() {
    await this.userMenuTrigger.click()
    await this.userMenuLogout.click()
    await expect(this.loginEmailInput).toBeVisible({ timeout: 10000 })
  }

  async clearAuthStorage() {
    await this.page.evaluate(() => {
      localStorage.removeItem('gogo-auth')
    })
  }

  async clearAuthAndGoToLogin() {
    await this.clearAuthStorage()
    await this.page.goto('/')
    await expect(this.loginEmailInput).toBeVisible({ timeout: 10000 })
  }
}
