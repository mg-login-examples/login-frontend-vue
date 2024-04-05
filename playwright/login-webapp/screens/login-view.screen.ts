import test, { expect, Page } from '@playwright/test'
import { InteractiveWebElement } from '../../test-factory-utils/interactive-web-element'
import { userStepTitle } from '../../test-factory-utils/user-step'

export class LoginViewScreen {
  readonly page: Page
  readonly userName: string | undefined

  static emailInputName = 'Email Input'
  static emailInputSelector = "[data-test='login--user-email-input']"
  emailInput: InteractiveWebElement

  static passwordInputName = 'Password Input'
  static passwordInputSelector = "[data-test='login--user-password-input']"
  passwordInput: InteractiveWebElement

  static loginSubmitButtonName = 'Login Submit Button'
  static loginSubmitButtonSelector = "[data-test='login--submit-button']"
  loginSubmitButton: InteractiveWebElement

  static rememberMeCheckboxName = 'Login Submit Button'
  static rememberMeCheckboxSelector = "[data-test='login--remember-me-checkbox']"
  rememberMeCheckbox: InteractiveWebElement

  static loginShowPasswordButtonName = 'Login Show Password Button'
  static loginShowPasswordButtonSelector = "[data-test='login--show-password-button']"
  loginShowPasswordButton: InteractiveWebElement

  static loginShowPasswordButtonIconName = 'Login Show Password Button'
  static loginShowPasswordButtonIconSelector = "[data-test='login--show-password-button'] svg"
  loginShowPasswordButtonIcon: InteractiveWebElement

  constructor(page: Page, userName?: string) {
    this.page = page
    this.userName = userName

    this.emailInput = new InteractiveWebElement(
      LoginViewScreen.emailInputName,
      LoginViewScreen.emailInputSelector,
      page,
      userName
    )

    this.passwordInput = new InteractiveWebElement(
      LoginViewScreen.passwordInputName,
      LoginViewScreen.passwordInputSelector,
      page,
      userName
    )

    this.loginSubmitButton = new InteractiveWebElement(
      LoginViewScreen.loginSubmitButtonName,
      LoginViewScreen.loginSubmitButtonSelector,
      page,
      userName
    )

    this.rememberMeCheckbox = new InteractiveWebElement(
      LoginViewScreen.rememberMeCheckboxName,
      LoginViewScreen.rememberMeCheckboxSelector,
      page,
      userName
    )

    this.loginShowPasswordButton = new InteractiveWebElement(
      LoginViewScreen.loginShowPasswordButtonName,
      LoginViewScreen.loginShowPasswordButtonSelector,
      page,
      userName
    )

    this.loginShowPasswordButton = new InteractiveWebElement(
      LoginViewScreen.loginShowPasswordButtonName,
      LoginViewScreen.loginShowPasswordButtonSelector,
      page,
      userName
    )
  }

  async open() {
    const loginUrl = '/login'
    const stepTitle = userStepTitle(`Open login page'`, this.userName)
    await test.step(stepTitle, async () => {
      this.page.goto(loginUrl)
      expect(this.page).toHaveURL(loginUrl)
    })
  }

  async expectToNotBeOpen() {
    const loginUrl = '/login'
    const stepTitle = userStepTitle(`Expect login page to not be open`, this.userName)
    await test.step(stepTitle, async () => {
      await expect(async () => {
        expect(this.page).not.toHaveURL(loginUrl)
      }).toPass({
        timeout: 10_000
      })
    })
  }
}
