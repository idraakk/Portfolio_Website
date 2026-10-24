import { test, expect } from '@playwright/test';

test('portfolio navigation, links, themes, and closing tabs', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect(page).toHaveTitle('Idraak Mohd Khan - Software Engineer');
  await expect(page.locator('#file-about')).toContainText('Idraak Mohd Khan');
  for (const name of ['experience.json', 'education.yml', 'skills.ts', 'projects.tsx', 'contact.sh']) {
    await page.getByRole('tab', { name: new RegExp(name) }).click();
    await expect(page.getByRole('tab', { name: new RegExp(name) })).toHaveAttribute('aria-selected', 'true');
  }
  await expect(page.locator('#file-contact a[href="https://www.linkedin.com/in/idraak"]')).toBeVisible();
  await expect(page.locator('#file-contact')).not.toContainText('CALENDAR');
  await page.keyboard.press('Control+k');
  await page.getByPlaceholder('Type a command, file, or theme…').fill('GitHub Light');
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'github');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'github');
  for (const name of ['about.md','experience.json','education.yml','skills.ts','projects.tsx','contact.sh']) {
    await page.getByRole('button', { name: `Close ${name}`, exact: true }).click();
  }
  await expect(page.getByText('No files open.')).toBeVisible();
  await page.getByRole('button', { name: 'Reopen portfolio files' }).click();
  await expect(page.locator('#file-about')).toBeVisible();
  const resume = await request.get('resume.pdf');
  expect(resume.status()).toBe(200);
  expect((await resume.body()).subarray(0, 5).toString()).toBe('%PDF-');
  const sitemap = await request.get('sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('<loc>https://idraakk.github.io/Portfolio_Website/</loc>');
  await expect(page.locator('a[download]')).toHaveAttribute('href', '/Portfolio_Website/resume.pdf');
  const favicon = await request.get('favicon.svg');
  expect(favicon.status()).toBe(200);
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('mobile explorer and content fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Show terminal' })).toBeVisible();
  await page.getByTitle('Explorer', { exact: false }).click();
  await page.getByRole('button', { name: 'experience.json', exact: false }).first().click();
  await page.getByTitle('Explorer', { exact: false }).click();
  await expect(page.locator('#file-experience')).toContainText('Amazon');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});
