import { test, expect } from '@playwright/test';

test.describe('SpaceBook End-to-End Booking Flow', () => {
  test('verify frontend loads', async ({ page }) => {
    // Navigate to frontend
    await page.goto('http://localhost:5173');
    await page.screenshot({ path: 'screenshots/01-home.png' });
    await page.waitForTimeout(2000);

    // Check that the page loaded
    const title = await page.title();
    console.log('Page title:', title);
    expect(title).toBeTruthy();

    console.log('✅ Frontend loaded successfully');
  });
});
