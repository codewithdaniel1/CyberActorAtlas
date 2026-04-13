import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const REPO_BASE = '/CyberActorAtlas/';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : REPO_BASE,
}));
