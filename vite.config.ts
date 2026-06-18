import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    cssCodeSplit: true,
    lib: {
      entry: ['src/index.ts'],
      name: 'TweakUI',
      formats: ['es', 'umd'],
      fileName: (format, input) => `tweak-ui.${format == 'es' ? 'module' : format}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names.includes('index.css')) {
            return 'style.css'
          }
          return assetInfo.names[0]
        },
      },
    },
  },
  plugins: [
    dts({
      tsconfigPath: './src/tsconfig.lib.json',
      outDir: 'dist',
      declarationOnly: false,
      copyDtsFiles: true,
      insertTypesEntry: true, // generates a root index.d.ts
    }),
  ],
})
