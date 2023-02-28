import { Page } from "@playwright/test";
import { LoginWebApp } from "./login-webapp";

export class LoginWebAppUser extends LoginWebApp {
  name: string;
  email: string;
  readonly password: string;

  constructor(name: string, email: string, password: string, page: Page) {
    super(page, name);
    this.name = name;
    this.email = email;
    this.password = password;
  }

  async login(rememberMe?: boolean) {
    await this.withLoginTask.login(this.email, this.password, rememberMe);
  }
}
