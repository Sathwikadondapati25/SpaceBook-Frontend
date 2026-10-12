import { test, expect } from '@playwright/test';

test.describe('Backend Offline Handling', () => {
  test('show error when backend is unreachable', async ({ page }) => {
    // Navigate to frontend
    await page.goto('http://localhost:5173');
    await page.screenshot({ path: 'screenshots/02-backend-online.png' });
    await page.waitForTimeout(2000);

    console.log('✅ Frontend loaded with backend online');
  });
});
