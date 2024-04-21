import { EnvironmentVars } from '@/utils/envUtils'
import http from './base'
import apiEndpointsPath from '../api-endpoints-path'
import type { User } from '@/models/user.model'
import type { UserCreate } from '@/models/user-create.model'
import type { LoginResponse } from '@/models/login-response.model'
import type { GoogleSignInPayload } from '@/models/google-sign-in-payload.model'

const usersAPI = {
  async login(userEmail: string, userPassword: string, rememberMe: boolean): Promise<User> {
    const formData = new FormData()
    formData.append('username', userEmail)
    formData.append('password', userPassword)
    formData.append('remember_me', rememberMe.toString())
    const response = await http.post(apiEndpointsPath.login, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const loginResponse: LoginResponse = <LoginResponse>response.data
    if (EnvironmentVars.addAuthorizationHeader) {
      http.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.access_token}`
    }
    return loginResponse.user
  },
  async authenticate(): Promise<User> {
    const response = await http.post(apiEndpointsPath.authenticate)
    return <User>response.data
  },
  async logout(): Promise<void> {
    await http.post(apiEndpointsPath.logout)
  },
  async createUser(userCreate: UserCreate): Promise<User> {
    const response = await http.post(apiEndpointsPath.createUser, userCreate)
    const loginResponse: LoginResponse = <LoginResponse>response.data
    if (EnvironmentVars.addAuthorizationHeader) {
      http.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.access_token}`
    }
    return loginResponse.user
  },
  async getUsers(filterUserText: string): Promise<User[]> {
    const params = { filter_users_text: filterUserText }
    const response = await http.get(apiEndpointsPath.getUsers, { params })
    return <User[]>response.data
  },
  async getUsersByIds(userIds: number[]): Promise<User[]> {
    const response = await http.post(apiEndpointsPath.getUsersByIds, userIds)
    return <User[]>response.data
  },
  async sendEmailWithPasswordResetLink(userEmail: string): Promise<void> {
    await http.post(apiEndpointsPath.sendEmailWithPasswordResetLink, {
      email: userEmail
    })
  },
  async googleLogin(googleSignInPayload: GoogleSignInPayload) {
    const response = await http.post(apiEndpointsPath.googleLogin, googleSignInPayload)
    console.log(response)
  }
}

export default usersAPI
