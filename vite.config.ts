import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/daily-snap-reflector/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip certain warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
            warning.code === 'MISSING_EXPORT' ||
            warning.code === 'UNRESOLVED_IMPORT') {
          return;
        }
        // Use default for everything else
        warn(warning);
      }
    }
  }
}));
