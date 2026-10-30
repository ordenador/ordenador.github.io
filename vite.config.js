import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

// Exercise GitHub Pages' real 404 behavior in the local production preview.
function realNotFound() {
  return {
    name: 'real-not-found',
    configurePreviewServer(server) {
      const root = resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, res, next) => {
        let file;
        try {
          file = resolve(
            root,
            '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
          );
        } catch {
          res.statusCode = 400;
          res.end('Bad request');
          return;
        }
        if (file !== root && !file.startsWith(root + sep)) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
        const exists =
          existsSync(file) && (statSync(file).isFile() || existsSync(resolve(file, 'index.html')));
        if (exists) {
          next();
          return;
        }
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(resolve(root, '404.html')));
      });
    },
  };
}
export default defineConfig({
  base: '/',
  plugins: [react(), realNotFound()],
  server: { port: 3000 },
  build: { outDir: 'dist', assetsDir: 'assets' },
});
