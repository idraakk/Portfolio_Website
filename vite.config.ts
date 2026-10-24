import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Portfolio_Website/',
  plugins: [reactRouter()],
  resolve: { tsconfigPaths: true },
});
