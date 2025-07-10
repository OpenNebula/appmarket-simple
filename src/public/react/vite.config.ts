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
      // Proxy only for development - The target here is to avoid CORS when development in local
      proxy: mode === 'development' ? {
        '/appliance': {
          target: pathAPIDevelopmentMode,
          changeOrigin: true,
          secure: false,
          proxyTimeout: 10000,
          timeout: 10000,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Referer', pathAPIDevelopmentMode);
            });
          },
        },
        '/logos': {
          target: pathAPIDevelopmentMode,
          changeOrigin: true,
          secure: false,
          proxyTimeout: 10000,
          timeout: 10000,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Referer', pathAPIDevelopmentMode);
            });
          },
        },
      } : undefined,  // Return an empty object if not in development mode
    },
  }
})
