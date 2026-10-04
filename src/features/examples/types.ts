import type { ID, Timestamps } from '@/api/types'

export interface Example extends Timestamps {
  id: ID
  user_id: ID
  title: string
  description: string
}

export interface ExampleRequest {
  title: string
  description: string
}
