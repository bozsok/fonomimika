import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    proxy: {
      '^/data/.*': {
        target: 'https://petofink.edu.hu/fono',
        changeOrigin: true
      },
      '^/api/.*': {
        target: 'https://petofink.edu.hu/fono',
        changeOrigin: true
      }
    }
  }
});
