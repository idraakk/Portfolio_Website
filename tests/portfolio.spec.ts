import { test, expect } from '@playwright/test';

test('browser appearance does not recolor the editor or preview', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const editor = page.getByRole('region', { name: 'Code editor' });
  const preview = page.locator('.folio-hero');
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'only light');
  await expect(page.locator('html')).toHaveCSS('color-scheme', /^(light only|only light)$/);
  await expect(preview).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const editorBounds = (await editor.boundingBox())!;
  const previewBounds = (await preview.boundingBox())!;
  const clip = {
    x: editorBounds.x,
    y: previewBounds.y,
    width: previewBounds.x + previewBounds.width - editorBounds.x - 16,
    height: 180,
  };

  await page.emulateMedia({ colorScheme: 'light', forcedColors: 'none' });
  const palette = await page.screenshot({ clip });
  await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'none' });
  const rendering = await page.context().newCDPSession(page);
  await rendering.send('Emulation.setAutoDarkModeOverride', { enabled: true });

  await expect.poll(async () => (await page.screenshot({ clip })).equals(palette)).toBe(true);

  await rendering.send('Emulation.setAutoDarkModeOverride', { enabled: false });
  await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
  await expect.poll(async () => (await page.screenshot({ clip })).equals(palette)).toBe(true);
});

