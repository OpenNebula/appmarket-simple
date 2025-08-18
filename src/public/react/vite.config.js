import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';


export default defineConfig(({mode}) => {

  // Type app is community or opennebula
  const appType = process.env.APP_TYPE; 

  // Config files
  const configFile = appType === "community" ? "config.community.json" : "config.opennebula.json";
  
  // URL to consume API (only development mode). Use to avoid CORS in development mode.
  const pathAPIDevelopmentMode = appType === "community" ? "https://community-marketplace.opennebula.io" : "https://marketplace.opennebula.io"

  // API routes to avoid CORS and proxy to an API
  const proxyRoutes = ["/appliance", "/logos"];

  // Proxy config to avoid CORS when calling the API
  const proxyConfig =
    mode === 'development'
      ? Object.fromEntries(
          proxyRoutes.map((route) => [
            route,
            {
              target: pathAPIDevelopmentMode,
              changeOrigin: true,
              secure: false,
              proxyTimeout: 30000,
              timeout: 30000,
              // agent: keepAliveAgent,
              bypass: (req) => {
                const acceptHeader = req.headers.accept || ''
                if (acceptHeader.includes('text/html')) {
                  // Bypass proxy for browser navigation requests
                  return '/index.html'
                }
              },
              configure: (proxy) => {
                proxy.on('proxyReq', (proxyReq) => {
                  proxyReq.setHeader('Referer', pathAPIDevelopmentMode)
                })
              },
            },
          ])
        )
      : undefined

  return {
    base: '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), 
        "@config": path.resolve(__dirname, `src/config/${configFile}`),
      },
    },
    build: {
      outDir: 'dist',      
      chunkSizeWarningLimit: 1024,
    },
    server: {
      proxy: proxyConfig,
    },
  }
})
