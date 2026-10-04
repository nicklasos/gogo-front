import type { ID, Timestamps } from '@/api/types'
import type { Role } from '@/auth/roles'

export interface ManagedUser extends Timestamps {
  id: ID
  email: string
  name: string
  roles: string[]
}

export interface UserCreateRequest {
  email: string
  name: string
  password: string
  role: Role
}

export interface UserUpdateRequest {
  email: string
  name: string
}

export interface UserFormValues {
  email: string
  name: string
  password?: string
}
