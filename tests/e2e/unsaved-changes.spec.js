import { test, expect } from '@playwright/test'
import { ExamplesPage } from './pages/ExamplesPage.js'

test.describe('Unsaved changes', () => {
  test('prompts when leaving dirty editor', async ({ page }) => {
    const list = new ExamplesPage(page)
    await list.gotoList()
    await list.clickAdd()

    await page.getByTestId('example-title-input').fill('Dirty draft')
    await page.getByTestId('example-editor-back-button').click()

    const dialog = page.locator('.ant-modal-confirm').filter({ hasText: /unsaved changes|незбережені зміни/i })
    await expect(dialog).toBeVisible({ timeout: 5000 })
    await dialog.getByRole('button', { name: /leave|вийти/i }).click()
    await expect(page.getByTestId('examples-page')).toBeVisible({ timeout: 10000 })
  })
})
