import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.PORT || 5173)

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // React and the small libraries change far less often than app code, so in their
          // own files they stay cached across deploys. Ant Design is left to Rollup on
          // purpose: forcing it into one file would make every page download the table,
          // upload and picker code that only some pages use.
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'vendor-react'
            if (/node_modules\/(antd|@ant-design|rc-[^/]+|@rc-component|@babel|dayjs|classnames|@ctrl|@emotion|stylis|throttle-debounce|scroll-into-view-if-needed|compute-scroll-into-view|resize-observer-polyfill|copy-to-clipboard|toggle-selection|json2mq|string-convert)\//.test(id)) return undefined
            return 'vendor'
          },
        },
      },
      // The Ant Design parts the shell needs are above Vite's default 500 kB warning
      chunkSizeWarningLimit: 900,
    },
    server: {
      port,
      strictPort: true,
    },
    preview: {
      port,
      strictPort: true,
    },
  }
})
