import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import dbHelper from './helpers/db-helper.js'

const execAsync = promisify(exec)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

async function globalSetup() {
  console.log('Setting up E2E test environment...')

  try {
    fs.mkdirSync(path.join(__dirname, '.auth'), { recursive: true })

    if (!process.env.TEST_DATABASE_URL) {
      throw new Error('TEST_DATABASE_URL is required in gogo-front .env')
    }

    console.log('Setting up gogo test database...')
    await execAsync('cd ../gogo && set -a && . ./.env && set +a && make test-db-setup')
    console.log('Database schema ready')

    console.log('Cleaning test data...')
    await dbHelper.cleanupTestData()
    console.log('E2E test environment ready')
  } catch (error) {
    console.error('Failed to set up E2E test environment:', error.message)
    process.exit(1)
  }
}

export default globalSetup
