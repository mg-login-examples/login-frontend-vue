@notes-feature
Feature: Notes

  Scenario: View my notes
    Given I am logged in as a user with email "my_notes_test@fakemail.com" and password "12345678"
    And user with email "my_notes_test@fakemail.com" and password "12345678" has at least 2 notes
    When I click on my notes button in topbar
    And I see in my notes list 2 notes with titles "webpage > user notes > view note 1" and "webpage > user notes > view note 2"
    When I click on note with title "webpage > user notes > view note 1"
    Then the note with title "webpage > user notes > view note 1" is opened
    When I click on note with title "webpage > user notes > view note 2"
    Then the note with title "webpage > user notes > view note 2" is opened

  @defaultCommandTimeout(100000)
  Scenario: Create a note
    Given I am logged in as a user with email "create_notes_test@fakemail.com" and password "12345678"
    And I open my notes view
    When I click on create a new note button
    Then a new empty note is opened
    When I enter the note title "random > user notes > create note"
    And I enter the note text "guitar vs piano"
    And I click on save note button
    Then I see the note with title "random > user notes > create note" in my notes list

  Scenario: Edit an existing note
    Given I am logged in as a user with email "edit_notes_test@fakemail.com" and password "12345678"
    And user with email "edit_notes_test@fakemail.com" and password "12345678" has at least 2 notes
    When I click on my notes button in topbar
    And I see in my notes list 2 notes with titles "webpage > user notes > edit note 1" and "webpage > user notes > edit note 2"
    When I click on note with title "webpage > user notes > edit note 1"
    Then the note with title "webpage > user notes > edit note 1" is opened
    When I enter the note title "random > user notes > edit note"
    And I enter the note text "tasks to do - grocery, coursera"
    And I click on save note button
    Then I see the note with title "random > user notes > edit note" in my notes list
    And I do not see the note with title "webpage > user notes > edit note 1" in my notes list
