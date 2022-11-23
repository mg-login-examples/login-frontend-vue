import axios from "axios";

import { LoginResponseModel } from "../models/login-response.model";
import { UserNoteModel } from "../models/user-note.model";

export default class UserAPI {
  static api_base_url = Cypress.env("apiUrl");
  static loginUrl = `${this.api_base_url}/login/`;

  static getUserNotesByUserIdUrl(userId: number) {
    return `${this.api_base_url}/users/${userId}/user-notes/`;
  }

  static async login(email: string, password: string) {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    return <LoginResponseModel>(
      await axios({
        method: "POST",
        url: this.loginUrl,
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    ).data;
  }

  static async getUserNotes(email: string, password: string) {
    const loginResponse = await this.login(email, password);
    return <UserNoteModel[]>(
      await axios({
        method: "GET",
        url: this.getUserNotesByUserIdUrl(loginResponse.user.id),
        headers: {
          Authorization: `${loginResponse.token_type} ${loginResponse.access_token}`,
        },
      })
    ).data;
  }
}
