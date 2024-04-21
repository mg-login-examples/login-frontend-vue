import casual from 'casual'

import type { Quote } from '@/models/quote.model'
import type { User } from '@/models/user.model'
import { fakeUser } from './users'

export const fakeUser2: User = {
  id: casual.integer(1000, 9999),
  email: casual.email,
  is_active: true,
  is_verified: true
}

export const fakeQuote: Quote = {
  id: casual.integer(1000, 9999),
  text: casual.sentence,
  author: fakeUser,
  liked_by_users: []
}

export const fakeQuotes: Quote[] = [
  {
    id: casual.integer(1000, 9999),
    text: casual.sentence,
    author: fakeUser,
    liked_by_users: []
  },
  {
    id: casual.integer(1000, 9999),
    text: casual.sentence,
    author: fakeUser,
    liked_by_users: []
  },
  {
    id: casual.integer(1000, 9999),
    text: casual.sentence,
    author: fakeUser2,
    liked_by_users: []
  }
]

export const fakeUserQuotes: Quote[] = [fakeQuotes[0], fakeQuotes[1]]
