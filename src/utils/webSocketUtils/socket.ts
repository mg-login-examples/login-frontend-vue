import type { Emitter } from 'mitt'

import type { SocketEvents } from '@/models/socket-event-emitter.type'
import type { SocketReceiveChannelSubscriptionStatus } from '@/models/socket-receive-channel-subscription-status.model'
import type { SocketReceiveChannelMessage } from '@/models/socket-receive-channel-message.model'

export function getSocket(
  webSocketUrl: string,
  socketEventEmitter: Emitter<SocketEvents>
): WebSocket {
  const socket = new WebSocket(webSocketUrl)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  socket.onopen = function (ev: Event) {
    socketEventEmitter.emit('socketConnected')
  }

  socket.onerror = function (ev) {
    console.log('WebSocket Error: ', ev)
  }

  // Emit payload on message
  socket.onmessage = (ev) => {
    const socketReceiveData = JSON.parse(ev.data)
    if (socketReceiveData.channel && socketReceiveData.subscribed !== undefined) {
      socketEventEmitter.emit(
        'channelSubscriptionStatus',
        socketReceiveData as SocketReceiveChannelSubscriptionStatus
      )
    } else if (socketReceiveData.channel && socketReceiveData.message !== undefined) {
      socketEventEmitter.emit('channelMessage', socketReceiveData as SocketReceiveChannelMessage)
    } else {
      socketEventEmitter.emit('otherMessage', socketReceiveData)
    }
  }

  return socket
}
