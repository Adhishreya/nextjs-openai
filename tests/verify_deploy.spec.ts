import { test, expect } from '@playwright/test';

test('homepage has core UI elements', async ({ page }) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  await page.goto(baseUrl);

  // Check for the presence of the buttons
  await expect(page.getByRole('button', { name: 'Blog Generator' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search ' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Chat ' })).toBeVisible();
});
