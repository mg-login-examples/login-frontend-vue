import test from "@playwright/test";
import { LoginWebApp } from "../login-webapp";
import { getUserStepTitle } from "../../test-factory-utils/user-step";

export class GroupChatTasks {
  loginWebApp: LoginWebApp;

  userStep: Function;

  constructor(loginWebApp: LoginWebApp, userName?: string) {
    this.loginWebApp = loginWebApp;
    this.userStep = getUserStepTitle(userName);
  }

  async enterChatRoom(roomName: string) {
    const stepTitle = this.userStep(`Enter chat room with name '${roomName}'`);
    await test.step(stepTitle, async () => {
      await this.loginWebApp.onGroupChatView.roomNameInput.fill(roomName);
      await this.loginWebApp.onGroupChatView.roomNameInput.expectToHaveValue(
        roomName
      );
      await this.loginWebApp.onGroupChatView.enterRoomNameButton.click();
      await this.loginWebApp.onGroupChatView.chatRoomTitle.expectToHaveText(
        roomName
      );
    });
  }

  async sendMessage(chatMessage: string, senderName: string) {
    const stepTitle = this.userStep(`Send chat room message '${chatMessage}'`);
    await test.step(stepTitle, async () => {
      await this.loginWebApp.onGroupChatView.chatMessageInput.fill(chatMessage);
      await this.loginWebApp.onGroupChatView.chatMessageInput.expectToHaveValue(
        chatMessage
      );
      await this.loginWebApp.onGroupChatView.sendMessageButton.click();
      await this.loginWebApp.onGroupChatView.chatMessageInput.expectToHaveValue(
        ""
      );
      await this.loginWebApp.onGroupChatView
        .messageWithUser(chatMessage, senderName)
        .expectToBeVisible();
    });
  }
}
