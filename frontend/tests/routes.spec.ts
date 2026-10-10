import { expect, test } from '@playwright/test';

test('root route renders the standalone web app without Discord initialization', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');

  const app = page.locator('#root > main');
  await expect(app).toHaveAttribute('data-activity-status', 'standalone');
  await expect(app.getByRole('heading', { name: 'ExcaliMath' })).toBeVisible();
  await expect(app.getByRole('region', { name: 'Collaborative whiteboard' })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('/discord provides a helpful state when opened outside a Discord iframe', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/discord');

  const app = page.locator('#root > main');
  await expect(app).toHaveAttribute('data-activity-status', 'unavailable');
  await expect(app.getByText(/Open \/discord from a Discord Activity/)).toBeAttached();
  await expect(app.getByRole('region', { name: 'Collaborative whiteboard' })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('embedded launch at / hands off to /discord while preserving the shared app', async ({ page }) => {
  await page.goto('/');
  await page.setContent('<iframe title="Discord Activity" src="http://127.0.0.1:4178/"></iframe>');

  const activityFrame = page.frameLocator('iframe[title="Discord Activity"]');
  const app = activityFrame.locator('#root > main');
  await expect(app).toHaveAttribute('data-activity-status', 'unavailable');
  await expect(app.getByRole('region', { name: 'Collaborative whiteboard' })).toBeVisible();
  await expect.poll(() => page.frames().find((frame) => frame !== page.mainFrame())?.url()).toContain('/discord');
});

test('a drawing from one standalone client syncs to another client in the same room', async ({ browser }) => {
  const roomId = `e2e-room-${Date.now()}`;
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const firstPage = await context.newPage();
  const secondPage = await context.newPage();

  try {
    await Promise.all([
      firstPage.goto(`/?room=${roomId}`),
      secondPage.goto(`/?room=${roomId}`),
    ]);

    const firstBoard = firstPage.getByTestId('excalidraw-board');
    const secondBoard = secondPage.getByTestId('excalidraw-board');
    await expect(firstBoard).toHaveAttribute('data-sync-status', 'connected');
    await expect(secondBoard).toHaveAttribute('data-sync-status', 'connected');

    await firstPage.getByTestId('toolbar-freedraw').check({ force: true });
    const drawingSurface = firstBoard.locator('canvas').last();
    const bounds = await drawingSurface.boundingBox();
    expect(bounds).not.toBeNull();

    if (!bounds) {
      throw new Error('Excalidraw drawing surface is not visible.');
    }

    await firstPage.mouse.move(bounds.x + bounds.width * 0.35, bounds.y + bounds.height * 0.35);
    await firstPage.mouse.down();
    await firstPage.mouse.move(bounds.x + bounds.width * 0.55, bounds.y + bounds.height * 0.48, { steps: 8 });
    await firstPage.mouse.up();

    await expect(secondBoard).toHaveAttribute('data-remote-revision', /^[1-9]\d*$/, { timeout: 10_000 });
  } finally {
    await context.close();
  }
});
