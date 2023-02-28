import { Page } from "@playwright/test";
import { InteractiveWebElement } from "../../test-factory-utils/interactive-web-element";

export class TopbarScreen {
  readonly page: Page;
  readonly userName: string | undefined;

  static allQuotesLinkName = "All Quotes Link";
  static allQuotesLinkSelector = "[data-test='topbar--all-quotes-link']";
  allQuotesLink: InteractiveWebElement;

  static myQuotesLinkName = "My Quotes Link";
  static myQuotesLinkSelector = "[data-test='topbar--user-quotes-link']";
  myQuotesLink: InteractiveWebElement;

  static myNotesLinkName = "My Notes Link";
  static myNotesLinkSelector = "[data-test='topbar--user-notes-link']";
  myNotesLink: InteractiveWebElement;

  static groupChatLinkName = "Group Chat Link";
  static groupChatLinkSelector = "[data-test='topbar--group-chat-link']";
  groupChatLink: InteractiveWebElement;

  static loginLinkName = "Login Link";
  static loginLinkSelector = "[data-test='topbar--login-link']";
  loginLink: InteractiveWebElement;

  static logoutButtonName = "Logout Button";
  static logoutButtonSelector = "[data-test='topbar--logout-button']";
  logoutButton: InteractiveWebElement;

  static userNameLabelName = "User Name Label";
  static userNameLabelSelector = "[data-test='topbar--user-name']";
  userNameLabel: InteractiveWebElement;

  constructor(page: Page, userName?: string) {
    this.page = page;
    this.userName = userName;

    this.allQuotesLink = new InteractiveWebElement(
      TopbarScreen.allQuotesLinkName,
      TopbarScreen.allQuotesLinkSelector,
      page,
      userName
    );

    this.myQuotesLink = new InteractiveWebElement(
      TopbarScreen.myQuotesLinkName,
      TopbarScreen.myQuotesLinkSelector,
      page,
      userName
    );

    this.myNotesLink = new InteractiveWebElement(
      TopbarScreen.myNotesLinkName,
      TopbarScreen.myNotesLinkSelector,
      page,
      userName
    );

    this.groupChatLink = new InteractiveWebElement(
      TopbarScreen.groupChatLinkName,
      TopbarScreen.groupChatLinkSelector,
      page,
      userName
    );

    this.loginLink = new InteractiveWebElement(
      TopbarScreen.loginLinkName,
      TopbarScreen.loginLinkSelector,
      page,
      userName
    );

    this.logoutButton = new InteractiveWebElement(
      TopbarScreen.logoutButtonName,
      TopbarScreen.logoutButtonSelector,
      page,
      userName
    );

    this.userNameLabel = new InteractiveWebElement(
      TopbarScreen.userNameLabelName,
      TopbarScreen.userNameLabelSelector,
      page,
      userName
    );
  }
}
