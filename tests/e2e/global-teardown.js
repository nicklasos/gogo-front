import dbHelper from './helpers/db-helper.js'

async function globalTeardown() {
  console.log('Cleaning up E2E test environment...')
  try {
    await dbHelper.cleanupTestData()
    await dbHelper.disconnect()
    console.log('E2E test environment cleaned up')
  } catch (error) {
    console.error('Failed to clean up E2E test environment:', error.message)
  }
}

export default globalTeardown
