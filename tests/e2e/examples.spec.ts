import { test, expect } from '@playwright/test'
import { ExampleEditorPage } from './pages/ExampleEditorPage'
import { ExamplesPage } from './pages/ExamplesPage'

test.describe('Examples CRUD', () => {
  test('creates, edits, and deletes an example', async ({ page }) => {
    const list = new ExamplesPage(page)
    const editor = new ExampleEditorPage(page)
    const title = `E2E Example ${Date.now()}`
    const edited = `${title} edited`

    await list.gotoList()
    await list.clickAdd()
    await editor.fillAndSave(title, 'desc')
    await expect(list.row(title)).toBeVisible()

    await list.edit(title)
    await expect(editor.titleInput).toHaveValue(title)
    await editor.titleInput.fill(edited)
    await editor.saveButton.click()
    await expect(list.root).toBeVisible({ timeout: 15000 })
    await expect(list.row(edited)).toBeVisible()

    await list.delete(edited)
  })

  test('shows a server validation error on the field it belongs to', async ({ page }) => {
    const list = new ExamplesPage(page)
    const editor = new ExampleEditorPage(page)

    await page.route('**/api/v1/examples', async (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'The given data was invalid.',
          error_key: 'validation.failed',
          errors: { title: ['validation.title.required'] },
        }),
      })
    })

    await list.gotoList()
    await list.clickAdd()
    await editor.titleInput.fill('Rejected by the server')
    await editor.saveButton.click()

    await expect(editor.titleInput).toHaveAttribute('aria-invalid', 'true')
    await expect(editor.descriptionInput).not.toHaveAttribute('aria-invalid', 'true')
    await expect(editor.root).toBeVisible()
  })
})
