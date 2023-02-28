import test from "@playwright/test";
import { LoginWebApp } from "../login-webapp";
import { getUserStepTitle } from "../../test-factory-utils/user-step";

export class LoginTasks {
  loginWebApp: LoginWebApp;

  userStep: Function;

  constructor(loginWebApp: LoginWebApp, userName?: string) {
    this.loginWebApp = loginWebApp;
    this.userStep = getUserStepTitle(userName);
  }

  async login(email: string, password: string, rememberPassword?: boolean) {
    const stepTitle = this.userStep(
      `login with email '${email}' and password '***'`
    );
    await test.step(stepTitle, async () => {
      await this.loginWebApp.onLoginView.open();
      await this.loginWebApp.onLoginView.emailInput.fill(email);
      await this.loginWebApp.onLoginView.emailInput.expectToHaveValue(email);
      await this.loginWebApp.onLoginView.passwordInput.fill(password);
      await this.loginWebApp.onLoginView.passwordInput.expectToHaveValue(
        password
      );
      if (rememberPassword) {
        await this.loginWebApp.onLoginView.rememberMeCheckbox.click();
        await this.loginWebApp.onLoginView.rememberMeCheckbox.expectToBeChecked();
      }
      await this.loginWebApp.onLoginView.loginSubmitButton.click();
      await this.loginWebApp.onLoginView.expectToNotBeOpen();
      await this.loginWebApp.onTopbar.userNameLabel.expectToHaveText(email);
    });
  }
}
