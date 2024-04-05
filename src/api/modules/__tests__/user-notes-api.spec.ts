import { describe, it, expect, vi } from 'vitest'

import userNotesApi from '@/api/modules/user-notes-api'
import http from '@/api/modules/base'
import { fakeUser } from '@/__mocks__/data/users'
import { fakeUserNote, fakeUserNotes } from '@/__mocks__/data/userNotes'
import {
  mockAxiosGetUserNotes,
  mockAxiosPostUserNote,
  mockAxiosPutUserNote,
  mockAxiosDeleteUserNote
} from './api-mock-implementations'
import type { UserNoteCreate } from '@/models/user-note-create.model'
import type { UserNote } from '@/models/user-note.model'

describe('api > modules > notes.ts', () => {
  it('gets user notes by userId', async () => {
    http.get = vi.fn().mockImplementation(mockAxiosGetUserNotes)
    await expect(userNotesApi.getUserNotes(fakeUser.id)).resolves.toEqual(fakeUserNotes)
    expect(http.get).toHaveBeenCalledWith(`/api/users/${fakeUser.id}/user-notes/`)
  })

  it('creates a user note', async () => {
    http.post = vi.fn().mockImplementation(mockAxiosPostUserNote)
    const userNoteCreate: UserNoteCreate = {
      title: fakeUserNote.title,
      text: fakeUserNote.text,
      user_id: fakeUserNote.user_id
    }
    await expect(userNotesApi.createUserNote(userNoteCreate)).resolves.toEqual(fakeUserNote)
    expect(http.post).toHaveBeenCalledWith(`/api/user-notes/`, userNoteCreate)
  })

  it('edits a user note', async () => {
    http.put = vi.fn().mockImplementation(mockAxiosPutUserNote)
    const userNoteEdit: UserNote = {
      id: fakeUserNote.id,
      title: fakeUserNote.title,
      text: fakeUserNote.text,
      user_id: fakeUserNote.user_id
    }
    await expect(userNotesApi.editUserNote(userNoteEdit)).resolves.toEqual(undefined)
    expect(http.put).toHaveBeenCalledWith(`/api/user-notes/${fakeUserNote.id}/`, userNoteEdit)
  })

  it('deletes a user note', async () => {
    http.delete = vi.fn().mockImplementation(mockAxiosDeleteUserNote)
    await expect(userNotesApi.deleteUserNote(fakeUserNote.id)).resolves.toEqual(undefined)
    expect(http.delete).toHaveBeenCalledWith(`/api/user-notes/${fakeUserNote.id}/`)
  })
})
