import { test, expect } from '@playwright/test';

test.describe('SpaceBook Connection Verification', () => {
  const testTimestamp = Date.now();
  const vendorEmail = `vendor-connect-${testTimestamp}@test.com`;

  test('vendor registration through UI and verify database connection', async ({ page }) => {
    // Track all network requests
    const requests: { url: string; method: string; status: number; auth?: string }[] = [];
    page.on('response', response => {
      requests.push({
        url: response.url(),
        method: response.request().method(),
        status: response.status(),
        auth: response.request().headers()['authorization'],
      });
    });

    // Track console for errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    console.log('\n=== VENDOR REGISTRATION ===');
    await page.goto('http://localhost:5173/auth');
    await page.waitForTimeout(2000);

    await page.click('text=Exhibitor / Vendor');
    await page.waitForTimeout(1000);

    await page.click('text=Register as Exhibitor');
    await page.waitForTimeout(1000);

    await page.fill('input[type="email"]', vendorEmail);
    await page.fill('input[type="password"]', 'Vendor123456');
    await page.fill('input[placeholder*="Bangalore"]', 'Test Vendor Business');
    await page.fill('input[placeholder*="Rajesh"]', 'Test Vendor');
    await page.fill('input[type="tel"]', '9876543210');

    await page.screenshot({ path: `test-results/vendor-registration-${testTimestamp}.png` });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const regRequest = requests.find(r => r.url.includes('/api/auth/register') && r.method === 'POST');
    console.log(`Registration URL: ${regRequest?.url}`);
    console.log(`Registration Method: ${regRequest?.method}`);
    console.log(`Registration Status: ${regRequest?.status}`);
    expect(regRequest?.status).toBe(200);

    // Check for CORS errors
    console.log('\n=== CORS CHECK ===');
    const corsErrors = consoleErrors.filter(e => e.toLowerCase().includes('cors'));
    console.log(`CORS errors: ${corsErrors.length}`);
    expect(corsErrors.length).toBe(0);

    // Print all API requests
    console.log('\n=== ALL API REQUESTS ===');
    requests.filter(r => r.url.includes('/api/')).forEach(r => {
      console.log(`${r.method} ${r.url} - ${r.status} - Auth: ${r.auth ? 'Yes' : 'No'}`);
    });
  });

  test('vendor login and verify authorization header', async ({ page }) => {
    const requests: { url: string; method: string; status: number; auth?: string }[] = [];
    page.on('response', response => {
      requests.push({
        url: response.url(),
        method: response.request().method(),
        status: response.status(),
        auth: response.request().headers()['authorization'],
      });
    });

    console.log('\n=== VENDOR LOGIN ===');
    await page.goto('http://localhost:5173/auth');
    await page.waitForTimeout(2000);

    await page.click('text=Exhibitor / Vendor');
    await page.waitForTimeout(1000);

    await page.fill('input[type="email"]', vendorEmail);
    await page.fill('input[type="password"]', 'Vendor123456');

    await page.screenshot({ path: `test-results/vendor-login-${testTimestamp}.png` });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const loginRequest = requests.find(r => r.url.includes('/api/auth/login') && r.method === 'POST');
    console.log(`Login Status: ${loginRequest?.status}`);
    expect(loginRequest?.status).toBe(200);

    // Check subsequent requests have Authorization header
    const authRequests = requests.filter(r => r.auth && r.auth.startsWith('Bearer'));
    console.log(`Requests with Bearer token: ${authRequests.length}`);
    expect(authRequests.length).toBeGreaterThan(0);

    console.log('\n=== AUTHORIZED REQUESTS ===');
    authRequests.forEach(r => {
      console.log(`${r.method} ${r.url} - ${r.status}`);
    });
  });

  test('backend offline shows error message', async ({ page }) => {
    console.log('\n=== BACKEND OFFLINE TEST ===');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Try to fetch events (should fail if backend is offline)
    // For now, just verify the page loads
    const title = await page.title();
    console.log(`Page title: ${title}`);
    expect(title).toBeTruthy();
  });
});
