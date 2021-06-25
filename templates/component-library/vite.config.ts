import path from 'path';
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 8000
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ComponentLibrary',
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        globals: {
          lit: 'lit',
        },
      },
    },
  },
});
