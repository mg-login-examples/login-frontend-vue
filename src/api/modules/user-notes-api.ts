import http from './base'
import apiEndpointsPath from '../api-endpoints-path'
import type { UserNoteCreate } from '@/models/user-note-create.model'
import type { UserNote } from '@/models/user-note.model'

const userNotesAPI = {
  async getUserNotes(userId: number): Promise<UserNote[]> {
    const response = await http.get(apiEndpointsPath.getUserNotes(userId))
    return <UserNote[]>response.data
  },
  async createUserNote(userNoteCreate: UserNoteCreate): Promise<UserNote> {
    const response = await http.post(apiEndpointsPath.createUserNote, userNoteCreate)
    return <UserNote>response.data
  },
  async editUserNote(userNoteEdit: UserNote) {
    await http.put(apiEndpointsPath.editUserNote(userNoteEdit.id), userNoteEdit)
  },
  async deleteUserNote(userNoteId: string) {
    await http.delete(apiEndpointsPath.deleteUserNote(userNoteId))
  }
}

export default userNotesAPI
