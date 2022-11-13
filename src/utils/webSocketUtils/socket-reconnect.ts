import type { WebSocketManager } from "@/models/websocket-manager.type";
import { getSocket } from "./socket";

export function socketReconnectOnUnexpectedClose(
  webSocketManager: WebSocketManager,
  webSocketUrl: string
) {
  const socket = webSocketManager.socket;
  socket.onclose = function (ev) {
    if (ev.code === 1006 || !ev.wasClean) {
      webSocketManager.socketEventEmitter.emit("socketDisconnected");
      console.log(
        "Websocket closed unexpectedly. Trying to reconnect in 1 sec..."
      );
      setTimeout(function () {
        const newSocket = getSocket(
          webSocketUrl,
          webSocketManager.socketEventEmitter
        );
        webSocketManager.socket = newSocket;
        socketReconnectOnUnexpectedClose(webSocketManager, webSocketUrl);
      }, 1000);
    } else {
      console.log("Websocket closed");
    }
  };
}
