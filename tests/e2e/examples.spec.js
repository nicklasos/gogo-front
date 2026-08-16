import { test, expect } from '@playwright/test'
import { ExamplesPage } from './pages/ExamplesPage.js'
import { ExampleEditorPage } from './pages/ExampleEditorPage.js'

test.describe('Examples CRUD', () => {
  test('creates, edits, and deletes an example', async ({ page }) => {
    const list = new ExamplesPage(page)
    const editor = new ExampleEditorPage(page)
    const title = `E2E Example ${Date.now()}`

    await list.gotoList()
    await list.clickAdd()
    await editor.fillAndSave(title, 'desc')

    const row = page.locator('.ant-table-row', { hasText: title })
    await expect(row).toBeVisible()

    await row.locator(`[data-testid^="example-edit-button-"]`).click()
    await expect(page.getByTestId('example-editor-page')).toBeVisible()
    await editor.titleInput.fill(`${title} edited`)
    await editor.saveButton.click()
    await expect(page.getByTestId('examples-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(`${title} edited`)).toBeVisible()

    const editedRow = page.locator('.ant-table-row', { hasText: `${title} edited` })
    await editedRow.locator(`[data-testid^="example-delete-button-"]`).click()
    await page.locator('.ant-popconfirm-buttons .ant-btn-primary').click()
    await expect(page.getByText(`${title} edited`)).toHaveCount(0)
  })
})
