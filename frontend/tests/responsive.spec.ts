import { expect, test } from '@playwright/test';

test('app shell fits the viewport without toolbar/canvas overlap', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/iframe.html?id=excalimath-app--default', {
    waitUntil: 'domcontentloaded',
  });

  const app = page.locator('#storybook-root main');
  const toolbar = app.locator('aside').filter({ hasText: 'Tools' });
  const canvas = app.getByRole('region', { name: 'Collaborative whiteboard' });
  const excalidrawBoard = app.getByTestId('excalidraw-board');
  const themeButton = app.getByRole('button', { name: /Choose a random .* theme/ });
  const modeButton = app.getByRole('button', { name: /Switch to night dark mode/ });

  await expect(app).toBeVisible({ timeout: 15_000 });
  await expect(toolbar).toBeVisible();
  await expect(canvas).toBeVisible();
  await expect(excalidrawBoard).toBeVisible();
  await expect(excalidrawBoard.getByTestId('main-menu-trigger')).toHaveAccessibleName('Open Excalidraw menu');
  await expect(themeButton).toBeVisible();

  expect(await app.getAttribute('data-theme-mode')).toBe('day');
  await themeButton.click();
  await expect(app).toHaveAttribute('data-theme-mode', 'day');
  await expect(app).toHaveAttribute('data-theme', /^day-/);

  await modeButton.click();
  await expect(app).toHaveAttribute('data-theme-mode', 'night');
  await expect(app).toHaveAttribute('data-theme', /^night-/);

  await app.getByRole('button', { name: /Choose a random .* theme/ }).click();
  await expect(app).toHaveAttribute('data-theme-mode', 'night');
  await expect(app).toHaveAttribute('data-theme', /^night-/);

  await app.getByRole('button', { name: /Switch to day light mode/ }).click();
  await expect(app).toHaveAttribute('data-theme-mode', 'day');
  await expect(app).toHaveAttribute('data-theme', /^day-/);

  const viewport = page.viewportSize();
  const documentSize = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    clientWidth: document.documentElement.clientWidth,
    clientHeight: document.documentElement.clientHeight,
  }));
  const toolbarBox = await toolbar.boundingBox();
  const canvasBox = await canvas.boundingBox();

  expect(viewport).not.toBeNull();
  expect(toolbarBox).not.toBeNull();
  expect(canvasBox).not.toBeNull();
  expect(documentSize.width).toBeLessThanOrEqual(documentSize.clientWidth + 1);
  expect(documentSize.height).toBeLessThanOrEqual(documentSize.clientHeight + 1);
  expect(pageErrors).toEqual([]);

  if (viewport && toolbarBox && canvasBox) {
    const overlap = !(
      toolbarBox.x + toolbarBox.width <= canvasBox.x ||
      canvasBox.x + canvasBox.width <= toolbarBox.x ||
      toolbarBox.y + toolbarBox.height <= canvasBox.y ||
      canvasBox.y + canvasBox.height <= toolbarBox.y
    );

    expect(overlap).toBeFalsy();
    expect(canvasBox.width).toBeGreaterThan(viewport.width >= 320 ? 79 : 0);
    expect(canvasBox.x + canvasBox.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(canvasBox.y + canvasBox.height).toBeLessThanOrEqual(viewport.height + 1);
  }
});
