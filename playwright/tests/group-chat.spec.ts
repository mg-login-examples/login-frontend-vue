// import { expect } from "@playwright/test";

import { test } from "../fixtures/test-with-user-fixtures";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("Join and leave chat room", async ({ loginWebAppUserFactory }) => {
  const user1 = await loginWebAppUserFactory.getRandomUser();
  // await delay(10_000);
  await user1.login();
  await user1.onGroupChatView.open();
  await user1.withGroupChatTask.enterChatRoom("secret meeting");
  await user1.onGroupChatView.chatRoomTitle.expectToBeVisible();
  await user1.onGroupChatView.roomNameInput.expectToBeHidden();

  await user1.onGroupChatView.leaveRoomButton.click();
  await user1.onGroupChatView.chatRoomTitle.expectToBeHidden();
  await user1.onGroupChatView.roomNameInput.expectToBeVisible();
});

test("Send and receive messages in a group chat", async ({
  loginWebAppUserFactory,
}) => {
  const user1 = await loginWebAppUserFactory.getRandomUser();
  await user1.login();
  await user1.onGroupChatView.open();
  await user1.withGroupChatTask.enterChatRoom("secret meeting");

  const user2 = await loginWebAppUserFactory.getRandomUser();
  await user2.login();
  await user2.onGroupChatView.open();
  await user2.withGroupChatTask.enterChatRoom("secret meeting");

  const chatMessage1 = "what's up peeps?";
  await user1.withGroupChatTask.sendMessage(chatMessage1, user1.email);
  await user2.onGroupChatView
    .messageWithUser(chatMessage1, user1.email)
    .expectToBeVisible();

  const chatMessage2 = `Yo ${user1.name}! Nice to see you`;
  await user2.withGroupChatTask.sendMessage(chatMessage2, user2.email);
  await user1.onGroupChatView
    .messageWithUser(chatMessage2, user2.email)
    .expectToBeVisible();

  await delay(10_000);
});
