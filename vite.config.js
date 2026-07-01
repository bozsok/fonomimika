import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDemo = mode === 'demo';

  return {
    base: './',
    build: {
      outDir: isDemo ? 'dist/demo' : 'dist',
      emptyOutDir: true,
    },
    plugins: [
      {
        name: 'demo-post-build',
        closeBundle() {
          if (isDemo) {
            const demoDir = path.resolve(__dirname, 'dist/demo');
            const apiDir = path.join(demoDir, 'api');
            const dataDir = path.join(demoDir, 'data');

            // 1. Töröljük a save_data.php fájlt és az api mappát a demóból
            if (fs.existsSync(apiDir)) {
              fs.rmSync(apiDir, { recursive: true, force: true });
              console.log('Post-build: api/ mappa és save_data.php sikeresen eltávolítva a demó verzióból.');
            }

            // 2. Kicseréljük a students.json-t a students_demo.json tartalmára
            const realJson = path.join(dataDir, 'students.json');
            const demoJson = path.join(dataDir, 'students_demo.json');

            if (fs.existsSync(demoJson)) {
              fs.copyFileSync(demoJson, realJson);
              fs.unlinkSync(demoJson);
              console.log('Post-build: a students.json felülírva a demó adatbázissal.');
            }

            // 3. Módosítjuk az index.html szövegét, hogy megelőzzük a kliensoldali villódzást (FOUC)
            const demoHtmlPath = path.join(demoDir, 'index.html');
            if (fs.existsSync(demoHtmlPath)) {
              let html = fs.readFileSync(demoHtmlPath, 'utf-8');
              html = html.replace(
                'Kérlek, válaszd ki a neved a belépéshez!',
                'Kérlek, gépeld be a &#39;Példa Tanuló&#39; nevet a belépéshez!'
              );
              html = html.replace(
                'placeholder="Gépeld be a neved..."',
                'placeholder="Példa Tanuló"'
              );
              fs.writeFileSync(demoHtmlPath, html, 'utf-8');
              console.log('Post-build: a demó index.html szövegei felülírva a build során.');
            }
          } else {
            // Normál build esetén töröljük a students_demo.json fájlt a dist mappából
            const realDir = path.resolve(__dirname, 'dist');
            const demoJson = path.join(realDir, 'data/students_demo.json');
            if (fs.existsSync(demoJson)) {
              fs.unlinkSync(demoJson);
              console.log('Post-build: students_demo.json eltávolítva a normál buildből.');
            }
          }
        }
      }
    ],
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
  };
});

