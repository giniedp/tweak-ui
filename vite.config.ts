import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: ['src/lib/index.ts'],
      name: 'TweakUI',
      formats: ['es', 'umd'],
      fileName: (format, input) => `tweak-ui.${format == 'es' ? 'module' : format}.js`,
    },
  },
})
