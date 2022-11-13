import { createTestingPinia, type TestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import * as Vue from "vue";

import GroupChat from "@/views/GroupChat.vue";
import { useWebSocketStore } from "@/store/webSocket";
import type { Emitter } from "mitt";
import type { SocketEvents } from "@/models/socket-event-emitter.type";
import type { SocketReceiveChannelSubscriptionStatus } from "@/models/socket-receive-channel-subscription-status.model";

const selectors = {
  roomInput: "[data-test='group-chat--room-input']",
  enterRoomButton: "[data-test='group-chat--enter-room-button']",
  chatRoomTitle: "[data-test='group-chat--room-name']",
  chatBox: "[data-test='group-chat--chat-container']",
  chatMessageContainer: "[data-test='group-chat--message-container']",
  chatMessageText: "[data-test='group-chat--message-text']",
  chatMessageUser: "[data-test='group-chat--message-user']",
  messageInput: "[data-test='group-chat--message-input']",
  sendMessageButton: "[data-test='group-chat--send-message-button']",
  leaveRoomButton: "[data-test='group-chat--leave-room-button']",
};

let testPinia: TestingPinia;

describe("views > GroupChat.vue", () => {
  beforeEach(() => {
    testPinia = createTestingPinia({ createSpy: vi.fn });
  });

  it("subscribes to room chat entry / exit events on component init", () => {
    // Mock websocket store
    const webSocketStore = useWebSocketStore();
    webSocketStore.socketManager = {
      socket: vi.fn() as any as WebSocket,
      socketEventEmitter: { on: vi.fn() } as any as Emitter<SocketEvents>,
    };
    // open groupchat view
    mount(GroupChat, {
      global: {
        plugins: [testPinia],
        stubs: { FontAwesomeIcon: true },
      },
    });
    // assert 'channelSubscriptionStatus' event listener added on component start to handle chat room entry / exit
    expect(webSocketStore.socketManager?.socketEventEmitter.on).toBeCalledWith(
      "channelSubscriptionStatus",
      expect.anything()
    );
    expect(webSocketStore.socketManager?.socketEventEmitter.on).toBeCalledTimes(
      1
    );
  });

  it("requests chat room entry based on user entered room input", async () => {
    // init test values
    const chatRoomName = "my chat room";
    const channelName = `group-chat/${chatRoomName}`;
    // Mock websocket store
    const webSocketStore = useWebSocketStore();
    webSocketStore.socketManager = {
      socket: vi.fn() as any as WebSocket,
      socketEventEmitter: { on: vi.fn() } as any as Emitter<SocketEvents>,
    };
    // open groupchat view
    const wrapper = mount(GroupChat, {
      global: {
        plugins: [testPinia],
        stubs: { FontAwesomeIcon: true },
      },
    });
    // assert room input is visible
    expect(wrapper.find(selectors.roomInput).isVisible()).toBe(true);
    // enter chat room name
    wrapper.find(selectors.roomInput).setValue(chatRoomName);
    expect(
      (wrapper.find(selectors.roomInput).element as HTMLInputElement).value
    ).toBe(chatRoomName);
    // request chat room entry
    await wrapper.find(selectors.enterRoomButton).trigger("click");
    // assert request to enter room has been sent
    expect(webSocketStore.subscribeToChannel).toHaveBeenCalledWith(
      channelName
    );
  });

  it("enter chat room when channel subscribed successfully message is received", async () => {
    // init test values
    const chatRoomName = "my chat room";
    const channelName = `group-chat/${chatRoomName}`;
    // Mock websocket store
    const webSocketStore = useWebSocketStore();
    webSocketStore.socketManager = {
      socket: vi.fn() as any as WebSocket,
      socketEventEmitter: { on: vi.fn() } as any as Emitter<SocketEvents>,
    };
    // open groupchat view
    const wrapper = mount(GroupChat, {
      global: {
        plugins: [testPinia],
        stubs: { FontAwesomeIcon: true },
      },
    });
    // assert not inside any chat room
    expect(wrapper.find(selectors.chatRoomTitle).exists()).toBe(false);
    expect(wrapper.find(selectors.chatBox).exists()).toBe(false);
    // enter chat room name (required)
    wrapper.find(selectors.roomInput).setValue(chatRoomName);
    expect(
      (wrapper.find(selectors.roomInput).element as HTMLInputElement).value
    ).toBe(chatRoomName);
    // mock room entry request granted message
    // retrieve callback to handle chat room subscription messages
    const callBack = (
      webSocketStore.socketManager?.socketEventEmitter.on as Mock
    ).mock.calls[0][1];
    const chatRoomSubscribeMessage: SocketReceiveChannelSubscriptionStatus = {
      channel: channelName,
      subscribed: true,
    };
    // trigger callback to mock subscription successful message sent by server
    callBack(chatRoomSubscribeMessage);
    await Vue.nextTick();
    // assert entered chat room
    expect(wrapper.find(selectors.chatRoomTitle).text()).toBe(chatRoomName);
    expect(wrapper.find(selectors.chatBox).isVisible()).toBe(true);
    // assert started listening to incomming chat room messages
    expect(
      webSocketStore.socketManager?.socketEventEmitter.on
    ).toHaveBeenCalledWith(
      "channelMessage",
      (wrapper.vm as any).handleChatRoomIncommingMessages
    );
  });

  it("requests chat room exit when leave chat button is clicked", async () => {
    // init test values
    const chatRoomName = "my chat room";
    const channelName = `group-chat/${chatRoomName}`;
    // Mock websocket store
    const webSocketStore = useWebSocketStore();
    webSocketStore.socketManager = {
      socket: vi.fn() as any as WebSocket,
      socketEventEmitter: {
        off: vi.fn(),
        on: vi.fn(),
      } as any as Emitter<SocketEvents>,
    };
    // open groupchat view
    const wrapper = mount(GroupChat, {
      global: {
        plugins: [testPinia],
        stubs: { FontAwesomeIcon: true },
      },
    });
    (wrapper.vm as any).chatName = chatRoomName;
    (wrapper.vm as any).chatEntered = true;
    await Vue.nextTick();
    // assert inside chat room
    expect(wrapper.find(selectors.chatRoomTitle).text()).toBe(chatRoomName);
    expect(wrapper.find(selectors.chatBox).isVisible()).toBe(true);
    // click on leave chat room
    await wrapper.find(selectors.leaveRoomButton).trigger("click");
    // assert request to unsubscribe from chat has been sent
    expect(webSocketStore.unsubscribeFromChannel).toHaveBeenCalledWith(
      channelName
    );
  });

  it("exit chat room when channel unsubscribed successfully message is received", async () => {
    // init test values
    const chatRoomName = "my chat room";
    const channelName = `group-chat/${chatRoomName}`;
    // Mock websocket store
    const webSocketStore = useWebSocketStore();
    webSocketStore.socketManager = {
      socket: vi.fn() as any as WebSocket,
      socketEventEmitter: {
        off: vi.fn(),
        on: vi.fn(),
      } as any as Emitter<SocketEvents>,
    };
    // open groupchat view
    const wrapper = mount(GroupChat, {
      global: {
        plugins: [testPinia],
        stubs: { FontAwesomeIcon: true },
      },
    });
    (wrapper.vm as any).chatName = chatRoomName;
    (wrapper.vm as any).chatEntered = true;
    await Vue.nextTick();
    // assert inside chat room
    expect(wrapper.find(selectors.chatRoomTitle).text()).toBe(chatRoomName);
    expect(wrapper.find(selectors.chatBox).isVisible()).toBe(true);
    // mock room entry request granted message
    // retrieve callback to handle chat room subscription messages
    const callBack = (
      webSocketStore.socketManager?.socketEventEmitter.on as Mock
    ).mock.calls[0][1];
    const chatRoomUnsubscribeMessage: SocketReceiveChannelSubscriptionStatus = {
      channel: channelName,
      subscribed: false,
    };
    // trigger callback to mock subscription successful message sent by server
    callBack(chatRoomUnsubscribeMessage);
    await Vue.nextTick();
    // assert outside chat room
    expect(wrapper.find(selectors.roomInput).isVisible()).toBe(true);
    expect(wrapper.find(selectors.chatRoomTitle).exists()).toBe(false);
    expect(wrapper.find(selectors.chatBox).exists()).toBe(false);
    // assert started listening to incomming chat room messages
    expect(
      webSocketStore.socketManager?.socketEventEmitter.off
    ).toHaveBeenCalledWith(
      "channelMessage",
      (wrapper.vm as any).handleChatRoomIncommingMessages
    );
  });

  it("sends a chat message when inside a chat room", async () => {
    // init test values
    const chatRoomName = "my chat room";
    const channelName = `group-chat/${chatRoomName}`;
    const messageText = "some chat message";
    // Mock websocket store
    const webSocketStore = useWebSocketStore();
    // open groupchat view
    const wrapper = mount(GroupChat, {
      global: {
        plugins: [testPinia],
        stubs: { FontAwesomeIcon: true },
      },
    });
    (wrapper.vm as any).chatName = chatRoomName;
    (wrapper.vm as any).chatEntered = true;
    await Vue.nextTick();
    // assert inside chat room
    expect(wrapper.find(selectors.chatRoomTitle).text()).toBe(chatRoomName);
    expect(wrapper.find(selectors.chatBox).isVisible()).toBe(true);
    // enter a chat message
    wrapper.find(selectors.messageInput).setValue(messageText);
    expect(
      (wrapper.find(selectors.messageInput).element as HTMLInputElement).value
    ).toBe(messageText);
    // send message
    await wrapper.find(selectors.sendMessageButton).trigger("click");
    // assert message sent by websocket
    const expectedChannelPayload = { text: messageText };
    expect(webSocketStore.sendBySocketToChannel).toHaveBeenCalledWith(
      channelName,
      expectedChannelPayload
    );
    // assert message input is reset
    expect(
      (wrapper.find(selectors.messageInput).element as HTMLInputElement).value
    ).toBe("");
  });

  it("receives chat messages when inside a chat room", async () => {
    // Add scrollTo method to Elements as it does not exist in jsdom
    Element.prototype.scrollTo = () => {};
    // init test values
    const chatRoomName = "my chat room";
    const channelName = `group-chat/${chatRoomName}`;
    const chatMessage1 = { text: "message 1", user: "user1@email.com" };
    const channelMessage1 = {
      channel: channelName,
      message: chatMessage1,
    };
    const chatMessage2 = { text: "message 2", user: "user2@email.com" };
    const channelMessage2 = {
      channel: channelName,
      message: chatMessage2,
    };
    // Mock websocket store
    const webSocketStore = useWebSocketStore();
    webSocketStore.socketManager = {
      socket: vi.fn() as any as WebSocket,
      socketEventEmitter: {
        off: vi.fn(),
        on: vi.fn(),
      } as any as Emitter<SocketEvents>,
    };
    // open groupchat view
    const wrapper = mount(GroupChat, {
      global: {
        plugins: [testPinia],
        stubs: { FontAwesomeIcon: true },
      },
    });
    (wrapper.vm as any).chatName = chatRoomName;
    (wrapper.vm as any).chatEntered = true;
    await Vue.nextTick();
    // assert inside chat room
    expect(wrapper.find(selectors.chatRoomTitle).text()).toBe(chatRoomName);
    expect(wrapper.find(selectors.chatBox).isVisible()).toBe(true);
    // assert no chat messages visible
    expect(wrapper.findAll(selectors.chatMessageContainer).length).toBe(0);
    // mock event emitter triggering handleChatRoomIncommingMessages on new chat message
    (wrapper.vm as any).handleChatRoomIncommingMessages(channelMessage1);
    await Vue.nextTick();
    // assert message is displayed in chat box
    let messageContainerEls = wrapper.findAll(selectors.chatMessageContainer);
    expect(messageContainerEls.length).toBe(1);
    let messageContainer = messageContainerEls[0];
    expect(messageContainer.find(selectors.chatMessageText).text()).toBe(
      chatMessage1.text
    );
    expect(messageContainer.find(selectors.chatMessageUser).text()).toBe(
      chatMessage1.user
    );
    // mock event emitter triggering handleChatRoomIncommingMessages on new chat message
    (wrapper.vm as any).handleChatRoomIncommingMessages(channelMessage2);
    await Vue.nextTick();
    // assert message is displayed in chat box
    messageContainerEls = wrapper.findAll(selectors.chatMessageContainer);
    expect(messageContainerEls.length).toBe(2);
    messageContainer = messageContainerEls[0];
    expect(messageContainer.find(selectors.chatMessageText).text()).toBe(
      chatMessage1.text
    );
    expect(messageContainer.find(selectors.chatMessageUser).text()).toBe(
      chatMessage1.user
    );
    messageContainer = messageContainerEls[1];
    expect(messageContainer.find(selectors.chatMessageText).text()).toBe(
      chatMessage2.text
    );
    expect(messageContainer.find(selectors.chatMessageUser).text()).toBe(
      chatMessage2.user
    );
  });
});
