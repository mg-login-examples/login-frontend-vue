import minifaker from "minifaker";
import "minifaker/locales/en";

import type { User } from "@/models/user.model";
import type { UserLogin } from "@/models/user-login.model";
import type { LoginResponse } from "@/models/login-response.model";

export const fakeUserLogin: UserLogin = {
  email: minifaker.email(),
  password: minifaker.password({ minLength: 8 }),
};

export const fakeUser: User = {
  id: minifaker.number({ min: 1000, max: 9999 }),
  email: fakeUserLogin.email,
  is_active: true,
  is_verified: true,
};

export const fakeUserUnverified: User = {
  id: minifaker.number({ min: 1000, max: 9999 }),
  email: fakeUserLogin.email,
  is_active: true,
  is_verified: false,
};

export const fakeLoginResponse: LoginResponse = {
  user: fakeUser,
  access_token: minifaker.uuid.v4(),
  token_type: "bearer",
};
