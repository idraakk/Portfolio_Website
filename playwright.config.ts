import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:3000', channel: 'msedge', headless: true },
  webServer: { command: 'npm.cmd run start', url: 'http://localhost:3000', reuseExistingServer: true },
});
