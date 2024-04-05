import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor'

import TopbarPage from '../pageObjects/topbar.page'

Given('I have logged out', () => {
  TopbarPage.clickOnLogoutButton()
  TopbarPage.assertLoginButtonIsVisible()
})

When('I click on logout button', () => {
  TopbarPage.clickOnLogoutButton()
})

Then('logout button is displayed on topbar', () => {
  TopbarPage.assertLogoutButtonIsVisible()
})

Then('logout button is not displayed on topbar', () => {
  TopbarPage.assertLogoutButtonIsNotVisible()
})
