import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function viciApiPlugin() {
  let leadCounter = 1049300;
  const injectedLeads = new Set<string>();

  return {
    name: 'vici-api-simulator',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/leads/public-ip') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            ip: '39.45.182.94',
            status: 'success',
            gateway: 'dialer.gntechnos.com',
            verified_at: new Date().toISOString()
          }));
          return;
        }

        if (url === '/api/leads/inject' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const phone = data.phone || data.phone_number || '';
              const listId = data.list_id || 101;
              const duplicateCheck = data.duplicate_check || 'DUPCAMP';

              if (duplicateCheck === 'DUPCAMP' && injectedLeads.has(phone)) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  status: 'NOTICE',
                  code: 'DUPLICATE',
                  message: `DUPLICATE LEAD FOUND: Phone ${phone} already exists in list ${listId}`,
                  phone
                }));
                return;
              }

              injectedLeads.add(phone);
              leadCounter++;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                status: 'SUCCESS',
                result_text: `SUCCESS: add_lead LEAD HAS BEEN ADDED - ${leadCounter}`,
                lead_id: String(leadCounter),
                phone,
                city: data.city || 'Lahore'
              }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ status: 'ERROR', message: 'Invalid payload' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), viciApiPlugin()],
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
