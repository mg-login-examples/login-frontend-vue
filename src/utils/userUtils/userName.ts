import type { User } from '@/models/user.model'

export function getUserDisplayName(user: User) {
  return user.name ? user.name : user.email.split('@')[0]
}
