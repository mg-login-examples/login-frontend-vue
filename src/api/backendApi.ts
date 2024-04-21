import usersAPI from './modules/users-api'
import quotesAPI from './modules/quotes-api'
import emailVerificationsAPI from './modules/email-verifications-api'
import userNotesAPI from './modules/user-notes-api'

const api = {
  users: usersAPI,
  quotes: quotesAPI,
  emailVerifications: emailVerificationsAPI,
  userNotes: userNotesAPI
}

export default api
