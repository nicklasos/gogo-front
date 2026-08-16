import { expect } from '@playwright/test'
import { BasePage } from './BasePage.js'

export class ExamplesPage extends BasePage {
  get root() {
    return this.page.getByTestId('examples-page')
  }

  get table() {
    return this.page.getByTestId('examples-table')
  }

  get addButton() {
    return this.page.getByTestId('examples-add-button')
  }

  async gotoList() {
    await this.goto('/examples')
    await expect(this.root).toBeVisible()
  }

  async clickAdd() {
    await this.addButton.click()
    await expect(this.page.getByTestId('example-editor-page')).toBeVisible()
  }
}
