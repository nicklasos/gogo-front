import { expect } from '@playwright/test'

export class BasePage {
  constructor(page) {
    this.page = page
  }

  get mainContent() {
    return this.page.getByTestId('main-content')
  }

  get loginEmailInput() {
    return this.page.getByTestId('login-email-input')
  }

  async goto(path) {
    await this.page.goto(path)
    await this.page.waitForLoadState('domcontentloaded')
    await this.expectLoaded()
  }

  async expectLoaded() {
    await expect(this.mainContent).toBeVisible({ timeout: 15000 })
  }
}
