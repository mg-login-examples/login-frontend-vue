import type { Emitter } from 'mitt'

import type { SocketEvents } from '@/models/socket-event-emitter.type'

export type WebSocketManager = {
  socket: WebSocket
  socketEventEmitter: Emitter<SocketEvents>
}
