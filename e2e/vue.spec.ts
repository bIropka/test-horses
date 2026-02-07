import { test, expect } from '@playwright/test'

test('generate and run 6 rounds', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('btn-generate').click()
  await page.getByTestId('btn-start').click()

  await expect(page.getByTestId('result-round-6')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('[data-testid^="result-round-"]')).toHaveCount(6)
})
