/// <reference types="vitest" />
import { describe, it, expect, vi, afterEach, type Mock } from 'vitest'

import usersApi from '@/api/modules/users-api'
import http from '@/api/modules/base'
import { fakeUserLogin, fakeLoginResponse, fakeUser } from '@/__mocks__/data/users'
import {
  mockAxiosLoginUser,
  mockAxiosAuthenticateUser,
  mockAxiosLogoutUser,
  mockAxiosCreateUser,
  mockAxiosSendEmailWithPasswordResetLink
} from './api-mock-implementations'
import type { UserCreate } from '@/models/user-create.model'

describe('api > modules > users.ts', () => {
  describe('> login()', () => {
    afterEach(() => {
      import.meta.env.VITE_APP_ADD_AUTHORIZATION_HEADER = undefined
    })

    it('logs in user with username and password', async () => {
      http.post = vi.fn().mockImplementation(mockAxiosLoginUser)
      await expect(
        usersApi.login(fakeUserLogin.email, fakeUserLogin.password, false)
      ).resolves.toEqual(fakeUser)
      expect(http.post).toHaveBeenCalledWith('/api/login/', expect.anything(), expect.anything())
      expect(http.defaults.headers.common['Authorization']).not.toBe(
        `Bearer ${fakeLoginResponse.access_token}`
      )
    })

    it(`
    stores the access token as an authorization header after login api call
    if environment variable VUE_APP_ADD_AUTHORIZATION_HEADER has value true
    `, async () => {
      import.meta.env.VITE_APP_ADD_AUTHORIZATION_HEADER = 'true'
      http.post = vi.fn().mockImplementation(mockAxiosLoginUser)
      await expect(
        usersApi.login(fakeUserLogin.email, fakeUserLogin.password, false)
      ).resolves.toEqual(fakeUser)
      expect(http.post).toHaveBeenCalledWith('/api/login/', expect.anything(), expect.anything())
      expect(http.defaults.headers.common['Authorization']).toBe(
        `Bearer ${fakeLoginResponse.access_token}`
      )
    })
  })

  it('authenticates user', async () => {
    http.post = vi.fn().mockImplementation(mockAxiosAuthenticateUser)
    await expect(usersApi.authenticate()).resolves.toEqual(fakeUser)
    expect(http.post).toHaveBeenCalledWith('/api/authenticate/')
  })

  it('logs out user', async () => {
    http.post = vi.fn().mockImplementation(mockAxiosLogoutUser)
    await expect(usersApi.logout()).resolves.toEqual(undefined)
    expect(http.post).toHaveBeenCalledWith('/api/logout/')
  })

  it('creates a user', async () => {
    const userCreate: UserCreate = {
      email: fakeUser.email,
      password: 'fakepassword'
    }
    http.post = vi.fn().mockImplementation(mockAxiosCreateUser)
    await expect(usersApi.createUser(userCreate)).resolves.toEqual(fakeUser)
    expect(http.post).toHaveBeenCalledWith(`/api/users/`, userCreate)
  })

  it(`
  stores the access token as an authorization header after create user api call
  if environment variable VUE_APP_ADD_AUTHORIZATION_HEADER has value true
  `, async () => {
    import.meta.env.VITE_APP_ADD_AUTHORIZATION_HEADER = 'true'
    const userCreate: UserCreate = {
      email: fakeUser.email,
      password: 'fakepassword'
    }
    http.post = vi.fn().mockImplementation(mockAxiosCreateUser)
    await expect(usersApi.createUser(userCreate)).resolves.toEqual(fakeUser)
    expect(http.post).toHaveBeenCalledWith(`/api/users/`, userCreate)
    expect(http.defaults.headers.common['Authorization']).toBe(
      `Bearer ${fakeLoginResponse.access_token}`
    )
  })

  it('sends email with password reset link', async () => {
    const email = fakeUser.email
    http.post = vi.fn().mockImplementation(mockAxiosSendEmailWithPasswordResetLink)
    await expect(usersApi.sendEmailWithPasswordResetLink(email)).resolves.toEqual(undefined)
    expect(http.post).toHaveBeenCalledWith(`/api/password-reset-link/`, expect.anything())
    expect((http.post as Mock).mock.calls[0][1]).toEqual({ email })
  })
})
