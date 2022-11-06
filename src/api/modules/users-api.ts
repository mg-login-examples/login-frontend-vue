import type { User } from "@/models/user.model";
import type { UserCreate } from "@/models/user-create.model";
import type { LoginResponse } from "@/models/login-response.model";
import http from "./base";

const usersAPI = {
  async login(
    userEmail: string,
    userPassword: string,
    rememberMe: boolean
  ): Promise<User> {
    const formData = new FormData();
    formData.append("username", userEmail);
    formData.append("password", userPassword);
    formData.append("remember_me", rememberMe.toString());
    const response = await http.post("/api/login/", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const loginResponse: LoginResponse = <LoginResponse>response.data;
    if (import.meta.env.VITE_APP_ADD_AUTHORIZATION_HEADER === "true") {
      http.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginResponse.access_token}`;
    }
    return loginResponse.user;
  },
  async authenticate(): Promise<User> {
    const response = await http.post("/api/authenticate/");
    return <User>response.data;
  },
  async logout(): Promise<void> {
    await http.post("/api/logout/");
  },
  async createUser(userCreate: UserCreate): Promise<User> {
    const response = await http.post(`/api/users/`, userCreate);
    const loginResponse: LoginResponse = <LoginResponse>response.data;
    if (import.meta.env.VITE_APP_ADD_AUTHORIZATION_HEADER === "true") {
      http.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginResponse.access_token}`;
    }
    return loginResponse.user;
  },
  async sendEmailWithPasswordResetLink(userEmail: string): Promise<void> {
    await http.post("/api/password-reset-link/", { email: userEmail });
  },
};

export default usersAPI;
