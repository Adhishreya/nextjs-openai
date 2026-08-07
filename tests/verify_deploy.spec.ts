import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('homepage should load and show core buttons', async ({ page }) => {
  await page.goto(BASE_URL);

  // Check for the "Blog Generator" button
  await expect(page.getByRole('button', { name: 'Blog Generator' })).toBeVisible();

  // Check for the "Search " button (noting the trailing space from src/app/page.tsx)
  await expect(page.getByRole('button', { name: 'Search ' })).toBeVisible();

  // Check for the "Chat " button (noting the trailing space from src/app/page.tsx)
  await expect(page.getByRole('button', { name: 'Chat ' })).toBeVisible();
});
