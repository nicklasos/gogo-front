import { expect } from '@playwright/test'
import { BasePage } from './BasePage.js'

export class ExampleEditorPage extends BasePage {
  get root() {
    return this.page.getByTestId('example-editor-page')
  }

  get form() {
    return this.page.getByTestId('example-editor-form')
  }

  get titleInput() {
    return this.page.getByTestId('example-title-input')
  }

  get descriptionInput() {
    return this.page.getByTestId('example-description-input')
  }

  get saveButton() {
    return this.page.getByTestId('example-save-button')
  }

  get backButton() {
    return this.page.getByTestId('example-editor-back-button')
  }

  async fillAndSave(title, description = '') {
    await this.titleInput.fill(title)
    await this.descriptionInput.fill(description)
    await this.saveButton.click()
    await expect(this.page.getByTestId('examples-page')).toBeVisible({ timeout: 15000 })
  }
}
