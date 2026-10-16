import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (!req.url?.startsWith('/api/')) {
              return next();
            }

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const url = new URL(req.url, 'http://localhost');
            const apiPath = url.pathname;

            if (apiPath === '/api/vacant-sites') {
              const filePath = path.resolve(__dirname, 'api/ura_vacant_sites.json');
              if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                res.end(
                  JSON.stringify({
                    status: 'success',
                    source: 'Data: URA SINGAPORE',
                    sourceEndpoint:
                      'https://isomer-user-content.by.gov.sg/467/033342db-3b73-4730-bdc8-f47088c2c31d/06%20URA%20Vacant%20Sites%20(online%20version).xlsx',
                    totalCount: data.length,
                    sites: data,
                  })
                );
                return;
              }
            } else if (apiPath === '/api/public') {
              const filePath = path.resolve(__dirname, 'api/ura_public_sites.json');
              if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                res.end(
                  JSON.stringify({
                    status: 'success',
                    source: 'Data: URA SINGAPORE',
                    totalCount: data.length,
                    sites: data,
                  })
                );
                return;
              }
            } else if (apiPath === '/api/landed') {
              const filePath = path.resolve(__dirname, 'api/ura_landed_sites.json');
              if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                res.end(
                  JSON.stringify({
                    status: 'success',
                    source: 'Data: URA SINGAPORE',
                    totalCount: data.length,
                    sites: data,
                  })
                );
                return;
              }
            } else if (apiPath === '/api/health') {
              res.end(
                JSON.stringify({
                  status: 'healthy',
                  service: 'PropertySeek Singapore API',
                  source: 'Data: URA SINGAPORE',
                  timestamp: new Date().toISOString(),
                })
              );
              return;
            }

            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
