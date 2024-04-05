// example.spec.ts
import { test as base } from '@playwright/test'
import { LoginWebAppUserFactory } from './login-webapp-user-factory'

type MyFixtures = {
  loginWebAppUserFactory: LoginWebAppUserFactory
  userScreenshots: void
}

// Extend basic test by providing a "todoPage" fixture.
export const test = base.extend<MyFixtures>({
  loginWebAppUserFactory: async ({ browser }, use) => {
    const loginWebAppUserFactory = new LoginWebAppUserFactory(browser)
    await use(loginWebAppUserFactory)
  },
  userScreenshots: [
    async ({ loginWebAppUserFactory }, use, testinfo) => {
      await use()
      if (testinfo.error) {
        for (const user of loginWebAppUserFactory.users) {
          await testinfo.attach(`${user.name}-screenshot`, {
            body: await user.page.screenshot(),
            contentType: 'image/png'
          })
        }
      }
    },
    { auto: true }
  ]
})
