export default class TopbarPage {
  static readonly allQuotesLink = "[data-test='topbar--all-quotes-link']"
  static readonly myQuotesLink = "[data-test='topbar--user-quotes-link']"
  static readonly myNotesLink = "[data-test='topbar--user-notes-link']"
  static readonly groupChatLink = "[data-test='topbar--group-chat-link']"
  static readonly loginLink = "[data-test='topbar--login-link']"
  static readonly logoutButton = "[data-test='topbar--logout-button']"
  static readonly userNameLabel = "[data-test='topbar--user-name']"

  static clickOnAllQuotesLink() {
    cy.get(this.allQuotesLink).click()
  }
  static asserAllQuotesLinkIsActive() {
    cy.get(this.allQuotesLink).should('have.class', 'router-link-active')
  }
  static clickOnMyQuotesLink() {
    cy.get(this.myQuotesLink).click()
  }
  static asserMyQuotesLinkIsActive() {
    cy.get(this.myQuotesLink).should('have.class', 'router-link-active')
  }
  static asserMyQuotesLinkIsNotActive() {
    cy.get(this.myQuotesLink).should('not.have.class', 'router-link-active')
  }
  static clickOnMyNotesLink() {
    cy.get(this.myNotesLink).click()
  }
  static asserMyNotesLinkIsActive() {
    cy.get(this.myNotesLink).should('have.class', 'router-link-active', {
      timeout: 100000
    })
  }
  static clickOnGroupChatLink() {
    cy.get(this.groupChatLink).click()
  }
  static assertGroupChatLinkIsActive() {
    cy.get(this.groupChatLink).should('have.class', 'router-link-active')
  }
  static clickOnLoginButton() {
    cy.get(this.loginLink).click()
  }
  static assertLoginButtonIsVisible() {
    cy.get(this.loginLink).should('be.visible')
  }
  static assertLoginButtonIsNotVisible() {
    cy.get(this.loginLink).should('not.exist')
  }
  static clickOnLogoutButton() {
    cy.get(this.logoutButton).click()
  }
  static assertLogoutButtonIsVisible() {
    cy.get(this.logoutButton).should('be.visible')
  }
  static assertLogoutButtonIsNotVisible() {
    cy.get(this.logoutButton).should('not.exist')
  }
  static assertUserIsVisible() {
    cy.get(this.userNameLabel).should('be.visible')
  }
}
