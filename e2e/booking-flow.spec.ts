import { test, expect } from '@playwright/test';

test.describe('SpaceBook Frontend-Backend Connection', () => {
  test('register vendor through real UI form', async ({ page, context }) => {
    // Track all network requests and responses
    const requests: { url: string; method: string; status: number; origin?: string; auth?: string }[] = [];
    page.on('request', request => {
      console.log(`Request: ${request.method()} ${request.url()}`);
    });
    page.on('response', response => {
      requests.push({
        url: response.url(),
        method: response.request().method(),
        status: response.status(),
        origin: response.request().headers()['origin'],
        auth: response.request().headers()['authorization'],
      });
    });

    // Track console messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });

    // Navigate to auth hub
    await page.goto('http://localhost:5173/auth');
    await page.waitForTimeout(2000);

    // Click vendor role
    await page.click('text=Exhibitor / Vendor');
    await page.waitForTimeout(2000);

    // Click Register button to switch to registration mode
    const registerButton = await page.$('text=Register as Exhibitor');
    if (registerButton) {
      await registerButton.click();
      await page.waitForTimeout(1000);
    }

    // Fill registration form with real UI interactions (using label-based selectors)
    await page.fill('input[type="email"]', 'vendor-ui-test@test.com');
    await page.fill('input[type="password"]', 'Vendor123456');
    await page.fill('input[placeholder*="Bangalore"]', 'UI Test Business');
    await page.fill('input[placeholder*="Rajesh"]', 'UI Test Vendor');
    await page.fill('input[type="tel"]', '9876543210');

    // Submit registration
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Find registration request
    const regRequest = requests.find(r => r.url.includes('/api/auth/register') && r.method === 'POST');
    console.log('\n=== REGISTRATION REQUEST ===');
    console.log(`URL: ${regRequest?.url}`);
    console.log(`Method: ${regRequest?.method}`);
    console.log(`Status: ${regRequest?.status}`);
    console.log(`Origin: ${regRequest?.origin}`);
    console.log(`Auth: ${regRequest?.auth}`);

    expect(regRequest?.status).toBe(200);

    // Check console for CORS errors
    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => console.log(msg));

    const corsErrors = consoleMessages.filter(msg => msg.toLowerCase().includes('cors'));
    console.log(`\nCORS Errors: ${corsErrors.length}`);
    expect(corsErrors.length).toBe(0);

    // Print all network requests
    console.log('\n=== ALL NETWORK REQUESTS ===');
    requests.forEach(r => {
      console.log(`${r.method} ${r.url} - ${r.status} - Origin: ${r.origin} - Auth: ${r.auth ? 'Yes' : 'No'}`);
    });
  });
});
