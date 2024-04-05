import { defineStore } from 'pinia'

import type { User } from '@/models/user.model'
import backendApi from '@/api/backendApi'
import { useErrorsStore } from './errors'
import { getUserDisplayName } from '@/utils/userUtils/userName'
import type { GoogleSignInPayload } from '@/models/google-sign-in-payload.model'

interface UserState {
  authAttemptedOnce: boolean
  user: User | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    authAttemptedOnce: false,
    user: null
  }),
  getters: {
    userName: (state): string => {
      const name = state.user ? getUserDisplayName(state.user) : ''
      return name ? name : ''
    }
  },
  actions: {
    async login(userEmail: string, userPassword: string, rememberMe: boolean): Promise<string> {
      try {
        await backendApi.users.login(userEmail, userPassword, rememberMe)
        // following authentication is made to check if cookies have been set
        if (await this.authenticate()) {
          return 'success'
        } else {
          return 'authentication failed'
        }
      } catch (error: any) {
        const errorStore = useErrorsStore()
        errorStore.handleError(error)
        this.user = null
        if (error.response && error.response.status === 401) {
          return 'invalid login'
        }
        return 'unknown error'
      }
    },
    async googleLogin(googleSignInPayload: GoogleSignInPayload): Promise<string> {
      try {
        await backendApi.users.googleLogin(googleSignInPayload)
        // following authentication is made to check if cookies have been set
        if (await this.authenticate()) {
          return 'success'
        } else {
          return 'authentication failed'
        }
      } catch (error: any) {
        const errorStore = useErrorsStore()
        errorStore.handleError(error)
        this.user = null
        if (error.response && error.response.status === 401) {
          return 'invalid login'
        }
        return 'unknown error'
      }
    },
    async authenticate() {
      try {
        this.user = await backendApi.users.authenticate()
      } catch (error) {
        this.user = null
      }
      this.authAttemptedOnce = true
      return this.user != null
    },
    async logout() {
      try {
        await backendApi.users.logout()
        this.user = null
        return true
      } catch (error) {
        const errorStore = useErrorsStore()
        errorStore.handleError(error)
        this.user = null
        return false
      }
    },
    async createUser(userEmail: string, userPassword: string) {
      try {
        const userCreate = {
          email: userEmail,
          password: userPassword
        }
        this.user = await backendApi.users.createUser(userCreate)
        return true
      } catch (error) {
        const errorStore = useErrorsStore()
        errorStore.handleError(error)
        this.user = null
        return false
      }
    },
    async verifyEmail(verificationCode: number) {
      try {
        await backendApi.emailVerifications.verifyEmail(verificationCode)
        this.user = await backendApi.users.authenticate()
        return true
      } catch (error) {
        const errorStore = useErrorsStore()
        errorStore.handleError(error)
        return false
      }
    },
    async resendEmail() {
      try {
        await backendApi.emailVerifications.resendEmail()
        return true
      } catch (error) {
        const errorStore = useErrorsStore()
        errorStore.handleError(error)
        return false
      }
    },
    async sendEmailWithPasswordResetLink(userEmail: string) {
      try {
        await backendApi.users.sendEmailWithPasswordResetLink(userEmail)
        return true
      } catch (error) {
        const errorStore = useErrorsStore()
        errorStore.handleError(error)
        return false
      }
    }
  }
})
