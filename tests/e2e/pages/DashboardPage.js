import { expect } from '@playwright/test'
import { BasePage } from './BasePage.js'

export class DashboardPage extends BasePage {
  get root() {
    return this.page.getByTestId('dashboard-page')
  }

  get welcome() {
    return this.page.getByTestId('dashboard-welcome')
  }

  async expectVisible() {
    await expect(this.root).toBeVisible()
  }
}
