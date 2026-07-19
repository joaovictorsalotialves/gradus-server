import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import path from 'node:path'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    dir: './src',
    globals: true,
  }
})
