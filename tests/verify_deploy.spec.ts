import { test, expect } from '@playwright/test';

test('homepage has correct content', async ({ page }) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  await page.goto(baseUrl);

  // Check for the presence of 'Blog Generator'
  await expect(page.getByText('Blog Generator')).toBeVisible();

  // Check for the presence of 'Search '
  await expect(page.getByRole('button', { name: 'Search ' })).toBeVisible();

  // Check for the presence of 'Chat '
  await expect(page.getByRole('button', { name: 'Chat ' })).toBeVisible();
});
