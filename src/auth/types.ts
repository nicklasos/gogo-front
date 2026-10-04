import type { ID } from '@/api/types'

export interface User {
  id: ID
  email: string
  name: string
  roles: string[]
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface LoginResponse extends AuthTokens {
  user: User
}
