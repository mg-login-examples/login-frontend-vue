import { setValueInStore } from '../testDataStore/store'

export default class MyNotesPage {
  static readonly urlPath = '/user-notes'

  static readonly pageLoading = "[data-test='app--connecting']"
  static readonly createNoteButton = "[data-test='notes--notes-list--create-note-button']"
  static readonly noteItem = "[data-test='notes--notes-list-note-item']"
  static readonly openNoteTitle = "[data-test='notes--open-note--title']"
  static readonly openNoteText = "[data-test='notes--open-note--text']"
  static readonly saveOpenNoteButton = "[data-test='notes--open-note--save-note-button']"

  static open() {
    cy.visit(`${this.urlPath}`)
  }

  static assertIsOpen() {
    cy.get(this.pageLoading).should('not.exist')
    cy.url().should('eq', Cypress.config().baseUrl + this.urlPath)
  }

  static goToMyNotesPage() {
    this.open()
    this.assertIsOpen()
  }

  static assertSomeNoteIsVisibleInyMyNotesList() {
    cy.get(this.noteItem).should('be.visible')
  }

  static clickOnCreateNoteButton() {
    cy.get(this.createNoteButton).click()
  }

  static assertNoteWithTitleIsVisibleInMyNotesList(noteTitle: string) {
    cy.get(this.noteItem).contains(noteTitle).should('be.visible')
  }

  static assertNoteWithTitleIsNotVisibleInMyNotesList(noteTitle: string) {
    cy.get(this.noteItem).contains(noteTitle).should('not.exist')
  }

  static clickOnNoteWithTitleInMyNotesList(noteTitle: string) {
    cy.get(this.noteItem).contains(noteTitle).click()
  }

  static setInStoreTitleOfFirst2Notes(storeKey1: string, storeKey2: string) {
    cy.get(this.noteItem).then((jqueryEl) => {
      setValueInStore(storeKey1, jqueryEl[0].innerText)
      setValueInStore(storeKey2, jqueryEl[1].innerText)
    })
  }

  static assertNoteWithTitleIsOpen(noteTitle: string) {
    cy.get(this.openNoteTitle).should('have.value', noteTitle)
  }

  static assertNoteHasText(noteText: string) {
    cy.get(this.openNoteText).should('have.value', noteText)
  }

  static enterNoteTitle(noteTitle: string) {
    cy.get(this.openNoteTitle)
      .clear()
      .should('have.value', '')
      .type(noteTitle)
      .should('have.value', noteTitle)
  }

  static enterNoteText(noteText: string) {
    cy.get(this.openNoteText)
      .clear()
      .should('have.value', '')
      .type(noteText)
      .should('have.value', noteText)
  }

  static clickOnSaveNoteButton() {
    cy.get(this.saveOpenNoteButton).click()
  }
}
