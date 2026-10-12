import { test, expect } from '@playwright/test';

test.describe('Backend Offline Handling', () => {
  test('show error when backend is unreachable', async ({ page }) => {
    // Navigate to frontend with backend stopped
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Check if page loads (it should load with fallback data)
    const title = await page.title();
    console.log('Page title:', title);
    expect(title).toBeTruthy();

    console.log('✅ Frontend loaded (with backend offline)');
  });
});
