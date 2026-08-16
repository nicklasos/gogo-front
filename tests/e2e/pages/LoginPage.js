import { expect } from '@playwright/test'

export class LoginPage {
  constructor(page) {
    this.page = page
  }

  get form() {
    return this.page.getByTestId('login-form')
  }

  get emailInput() {
    return this.page.getByTestId('login-email-input')
  }

  get passwordInput() {
    return this.page.getByTestId('login-password-input')
  }

  get submitButton() {
    return this.page.getByTestId('login-button')
  }

  get errorAlert() {
    return this.page.getByTestId('login-error-alert')
  }

  get validationErrors() {
    return this.page.locator('.ant-form-item-explain-error')
  }

  async goto() {
    await this.page.goto('/')
  }

  async login(email, password) {
    await this.goto()
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
    await expect(this.page.getByTestId('main-content')).toBeVisible({ timeout: 15000 })
    await expect(this.page).toHaveURL('/')
  }

  async submitEmpty() {
    await this.submitButton.click()
  }

  async loginExpectingError(email, password) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}
