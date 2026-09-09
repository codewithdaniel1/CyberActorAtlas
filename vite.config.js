import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages serves the project at the origin root. The GitHub Pages
  // workflow overrides this with --base=/CyberActorAtlas/.
  base: '/',
});
