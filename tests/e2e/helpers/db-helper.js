import { Client } from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
dotenv.config()

export class DatabaseHelper {
  constructor() {
    this.client = null
    this.connectionString = process.env.TEST_DATABASE_URL
    if (!this.connectionString) {
      throw new Error('TEST_DATABASE_URL environment variable is required')
    }
  }

  async connect() {
    if (!this.client) {
      this.client = new Client({ connectionString: this.connectionString })
      await this.client.connect()
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.end()
      this.client = null
    }
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 10)
  }

  async createUser({
    email = `e2e-user-${Date.now()}@example.com`,
    password = 'testpassword123',
    name = 'E2E User',
  } = {}) {
    await this.connect()
    const hashed = await this.hashPassword(password)
    const result = await this.client.query(
      `INSERT INTO users (email, name, password)
       VALUES ($1, $2, $3)
       RETURNING id, email, name`,
      [email, name, hashed]
    )
    return {
      id: result.rows[0].id,
      email: result.rows[0].email,
      name: result.rows[0].name,
      password,
    }
  }

  async createExample(userId, { title = `Example ${Date.now()}`, description = 'desc' } = {}) {
    await this.connect()
    const result = await this.client.query(
      `INSERT INTO examples (user_id, title, description)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, title, description`,
      [userId, title, description]
    )
    return result.rows[0]
  }

  async cleanupTestData() {
    await this.connect()
    await this.client.query(`DELETE FROM refresh_tokens`)
    await this.client.query(`DELETE FROM examples WHERE title LIKE 'E2E%' OR title LIKE 'Example %'`)
    await this.client.query(`DELETE FROM users WHERE email LIKE 'e2e-%@example.com'`)
  }
}

const dbHelper = new DatabaseHelper()
export default dbHelper
