import { test, Page, expect } from "@playwright/test";
import { InteractiveWebElement } from "../../test-factory-utils/interactive-web-element";
import { userStepTitle } from "../../test-factory-utils/user-step";

export class GroupChatViewScreen {
  readonly page: Page;
  readonly userName: string | undefined;

  static roomNameInputName = "Room Name Input";
  static roomNameInputSelector = "[data-test='group-chat--room-input']";
  roomNameInput: InteractiveWebElement;

  static enterRoomNameButtonName = "Submit Room Name Button";
  static enterRoomNameButtonSelector =
    "[data-test='group-chat--enter-room-button']";
  enterRoomNameButton: InteractiveWebElement;

  static chatRoomTitleName = "Chat Room Name";
  static chatRoomTitleSelector = "[data-test='group-chat--room-name']";
  chatRoomTitle: InteractiveWebElement;

  static chatMessageInputName = "Chat Message Input";
  static chatMessageInputSelector = "[data-test='group-chat--message-input']";
  chatMessageInput: InteractiveWebElement;

  static sendMessageButtonName = "Send Message Button";
  static sendMessageButtonSelector =
    "[data-test='group-chat--send-message-button']";
  sendMessageButton: InteractiveWebElement;

  static messageWithUserName = (messageText: string, messageUser: string) => {
    return `Message '${messageText}' from user '${messageUser}'`;
  };
  static messageWithUserSelector = (
    messageText: string,
    messageUser: string
  ) => {
    return `xpath=//*[@data-test="group-chat--message-container" and descendant::*[@data-test="group-chat--message-text" and text()="${messageText}"] and descendant::*[@data-test="group-chat--message-user" and text()="${messageUser}"]]`;
  };
  messageWithUser: (
    messageText: string,
    messageUser: string
  ) => InteractiveWebElement;

  static leaveRoomButtonName = "Leave Room Button";
  static leaveRoomButtonSelector =
    "[data-test='group-chat--leave-room-button']";
  leaveRoomButton: InteractiveWebElement;

  constructor(page: Page, userName?: string) {
    this.page = page;
    this.userName = userName;

    this.roomNameInput = new InteractiveWebElement(
      GroupChatViewScreen.roomNameInputName,
      GroupChatViewScreen.roomNameInputSelector,
      page,
      userName
    );

    this.enterRoomNameButton = new InteractiveWebElement(
      GroupChatViewScreen.enterRoomNameButtonName,
      GroupChatViewScreen.enterRoomNameButtonSelector,
      page,
      userName
    );

    this.chatRoomTitle = new InteractiveWebElement(
      GroupChatViewScreen.chatRoomTitleName,
      GroupChatViewScreen.chatRoomTitleSelector,
      page,
      userName
    );

    this.chatMessageInput = new InteractiveWebElement(
      GroupChatViewScreen.chatMessageInputName,
      GroupChatViewScreen.chatMessageInputSelector,
      page,
      userName
    );

    this.sendMessageButton = new InteractiveWebElement(
      GroupChatViewScreen.sendMessageButtonName,
      GroupChatViewScreen.sendMessageButtonSelector,
      page,
      userName
    );

    this.messageWithUser = (messageText: string, messageUser: string) => {
      return new InteractiveWebElement(
        GroupChatViewScreen.messageWithUserName(messageText, messageUser),
        GroupChatViewScreen.messageWithUserSelector(messageText, messageUser),
        page,
        userName
      );
    };

    this.leaveRoomButton = new InteractiveWebElement(
      GroupChatViewScreen.leaveRoomButtonName,
      GroupChatViewScreen.leaveRoomButtonSelector,
      page,
      userName
    );
  }

  async open() {
    const groupChatUrl = "/group-chat";
    const stepTitle = userStepTitle(`Open group chat page'`, this.userName);
    await test.step(stepTitle, async () => {
      this.page.goto(groupChatUrl);
      expect(this.page).toHaveURL(groupChatUrl);
    });
  }
}
