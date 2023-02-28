import { Page } from "@playwright/test";
import { GroupChatTasks } from "./screen-tasks/group-chat.tasks";
import { LoginTasks } from "./screen-tasks/login.tasks";
import { GroupChatViewScreen } from "./screens/group-chat-view.screen";
import { LoginViewScreen } from "./screens/login-view.screen";
import { TopbarScreen } from "./screens/topbar.screen";

export class LoginWebApp {
  readonly page: Page;

  readonly onLoginView: LoginViewScreen;
  readonly onTopbar: TopbarScreen;
  readonly onGroupChatView: GroupChatViewScreen;

  readonly withLoginTask: LoginTasks;
  readonly withGroupChatTask: GroupChatTasks;

  constructor(page: Page, userName?: string) {
    this.page = page;

    // Screens
    this.onLoginView = new LoginViewScreen(page, userName);
    this.onTopbar = new TopbarScreen(page, userName);
    this.onGroupChatView = new GroupChatViewScreen(page, userName);

    // Tasks
    this.withLoginTask = new LoginTasks(this);
    this.withGroupChatTask = new GroupChatTasks(this);
  }
}
