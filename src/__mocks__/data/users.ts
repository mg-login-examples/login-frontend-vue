import casual from 'casual'

import type { LoginResponse } from '@/models/login-response.model'
import type { UserLogin } from '@/models/user-login.model'
import type { User } from '@/models/user.model'

export const fakeUserLogin: UserLogin = {
  email: casual.email,
  password: casual.password
}

export const fakeUser: User = {
  id: casual.integer(1000, 9999),
  email: fakeUserLogin.email,
  is_active: true,
  is_verified: true
}

export const fakeUserUnverified: User = {
  id: casual.integer(1000, 9999),
  email: fakeUserLogin.email,
  is_active: true,
  is_verified: false
}

export const fakeLoginResponse: LoginResponse = {
  user: fakeUser,
  access_token: casual.uuid,
  token_type: 'bearer'
}
