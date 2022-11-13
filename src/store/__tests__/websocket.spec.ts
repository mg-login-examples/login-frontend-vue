vi.mock("@/utils/webSocketUtils/websocket-manager");
import { describe, expect, it, vi, type Mock, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

import { getWebsocketManager } from "@/utils/webSocketUtils/websocket-manager";
import { useWebSocketStore } from "../webSocket";
import type { SocketEvents } from "@/models/socket-event-emitter.type";
import mitt, { type Emitter } from "mitt";
import type { SocketSendMessage } from "@/models/socket-send-message.model";

describe("store > websocket.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
  });

  it("inits the websocket store with no socket manager", () => {
    // init test values
    import.meta.env.VITE_APP_BACKEND_WEBSOCKET_URL = "ws://testdomain.com/main";
    // init store
    const socketStore = useWebSocketStore();
    // assert init values
    expect(socketStore.socketUrl).toBe(
      import.meta.env.VITE_APP_BACKEND_WEBSOCKET_URL
    );
    expect(socketStore.socketManager).toBeNull();
  });

  it("sets the socketManager when connectSocketIfNotConnected only if the socketManager is null", () => {
    // init test values
    import.meta.env.VITE_APP_BACKEND_WEBSOCKET_URL = "ws://testdomain.com/main";
    // mock getWebsocketManager
    const mockSocketManager = vi.fn();
    (getWebsocketManager as Mock).mockReturnValue(mockSocketManager);
    // init store
    const socketStore = useWebSocketStore();
    // assert socketManager is null
    expect(socketStore.socketManager).toBeNull();
    // call connectSocketIfNotConnected()
    socketStore.connectSocketIfNotConnected();
    // assert socketManager is set
    expect(socketStore.socketManager).toBe(mockSocketManager);
    expect(getWebsocketManager).toHaveBeenCalledTimes(1);
    expect(getWebsocketManager).toHaveBeenCalledWith(socketStore.socketUrl);
    // clear mock calls
    (getWebsocketManager as Mock).mockClear();
    expect(getWebsocketManager).toHaveBeenCalledTimes(0);
    // call connectSocketIfNotConnected()
    socketStore.connectSocketIfNotConnected();
    // assert getWebsocketManager is not called as socketManager is not null
    expect(getWebsocketManager).toHaveBeenCalledTimes(0);
  });

  it("closes websocket and sets the socketManager to null when disconnectSocketIfConnected is called", () => {
    // init test values
    const mockSocketManager = {
      socket: { close: vi.fn() } as any as WebSocket,
      socketEventEmitter: mitt<SocketEvents>(),
    };
    // init store
    const socketStore = useWebSocketStore();
    socketStore.socketManager = mockSocketManager;
    // call disconnectSocketIfConnected
    socketStore.disconnectSocketIfConnected();
    // assert socket close method is called and socketManager is null
    expect(mockSocketManager.socket.close).toBeCalled();
    expect(socketStore.socketManager).toBeNull();
  });

  it("resets socket channels subscribers when disconnectSocketIfConnected is called", () => {
    // Note: This resetting is done to prevent auto-resubscription on next socketConnect event
    // when disconnectSocketIfConnected is called as websocket is being closed intentionally
    // as opposed to when the websocket closes unintentionally and will auto-reconnect,
    // after which the channels subscribers will resubscribe to the socket
    // init test values
    const mockSocketManager = {
      socket: { close: vi.fn() } as any as WebSocket,
      socketEventEmitter: { off: vi.fn() as any } as Emitter<SocketEvents>,
    };
    // init store
    const socketStore = useWebSocketStore();
    socketStore.socketManager = mockSocketManager;
    socketStore.channelSubscribers = [
      { channel: "channel1", callback: vi.fn() },
      { channel: "channel2", callback: vi.fn() },
    ];
    // call disconnectSocketIfConnected
    socketStore.disconnectSocketIfConnected();
    // assert event emitter detach method called for all stored callbacks
    expect(mockSocketManager.socketEventEmitter.off).toBeCalledWith(
      "socketConnected"
    );
    expect(socketStore.channelSubscribers).toEqual([]);
  });

  it("disconnects websocket first then connects again when reconnectSocket is called", () => {
    // init store
    const socketStore = useWebSocketStore();
    socketStore.connectSocketIfNotConnected = vi.fn();
    socketStore.disconnectSocketIfConnected = vi.fn();
    // call reconnectSocket()
    socketStore.reconnectSocket();
    // assert disconnect and connect are called
    expect(socketStore.disconnectSocketIfConnected).toBeCalled();
    expect(socketStore.connectSocketIfNotConnected).toBeCalled();
  });

  it("sends websocket messages", () => {
    // init test values
    const payloadToSend: SocketSendMessage = {
      action: "some action",
      channel: "some channel",
      data: { d: "ata" },
    };
    // init mock socket manager
    const mockSocketManager = {
      socket: { send: vi.fn() } as any as WebSocket,
      socketEventEmitter: vi.fn() as any as Emitter<SocketEvents>,
    };
    // init store
    const socketStore = useWebSocketStore();
    socketStore.socketManager = mockSocketManager;
    // call sendBySocket
    socketStore.sendBySocket(payloadToSend);
    // assert payload sent by socket
    expect(socketStore.socketManager.socket.send).toHaveBeenCalledWith(
      JSON.stringify(payloadToSend)
    );
  });

  it("subscribes to a channel and stores callback to resubscribe on websocket unexpected close", () => {
    // init test values
    const channelName = "channel to subscribe";
    // init mock socket manager
    const mockSocketManager = {
      socket: { send: vi.fn() } as any as WebSocket,
      socketEventEmitter: { on: vi.fn() } as any as Emitter<SocketEvents>,
    };
    // init store
    const socketStore = useWebSocketStore();
    socketStore.socketManager = mockSocketManager;
    socketStore.sendBySocket = vi.fn();
    // call subscribe to channel
    socketStore.subscribeToChannel(channelName);
    // assert message to subscribe to channel sent by websocket
    const expectedPayload = {
      action: "subscribe",
      channel: channelName,
    };
    expect(socketStore.sendBySocket).toBeCalledWith(expectedPayload);
    // assert callback added to resubscribe on websocket reconnection
    expect(socketStore.socketEventEmitter?.on).toBeCalledWith(
      "socketConnected",
      expect.anything()
    );
    // assert callback stored
    expect(socketStore.channelSubscribers.length).toBe(1);
  });

  it("unsubscribes from channel and removes listener to resubscribe on websocket reconnect", () => {
    // init test values
    const channelName = "channel to unsubscribe";
    const callbackToResubscribe = vi.fn();
    const subscriber1 = {
      channel: channelName,
      callback: callbackToResubscribe,
    };
    const subscriber2 = {
      channel: "another channel",
      callback: vi.fn(),
    };
    // init mock socket manager
    const mockSocketManager = {
      socket: { send: vi.fn() } as any as WebSocket,
      socketEventEmitter: { off: vi.fn() } as any as Emitter<SocketEvents>,
    };
    // init store
    const socketStore = useWebSocketStore();
    socketStore.socketManager = mockSocketManager;
    socketStore.channelSubscribers = [subscriber2, subscriber1];
    socketStore.sendBySocket = vi.fn();
    // call unsubscribe from channel
    socketStore.unsubscribeFromChannel(channelName);
    // assert message to subscribe to channel sent by websocket
    const expectedPayload = {
      action: "unsubscribe",
      channel: channelName,
    };
    expect(socketStore.sendBySocket).toBeCalledWith(expectedPayload);
    // assert callback added to resubscribe on websocket reconnection
    expect(socketStore.socketEventEmitter?.off).toBeCalledWith(
      "socketConnected",
      callbackToResubscribe
    );
    // assert callback no longer stored
    expect(socketStore.channelSubscribers.length).toBe(1);
    expect(socketStore.channelSubscribers[0]).toEqual(subscriber2);
  });

  it("sends a channel message by websocket", () => {
    // init test values
    const channelName = "channel to unsubscribe";
    const payload = { someData: "a b c" };
    // init store
    const socketStore = useWebSocketStore();
    socketStore.sendBySocket = vi.fn();
    // call send channel message to websocket
    socketStore.sendBySocketToChannel(channelName, payload);
    // assert message sent by websocket
    const expectedPayload = {
      action: "message",
      channel: channelName,
      data: payload,
    };
    expect(socketStore.sendBySocket).toHaveBeenCalledWith(expectedPayload);
  });
});
