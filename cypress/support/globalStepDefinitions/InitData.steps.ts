import { Before, Given } from '@badeball/cypress-cucumber-preprocessor'

import CyDataSetterHelpers from '../dataHelpers/cy-data-setter.helpers'
import { getValueFromStore } from '../testDataStore/store'

Before(() => {
  cy.visit('/')
  cy.clearCookies()
  cy.reload()
})

Given(
  'a user with email {string} and password {string} exists',
  (email: string, password: string) => {
    CyDataSetterHelpers.createUserIfNoUserExists(email, password)
  }
)

Given(
  'an invalid user login with email {string} and password {string}',
  (email: string, password: string) => {
    CyDataSetterHelpers.assertLoginInvalid(email, password)
  }
)

// Uses external value
Given(
  'no user with email {string} and password {string} exists',
  (email: string, password: string) => {
    email = getValueFromStore(email)
    CyDataSetterHelpers.deleteUserIfUserExists(email, password)
  }
)

Given('a quote exists', () => {
  CyDataSetterHelpers.createAQuoteIfNoQuoteExists()
})

Given(
  'user with email {string} and password {string} has written a quote',
  (email: string, password: string) => {
    CyDataSetterHelpers.createUserQuoteIfNoQuoteExists(email, password)
  }
)

Given(
  'user with email {string} and password {string} has at least 2 notes',
  (email: string, password: string) => {
    CyDataSetterHelpers.create2UserNotesIfAtLeast2NotesDoNotExists(email, password)
  }
)
