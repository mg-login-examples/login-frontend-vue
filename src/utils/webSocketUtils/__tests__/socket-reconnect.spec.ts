vi.mock("@/utils/webSocketUtils/socket");
import { describe, expect, it, vi, type Mock } from "vitest";
import mitt from "mitt";

import type { SocketEvents } from "@/models/socket-event-emitter.type";
import { getSocket } from "../socket";
import { socketReconnectOnUnexpectedClose } from "../socket-reconnect";

describe("utils > webSocketUtils > socketReconnectOnUnexpectedClose", () => {
  it("replaces socket manager's socket with a new one if it closes unexpectedly", async () => {
    // init test values
    const socketUrl = "ws://localhost:8080";
    const socket = vi.fn;
    const socketEventEmitter = mitt<SocketEvents>();
    const socketManager = {
      socket: socket as any as WebSocket,
      socketEventEmitter,
    };
    // mock getSocket implementation
    const socketNew = vi.fn;
    (getSocket as Mock).mockReturnValue(socketNew);
    // assert socket.onclose is not set
    expect((socket as any).onclose).toBeUndefined();
    // call socketReconnectOnUnexpectedClose() with parameter socketManager to set socket.onclose
    socketReconnectOnUnexpectedClose(socketManager, socketUrl);
    // assert socket.onclose is set
    expect((socket as any).onclose).toBeDefined();
    // mock socket unexpected close
    (socket as any).onclose({ code: 1006 });
    // wait for 2 seconds for socket renew
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // assert socket updated in socketManager
    expect(socketManager.socket).toBe(socketNew);
  });
});
