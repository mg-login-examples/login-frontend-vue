import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

import { getValueFromStore } from '../testDataStore/store'
import MyNotesPage from '../pageObjects/my-notes.page'
import TopbarPage from '../pageObjects/topbar.page'

When('I open my notes view', () => {
  MyNotesPage.goToMyNotesPage()
  TopbarPage.asserMyNotesLinkIsActive()
})

When('I try to open my notes view', () => {
  MyNotesPage.open()
})

When('I click on my notes button in topbar', () => {
  TopbarPage.clickOnMyNotesLink()
})

Then('I am redirected to My Notes page', () => {
  MyNotesPage.assertIsOpen()
})

// Extracts value from webpage
Then(
  'I see in my notes list 2 notes with titles {string} and {string}',
  (note1TitleStoreKey: string, note2TitleStoreKey: string) => {
    MyNotesPage.setInStoreTitleOfFirst2Notes(note1TitleStoreKey, note2TitleStoreKey)
  }
)

// Uses store value
Then('I see the note with title {string} in my notes list', (noteTitle: string) => {
  noteTitle = getValueFromStore(noteTitle)
  MyNotesPage.assertNoteWithTitleIsVisibleInMyNotesList(noteTitle)
})

// Uses store value
Then('I do not see the note with title {string} in my notes list', (noteTitle: string) => {
  noteTitle = getValueFromStore(noteTitle)
  MyNotesPage.assertNoteWithTitleIsNotVisibleInMyNotesList(noteTitle)
})

// Uses store value
When('I click on note with title {string}', (noteTitle: string) => {
  noteTitle = getValueFromStore(noteTitle)
  MyNotesPage.clickOnNoteWithTitleInMyNotesList(noteTitle)
})

// Uses store value
When('the note with title {string} is opened', (noteTitle: string) => {
  noteTitle = getValueFromStore(noteTitle)
  MyNotesPage.assertNoteWithTitleIsOpen(noteTitle)
})

When('I click on create a new note button', () => {
  MyNotesPage.clickOnCreateNoteButton()
})

When('a new empty note is opened', () => {
  MyNotesPage.assertNoteWithTitleIsOpen('')
  MyNotesPage.assertNoteHasText('')
})

// Uses store value
When('I enter the note title {string}', (noteTitle: string) => {
  noteTitle = getValueFromStore(noteTitle)
  MyNotesPage.enterNoteTitle(noteTitle)
})

When('I enter the note text {string}', (noteText: string) => {
  MyNotesPage.enterNoteText(noteText)
})

When('I click on save note button', () => {
  MyNotesPage.clickOnSaveNoteButton()
})
