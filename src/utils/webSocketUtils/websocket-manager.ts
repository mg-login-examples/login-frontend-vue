import mitt from 'mitt'

import type { SocketEvents } from '@/models/socket-event-emitter.type'
import type { WebSocketManager } from '@/models/websocket-manager.type'
import { getSocket } from './socket'
import { socketReconnectOnUnexpectedClose } from './socket-reconnect'

export function getWebsocketManager(webSocketUrl: string): WebSocketManager {
  const socketEventEmitter = mitt<SocketEvents>()
  const socket = getSocket(webSocketUrl, socketEventEmitter)
  const websocketManager = { socket: socket, socketEventEmitter }
  socketReconnectOnUnexpectedClose(websocketManager, webSocketUrl)
  return websocketManager
}
