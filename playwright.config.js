import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })

const TEST_FRONTEND_PORT = process.env.TEST_FRONTEND_PORT || '5174'
const TEST_BACKEND_PORT = process.env.TEST_BACKEND_PORT || '8183'

if (!process.env.VITE_E2E_API_BASE_URL) {
  process.env.VITE_E2E_API_BASE_URL = `http://localhost:${TEST_BACKEND_PORT}/api/v1`
}

const authDir = path.join(__dirname, 'tests/e2e/.auth')

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${TEST_FRONTEND_PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },
    {
      name: 'chromium-auth',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testMatch: /auth\.spec\.js/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'user.json'),
      },
      dependencies: ['setup'],
      testMatch: /(?:^|\/)(dashboard|examples|unsaved-changes)\.spec\.js$/,
    },
  ],
  webServer: [
    {
      command: `cd ../gogo && set -a && . ./.env && set +a && go run ./cmd/api --port=${TEST_BACKEND_PORT} --test-db`,
      url: `http://localhost:${TEST_BACKEND_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: `VITE_API_BASE_URL=http://localhost:${TEST_BACKEND_PORT} npm run dev -- --port ${TEST_FRONTEND_PORT}`,
      url: `http://localhost:${TEST_FRONTEND_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
  globalSetup: './tests/e2e/global-setup.js',
  globalTeardown: './tests/e2e/global-teardown.js',
})
