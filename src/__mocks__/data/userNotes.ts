import casual from 'casual'

import type { UserNote } from '@/models/user-note.model'
import { fakeUser } from './users'

export const fakeUserNote: UserNote = {
  id: Math.random().toString(36).slice(2),
  title: casual.title,
  text: casual.text,
  user_id: fakeUser.id
}

export const fakeUserNotes: UserNote[] = [
  {
    id: Math.random().toString(36).slice(2),
    title: casual.title,
    text: casual.text,
    user_id: fakeUser.id
  },
  {
    id: Math.random().toString(36).slice(2),
    title: casual.title,
    text: casual.text,
    user_id: fakeUser.id
  },
  {
    id: Math.random().toString(36).slice(2),
    title: casual.title,
    text: casual.text,
    user_id: fakeUser.id
  }
]
