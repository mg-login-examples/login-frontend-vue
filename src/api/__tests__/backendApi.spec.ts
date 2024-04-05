import { describe, it, expect } from 'vitest'

import backendApi from '@/api/backendApi'
import users from '@/api/modules/users-api'
import quotes from '@/api/modules/quotes-api'
import emailVerifications from '@/api/modules/email-verifications-api'
import userNotes from '@/api/modules/user-notes-api'

describe('backend api module', () => {
  it('includes users module in api module', () => {
    expect(backendApi).toHaveProperty('users')
    expect(backendApi.users).toBe(users)
  })
  it('includes quotes module in api module', () => {
    expect(backendApi).toHaveProperty('quotes')
    expect(backendApi.quotes).toBe(quotes)
  })
  it('includes email verifications module in api module', () => {
    expect(backendApi).toHaveProperty('emailVerifications')
    expect(backendApi.emailVerifications).toBe(emailVerifications)
  })
  it('includes user notes module in api module', () => {
    expect(backendApi).toHaveProperty('userNotes')
    expect(backendApi.userNotes).toBe(userNotes)
  })
})
