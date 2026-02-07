import { test, expect, Page } from '@playwright/test'

function btn(page: Page, id: string) {
  return page.locator(`[data-testid="${id}"]`)
}

async function expectEnabled(page: Page, id: string) {
  await expect(btn(page, id)).toBeEnabled()
}

async function expectDisabled(page: Page, id: string) {
  await expect(btn(page, id)).toBeDisabled()
}

async function click(page: Page, id: string) {
  await btn(page, id).click()
}

async function waitForAtLeastOneToken(page: Page) {
  const token = page.locator('.race-track-progress__token').first()
  await expect(token).toBeVisible()
  return token
}

async function getTokenLeftPercent(page: Page) {
  const token = await waitForAtLeastOneToken(page)
  const style = (await token.getAttribute('style')) ?? ''
  const m = /left:\s*([0-9.]+)%/i.exec(style)
  if (!m) throw new Error(`Cannot parse token left from style: ${style}`)
  return Number(m[1])
}

async function waitForTokenToMove(
  page: Page,
  from: number,
  direction: 'increase' | 'decrease' = 'increase',
) {
  const epsilon = 0.05 // small buffer to reduce flakiness

  if (direction === 'increase') {
    await expect
      .poll(async () => await getTokenLeftPercent(page), { timeout: 5000 })
      .toBeGreaterThan(from + epsilon)
  } else {
    await expect
      .poll(async () => await getTokenLeftPercent(page), { timeout: 5000 })
      .toBeLessThan(from - epsilon)
  }
}

async function startRace(page: Page) {
  await click(page, 'btn-generate')
  await expectEnabled(page, 'btn-start')
  await click(page, 'btn-start')
  await expectEnabled(page, 'btn-pause')
}

test.describe('race flows (E2E)', () => {
  test('button state transitions through idle -> ready -> running -> paused -> running', async ({
    page,
  }) => {
    await page.goto('/')

    await expectEnabled(page, 'btn-generate')
    await expectDisabled(page, 'btn-start')
    await expectDisabled(page, 'btn-pause')
    await expectDisabled(page, 'btn-resume')
    await expectDisabled(page, 'btn-reset')

    await click(page, 'btn-generate')
    await expectDisabled(page, 'btn-generate')
    await expectEnabled(page, 'btn-start')
    await expectDisabled(page, 'btn-pause')
    await expectDisabled(page, 'btn-resume')
    await expectEnabled(page, 'btn-reset')

    await click(page, 'btn-start')
    await expectDisabled(page, 'btn-start')
    await expectEnabled(page, 'btn-pause')
    await expectDisabled(page, 'btn-resume')
    await expectDisabled(page, 'btn-reset')

    await click(page, 'btn-pause')
    await expectDisabled(page, 'btn-pause')
    await expectEnabled(page, 'btn-resume')
    await expectEnabled(page, 'btn-reset')

    await click(page, 'btn-resume')
    await expectEnabled(page, 'btn-pause')
    await expectDisabled(page, 'btn-resume')
  })

  test('pause/resume stops and continues track progress', async ({ page }) => {
    await page.goto('/')
    await startRace(page)

    // Wait until token starts moving
    const p1 = await getTokenLeftPercent(page)
    await waitForTokenToMove(page, p1, 'increase')
    const p2 = await getTokenLeftPercent(page)
    expect(p2).toBeGreaterThan(p1)

    // Pause and ensure progress "freezes"
    await click(page, 'btn-pause')
    await expectEnabled(page, 'btn-resume')

    const paused1 = await getTokenLeftPercent(page)
    await page.waitForTimeout(250)
    const paused2 = await getTokenLeftPercent(page)

    // Allow tiny jitter (should be stable though)
    expect(Math.abs(paused2 - paused1)).toBeLessThan(0.01)

    // Resume and ensure progress continues
    await click(page, 'btn-resume')
    await waitForTokenToMove(page, paused2, 'increase')
  })

  test('reset mid-race clears state and stops the run (stale guard)', async ({ page }) => {
    await page.goto('/')
    await startRace(page)

    const p1 = await getTokenLeftPercent(page)
    await waitForTokenToMove(page, p1, 'increase')

    await click(page, 'btn-reset')

    await expectEnabled(page, 'btn-generate')
    await expectDisabled(page, 'btn-start')
    await expectDisabled(page, 'btn-pause')
    await expectDisabled(page, 'btn-resume')
    await expectDisabled(page, 'btn-reset')

    await expect(page.locator('text=No results yet')).toBeVisible()

    await expect(page.locator('[data-testid^="result-round-"]')).toHaveCount(0)
  })

  test('happy path + results appear for all rounds', async ({ page }) => {
    await page.goto('/')
    await startRace(page)

    await expect(page.locator('[data-testid="result-round-5"]')).toBeVisible({ timeout: 15000 })

    await expectDisabled(page, 'btn-pause')
    await expectDisabled(page, 'btn-resume')
    await expectEnabled(page, 'btn-reset')
  })
})