test('portfolio navigation, links, themes, and closing tabs', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect(page).toHaveTitle('Idraak Mohd Khan - Software Engineer');
  const preview = page.getByRole('region', { name: 'Portfolio preview' });
  const editor = page.getByRole('region', { name: 'Code editor' });
  await expect(preview.getByRole('heading', { level: 1, name: 'Idraak Mohd Khan' })).toBeVisible();
  await expect(preview).toHaveCSS('animation-name', 'portfolio-panel-enter');
  const hero = preview.locator('.folio-hero');
  await expect(hero.getByRole('heading', { level: 1 })).toHaveCSS('animation-delay', '0.145s');
  await expect(hero.locator('.folio-tagline')).toHaveCSS('animation-delay', '0.225s');
  const outboundLinks = await preview.locator('a:not([href^="#"], .folio-product-actions a)').evaluateAll((anchors) =>
    anchors.map((anchor) => ({ target: anchor.getAttribute('target'), rel: anchor.getAttribute('rel') })),
  );
  expect(outboundLinks.length).toBeGreaterThan(0);
  expect(outboundLinks.every(({ target, rel }) => target === '_blank' && rel?.includes('noopener'))).toBe(true);
  await expect(preview.getByRole('heading', { level: 2 }).allTextContents()).resolves.toEqual([
    'Experience', 'Projects', 'Live Products', 'Skills', 'Education', 'Contact',
  ]);
  await expect(preview.getByText('Running', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  const editorBox = await editor.boundingBox();
  const previewBox = await preview.boundingBox();
  expect(editorBox!.x + editorBox!.width).toBeLessThanOrEqual(previewBox!.x);
  expect(editorBox!.width).toBeCloseTo((await page.locator('.portfolio-workspace').boundingBox())!.width * 0.36, 0);
  const terminalHandle = editor.getByRole('separator', { name: 'Resize terminal' });
  await expect(terminalHandle).toHaveCSS('cursor', 'row-resize');
  await expect(terminalHandle).toHaveAttribute('aria-valuenow', '224');
  await terminalHandle.press('ArrowUp');
  await expect(terminalHandle).toHaveAttribute('aria-valuenow', '240');
  await terminalHandle.dblclick();
  await expect(terminalHandle).toHaveAttribute('aria-valuenow', '224');
  const previewDivider = page.getByRole('separator', { name: 'Resize editor and preview' });
  const dividerBox = (await previewDivider.boundingBox())!;
  const dividerX = dividerBox.x + dividerBox.width / 2;
  const dividerY = dividerBox.y + dividerBox.height / 2;
  await page.mouse.move(dividerX, dividerY);
  await expect(previewDivider).toHaveCSS('cursor', 'col-resize');
  await page.mouse.down();
  await page.mouse.move(dividerX - 90, dividerY, { steps: 5 });
  expect((await editor.boundingBox())!.width).toBeLessThan(editorBox!.width);
  await page.mouse.move(dividerX + 60, dividerY, { steps: 5 });
  await page.mouse.up();
  expect((await editor.boundingBox())!.width).toBeGreaterThan(editorBox!.width);
  await previewDivider.dblclick();
  await expect(previewDivider).toHaveAttribute('aria-valuenow', '36');

  const explorer = page.locator('#portfolio-file-explorer');
  const explorerDivider = page.getByRole('separator', { name: 'Resize file explorer' });
  expect((await explorer.boundingBox())!.width).toBe(184);
  await explorerDivider.press('ArrowRight');
  expect((await explorer.boundingBox())!.width).toBe(196);
  await explorerDivider.press('ArrowLeft');
  expect((await explorer.boundingBox())!.width).toBe(184);
  await expect(preview.locator('.folio-tagline')).toHaveCSS('font-family', /Instrument Sans/);
  await expect(preview.getByRole('heading', { level: 1 })).toHaveCSS('font-family', /Instrument Serif/);
  await preview.getByRole('button', { name: 'Expand preview' }).click();
  await expect(editor).toBeHidden();
  await preview.getByRole('button', { name: 'Restore split view' }).click();
  await expect(editor).toBeVisible();
  await preview.getByRole('navigation').getByRole('link', { name: 'Experience' }).click();
  await preview.getByText('View project details', { exact: true }).first().click();
  await expect(preview.getByRole('heading', { name: 'Marketplace Expansion Service' })).toBeVisible();
  await preview.getByRole('link', { name: 'Portfolio home' }).click();
  await expect(page.locator('#file-about')).toContainText('Idraak Mohd Khan');
  for (const name of ['experience.json', 'education.yml', 'skills.ts', 'projects.tsx', 'products.md', 'contact.sh']) {
    await page.getByRole('tab', { name: new RegExp(name) }).click();
    await expect(page.getByRole('tab', { name: new RegExp(name) })).toHaveAttribute('aria-selected', 'true');
    if (name === 'products.md') await expect(page.locator('#file-products')).toContainText('Live Products');
  }
  await expect(page.locator('#file-contact a[href="https://www.linkedin.com/in/idraak"]')).toBeVisible();
  await expect(page.locator('#file-contact')).not.toContainText('CALENDAR');
  await page.keyboard.press('Control+k');
  await page.getByPlaceholder('Type a command, file, or theme…').fill('GitHub Light');
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'github');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'github');
  for (const name of ['about.md','experience.json','education.yml','skills.ts','projects.tsx','products.md','contact.sh']) {
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
  await expect(preview.getByRole('link', { name: 'View résumé' })).toHaveAttribute('href', '/Portfolio_Website/resume.pdf');
  await expect(page.locator('#file-about a[href$="resume.pdf"]')).toHaveAttribute('target', '_blank');
  const favicon = await request.get('favicon.svg');
  expect(favicon.status()).toBe(200);
  expect(errors).toEqual([]);
});

