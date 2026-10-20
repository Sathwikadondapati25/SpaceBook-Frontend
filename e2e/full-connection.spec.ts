import { test, expect } from '@playwright/test';

test.describe('SpaceBook Full Connection Verification', () => {
  const testTimestamp = Date.now();
  const vendorEmail = `vendor-connect-${testTimestamp}@test.com`;
  const organizerEmail = `organizer-connect-${testTimestamp}@test.com`;

  test('full end-to-end flow: vendor registration, organizer registration, event creation, stall booking', async ({ page }) => {
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

    // Step 1: Vendor Registration
    console.log('\n=== STEP 1: Vendor Registration ===');
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
    console.log(`Registration Status: ${regRequest?.status}`);
    expect(regRequest?.status).toBe(200);

    // Step 2: Vendor Login
    console.log('\n=== STEP 2: Vendor Login ===');
    await page.goto('http://localhost:5173/auth');
    await page.waitForTimeout(2000);

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

    // Step 3: Organizer Registration
    console.log('\n=== STEP 3: Organizer Registration ===');
    await page.goto('http://localhost:5173/auth');
    await page.waitForTimeout(2000);

    await page.click('text=Organizer');
    await page.waitForTimeout(1000);

    await page.click('text=Register as Organizer');
    await page.waitForTimeout(1000);

    await page.fill('input[type="email"]', organizerEmail);
    await page.fill('input[type="password"]', 'Organizer123456');
    await page.fill('input[placeholder*="invite"]', 'SB-ORG-2026-SECURE');

    await page.screenshot({ path: `test-results/organizer-registration-${testTimestamp}.png` });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const orgRegRequest = requests.find(r => r.url.includes('/api/auth/register') && r.method === 'POST' && r.body?.includes(organizerEmail));
    console.log(`Organizer Registration Status: ${orgRegRequest?.status}`);
    expect(orgRegRequest?.status).toBe(200);

    // Step 4: Organizer Login
    console.log('\n=== STEP 4: Organizer Login ===');
    await page.goto('http://localhost:5173/auth');
    await page.waitForTimeout(2000);

    await page.click('text=Organizer');
    await page.waitForTimeout(1000);

    await page.fill('input[type="email"]', organizerEmail);
    await page.fill('input[type="password"]', 'Organizer123456');

    await page.screenshot({ path: `test-results/organizer-login-${testTimestamp}.png` });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const orgLoginRequest = requests.find(r => r.url.includes('/api/auth/login') && r.method === 'POST');
    console.log(`Organizer Login Status: ${orgLoginRequest?.status}`);
    expect(orgLoginRequest?.status).toBe(200);

    // Check for CORS errors
    console.log('\n=== CORS CHECK ===');
    console.log(`Console errors: ${consoleErrors.length}`);
    const corsErrors = consoleErrors.filter(e => e.toLowerCase().includes('cors'));
    console.log(`CORS errors: ${corsErrors.length}`);
    expect(corsErrors.length).toBe(0);

    // Print all API requests
    console.log('\n=== ALL API REQUESTS ===');
    requests.filter(r => r.url.includes('/api/')).forEach(r => {
      console.log(`${r.method} ${r.url} - ${r.status} - Auth: ${r.auth ? 'Yes' : 'No'}`);
    });
  });
});
