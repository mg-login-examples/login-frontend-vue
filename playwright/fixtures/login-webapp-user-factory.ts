import { Browser } from '@playwright/test'
import casual from 'casual'

import DataSetterHelpers from '../data-helpers/data-setter.helpers'
import { LoginWebAppUser } from '../login-webapp/login-webapp-user'

export class LoginWebAppUserFactory {
  browser: Browser
  users: LoginWebAppUser[] = []

  constructor(browser: Browser) {
    this.browser = browser
  }

  async getUser(name: string, email: string, password: string) {
    await DataSetterHelpers.createUserIfNoUserExists(email, password)
    const browserContext = await this.browser.newContext({})
    const page = await browserContext.newPage()
    const newUser = new LoginWebAppUser(name, email, password, page)
    this.users.push(newUser)
    return newUser
  }

  async getRandomUser() {
    const randomEmail = casual.email.toLowerCase()
    const randomPasssword = casual.password
    const userName = randomEmail
    await DataSetterHelpers.createUserIfNoUserExists(randomEmail, randomPasssword)
    const browserContext = await this.browser.newContext()
    const page = await browserContext.newPage()
    const newUser = new LoginWebAppUser(userName, randomEmail, randomPasssword, page)
    this.users.push(newUser)
    return newUser
  }
}
