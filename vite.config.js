import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Create process.env mapping for REACT_APP_* variables
  const processEnv = {}
  Object.keys(env).forEach((key) => {
    if (key.startsWith('REACT_APP_') || key.startsWith('VITE_')) {
      processEnv[key] = env[key]
    }
  })
  
  return {
    plugins: [
      react({
        include: '**/*.{jsx,js}',
      })
    ],
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3005,
      open: true,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
    },
    define: {
      'process.env': JSON.stringify(processEnv),
    },
  }
})

