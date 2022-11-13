import * as Vue from "vue";
import { describe, expect, it, vi } from "vitest";

import { useUserStore } from "@/store/user";
import { useWebSocketStore } from "@/store/webSocket";
import { fakeUser } from "@/__mocks__/data/users";
import { createTestingPinia } from "@pinia/testing";
import { connectDisconnectSocketOnUserLogin } from "../manage-socket-on-user-change";

describe("utils > webSocketUtils > connectDisconnectSocketOnUserLogin", () => {
  it("calls webSocketStore reconnect method when user is set in userStore ", async () => {
    // init stores
    createTestingPinia({ createSpy: vi.fn });
    const userStore = useUserStore();
    const webSocketStore = useWebSocketStore();
    // assert reconnect socket method not called
    expect(webSocketStore.reconnectSocket).not.toBeCalled();
    // call method to setup listener to reconnect on user login and disconnect on logout
    connectDisconnectSocketOnUserLogin();
    // mock user login
    userStore.user = fakeUser;
    // wait for userStore subscribe callback to be triggered
    await Vue.nextTick();
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(webSocketStore.reconnectSocket).toBeCalledTimes(1);
  });

  it("calls webSocketStore disconnect method when user is unset in userStore ", async () => {
    // init stores
    createTestingPinia({ createSpy: vi.fn });
    const userStore = useUserStore();
    userStore.user = fakeUser;
    const webSocketStore = useWebSocketStore();
    // assert reconnect socket method not called
    expect(webSocketStore.reconnectSocket).not.toBeCalled();
    // call method to setup listener to reconnect on user login and disconnect on logout
    connectDisconnectSocketOnUserLogin();
    // mock user login
    userStore.user = null;
    // wait for userStore subscribe callback to be triggered
    await Vue.nextTick();
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(webSocketStore.disconnectSocketIfConnected).toBeCalledTimes(1);
  });
});
