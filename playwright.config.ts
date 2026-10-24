import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:3000/Portfolio_Website/', channel: 'msedge', headless: true },
  webServer: { command: process.platform === 'win32' ? 'npm.cmd run start' : 'npm run start', url: 'http://127.0.0.1:3000/Portfolio_Website/', reuseExistingServer: false },
});
