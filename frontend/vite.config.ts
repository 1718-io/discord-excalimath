import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Add this allowedHosts configuration block here
    allowedHosts: [
      'circus-coaster-pesticide.ngrok-free.dev', // Allows your ngrok tunnel through
      'localhost',
      '127.0.0.1',
      'olive-points-travel.loca.lt',
      'good-worms-wait.loca.lt',
      'participant-cow-motorcycle-following.trycloudflare.com',
      'hughes-writers-belle-null.trycloudflare.com',
        'excali-math-backend.onrender.com',
        'discord-excalimath.pages.dev',
      '*.trycloudflare.com'
    ],
    // Add this headers block to bypass the ngrok interstitial warning page
    // Add the localtunnel programmatic bypass header right here
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'bypass-tunnel-reminder': 'true'
    }
  },
  build: {// Generates .js.map files alongside your production bundles
    sourcemap: true,
    // Ensure small font files aren't converted to inline base64 strings.
    // Inlining fonts can sometimes trigger Content Security Policy (CSP) issues in the Discord iframe.
    assetsInlineLimit: 0,
    // REMOVE assetsInlineLimit: 0, or set it high enough (e.g., 50000) 
    // so Vite base64-inlines the font files into your CSS bundle:
    // assetsInlineLimit: 50000, 
    rollupOptions: {
      output: {
        // Keeps asset names clean and easy for the browser to find
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