test('mobile explorer and content fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const preview = page.getByRole('region', { name: 'Portfolio preview' });
  const editor = page.getByRole('region', { name: 'Code editor' });
  const terminal = editor.getByRole('region', { name: 'Terminal' });
  const run = page.getByRole('button', { name: 'Run portfolio' });
  const runHint = page.getByText('Tap Run to open the portfolio');
  await expect(editor).toBeVisible();
  await expect(terminal).toBeVisible();
  const editorTop = (await editor.boundingBox())!.y;
  const terminalHandle = terminal.getByRole('separator', { name: 'Resize terminal' });
  const handle = (await terminalHandle.boundingBox())!;
  const x = Math.round(handle.x + handle.width / 2);
  const y = Math.round(handle.y + handle.height / 2);
  const startHeight = (await terminal.boundingBox())!.height;
  const touch = await page.context().newCDPSession(page);
  await touch.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - 60 }] });
  await expect.poll(async () => (await terminal.boundingBox())!.height).toBeGreaterThan(startHeight + 40);
  await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + 45 }] });
  await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(async () => (await terminal.boundingBox())!.height).toBeLessThan(startHeight - 25);
  await touch.detach();
  await expect(preview).toBeHidden();
  await expect(run).toHaveCSS('background-color', 'rgb(26, 101, 68)');
  await expect(runHint).toBeVisible();
  const runWord = runHint.locator('strong');
  await expect(runWord).toHaveCSS('animation-name', 'run-hint-pulse');
  await expect(runWord).toHaveCSS('animation-iteration-count', 'infinite');
  const pulseColors = await runWord.evaluate((word) => {
    const pulse = word.getAnimations()[0];
    pulse.pause();
    pulse.currentTime = 0;
    const resting = getComputedStyle(word).backgroundColor;
    pulse.currentTime = 700;
    const highlighted = getComputedStyle(word).backgroundColor;
    pulse.play();
    return { resting, highlighted };
  });
  expect(pulseColors.highlighted).not.toBe(pulseColors.resting);
  await expect(page.getByRole('separator', { name: 'Resize editor and preview' })).toBeHidden();
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  const explorerButton = page.getByTitle('Explorer (⌘B)', { exact: true });
  await explorerButton.click();
  await page.getByRole('button', { name: 'experience.json', exact: false }).first().click();
  await explorerButton.click();
  await expect(page.locator('#file-experience')).toContainText('Amazon');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await run.click();
  await expect(editor).toBeHidden();
  await expect(runHint).toBeHidden();
  await expect(preview.getByRole('heading', { name: 'Experience', exact: true })).toBeInViewport();
  await preview.getByRole('navigation').getByRole('link', { name: 'Projects' }).click();
  await expect(preview.getByRole('heading', { name: 'Agentic Browser' })).toBeInViewport();
  const cover = preview.getByRole('img', { name: /Illustrative Agentic Browser demo/ });
  await expect(cover).toBeInViewport();
  await expect.poll(() => cover.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({ path: 'test-results/mobile-project.png', fullPage: true });
  const closing = page.evaluate(() => new Promise<{ visibility: string; top: number }>((resolve) => {
    const output = document.getElementById('portfolio-output')!;
    output.addEventListener('animationstart', function capture(event) {
      if (event.animationName !== 'portfolio-panel-leave') return;
      output.removeEventListener('animationstart', capture);
      const codeEditor = document.getElementById('portfolio-editor')!;
      resolve({ visibility: getComputedStyle(codeEditor).visibility, top: codeEditor.getBoundingClientRect().top });
    });
  }));
  await preview.getByRole('button', { name: 'Editor', exact: true }).click();
  const closedFrame = await closing;
  expect(closedFrame.visibility).toBe('visible');
  expect(closedFrame.top).toBe(editorTop);
  await expect(preview).toBeHidden();
  await expect(terminal).toBeVisible();
  await page.getByRole('tab', { name: /products\.md/ }).click();
  await expect(editor.locator('#file-products')).toContainText('MicroGram');
  await run.click();
  const products = preview.locator('#portfolio-products');
  await expect(products.getByRole('heading', { name: 'Live Products' })).toBeInViewport();
  await expect(products.getByRole('heading', { name: 'MicroGram' })).toBeInViewport();
  await expect(products.getByRole('link', { name: 'Explore MicroGram' })).toHaveAttribute('href', 'https://idraakk.github.io/Idraak-Collection/microgram/index.html');
  const livePreview = products.getByRole('link', { name: 'Preview live in browser' });
  await expect(livePreview).toHaveAttribute('href', 'https://idraakk.github.io/Microgram_Preview_Web/');
  await expect(livePreview).not.toHaveAttribute('target', '_blank');
  await expect(products.getByRole('link', { name: /Browse Idraak/ })).toHaveAttribute('href', 'https://idraakk.github.io/Idraak-Collection/');
  const screenshots = products.getByRole('img');
  await expect(screenshots).toHaveCount(3);
  await expect(screenshots.nth(1)).toHaveAttribute('src', '/Portfolio_Website/microgram-library.webp');
  for (const screenshot of await screenshots.all()) {
    await expect(screenshot).toHaveJSProperty('naturalWidth', 360);
  }
  await products.locator('.folio-product-screens').screenshot({ path: 'test-results/mobile-microgram-phones.png', animations: 'disabled' });
  await page.screenshot({ path: 'test-results/mobile-products.png', fullPage: true, animations: 'disabled' });
  const headerCoversPhone = await preview.evaluate(async (output) => {
    const scroller = output.querySelector<HTMLElement>('.folio-scroll')!;
    const header = output.querySelector('.folio-nav')!;
    const phone = output.querySelector('.folio-product-phone:nth-child(2)')!;
    const headerBounds = header.getBoundingClientRect();
    const phoneBounds = phone.getBoundingClientRect();
    const x = phoneBounds.x + phoneBounds.width / 2;
    const y = headerBounds.y + headerBounds.height / 2;
    scroller.scrollTop += phoneBounds.y + phoneBounds.height / 2 - y;
    await new Promise(requestAnimationFrame);
    const overlaps = phone.getBoundingClientRect().top < y && phone.getBoundingClientRect().bottom > y;
    return overlaps && Boolean(document.elementFromPoint(x, y)?.closest('.folio-nav'));
  });
  expect(headerCoversPhone).toBe(true);
  await preview.getByRole('link', { name: 'Portfolio home' }).click();
  await expect(preview.getByRole('heading', { level: 1 })).toBeInViewport();
  const scrollBehavior = await page.evaluate(() => new Promise<string | undefined>((resolve) => {
    const contact = document.getElementById('portfolio-contact')!;
    const scrollIntoView = contact.scrollIntoView;
    contact.scrollIntoView = (options) => {
      contact.scrollIntoView = scrollIntoView;
      resolve(typeof options === 'object' ? options.behavior : undefined);
      scrollIntoView.call(contact, options);
    };
    document.querySelector<HTMLAnchorElement>('.folio-hero-actions a[href="#portfolio-contact"]')!.click();
  }));
  expect(scrollBehavior).toBe('smooth');
  await expect(preview.getByRole('heading', { name: 'Contact', exact: true })).toBeInViewport();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(preview).toHaveCSS('animation-name', 'none');
  await page.goBack();
  await expect(preview).toBeHidden();
  await expect(editor.locator('#file-products')).toBeVisible();
  await expect(terminal).toBeVisible();
  await page.goForward();
  await expect(products.getByRole('heading', { name: 'Live Products' })).toBeInViewport();
  await preview.getByRole('button', { name: 'Editor', exact: true }).click();
  await expect(runWord).toHaveCSS('animation-name', 'none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('MicroGram buttons slide into a destination in the same tab', async ({ page, context }) => {
  const destinations = [
    ['Explore MicroGram', 'https://idraakk.github.io/Idraak-Collection/microgram/index.html'],
    ['Preview live in browser', 'https://idraakk.github.io/Microgram_Preview_Web/'],
  ];

  for (const [label, url] of destinations) {
    await context.route(url, (route) => route.fulfill({ body: 'MicroGram' }));
    await page.goto('./');
    const link = page.locator('#portfolio-products').getByRole('link', { name: label });
    await expect(link).toBeVisible();
    const entry = page.evaluate(() => new Promise<string>((resolve) => {
      document.addEventListener('animationstart', function record(event) {
        if (event.animationName !== 'folio-product-slide') return;
        document.removeEventListener('animationstart', record);
        resolve(event.animationName);
      });
    }));
    await Promise.all([page.waitForURL(url), link.click()]);
    expect(await entry).toBe('folio-product-slide');
    expect(context.pages()).toHaveLength(1);
  }
});
