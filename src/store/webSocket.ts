import { defineStore } from 'pinia'

import { getWebsocketManager } from '@/utils/webSocketUtils/websocket-manager'
import type { WebSocketManager } from '@/models/websocket-manager.type'
import type { SocketSendMessage } from '@/models/socket-send-message.model'
import { EnvironmentVars } from '@/utils/envUtils'

interface WebSocketState {
  socketUrl: string
  socketManager: WebSocketManager | null
  channelSubscribers: {
    channel: string
    callback: () => void
  }[]
}

export const useWebSocketStore = defineStore('websocket', {
  state: (): WebSocketState => ({
    socketUrl: EnvironmentVars.backendWebSocketUrl,
    socketManager: null,
    channelSubscribers: []
  }),
  getters: {
    socketReady: (state) => state.socketManager?.socket.readyState,
    socketEventEmitter: (state) => state.socketManager?.socketEventEmitter
  },
  actions: {
    connectSocketIfNotConnected() {
      if (!this.socketManager) {
        this.socketManager = getWebsocketManager(this.socketUrl)
      }
    },
    disconnectSocketIfConnected() {
      if (this.socketManager) {
        this.socketManager.socket.close()
        this.socketManager.socketEventEmitter.off('socketConnected')
        this.socketManager = null
        this.channelSubscribers = []
      }
    },
    reconnectSocket() {
      this.disconnectSocketIfConnected()
      this.connectSocketIfNotConnected()
    },
    sendBySocket(payload: SocketSendMessage) {
      if (this.socketManager) {
        const payload_as_string = JSON.stringify(payload)
        this.socketManager.socket.send(payload_as_string)
      }
    },
    subscribeToChannel(channelName: string) {
      const sendSubscribeMessage = () => {
        this.sendBySocket({ action: 'subscribe', channel: channelName })
      }
      // subscribe to channel
      sendSubscribeMessage()
      // add callback to resubscribe to channel if socket is reconnected due to error
      this.socketManager?.socketEventEmitter.on('socketConnected', sendSubscribeMessage)
      // store callback to resubscribe to channel
      // to be able to remove it later from event emitter when channel is unsubscribed
      this.channelSubscribers.push({
        channel: channelName,
        callback: sendSubscribeMessage
      })
    },
    unsubscribeFromChannel(channelName: string) {
      // send message to unsubscribe from channel
      this.sendBySocket({ action: 'unsubscribe', channel: channelName })
      // remove listener to auto subscribe to channel on websocket reconnect
      const subscribers = this.channelSubscribers.filter((sub) => sub.channel === channelName)
      for (const sub of subscribers) {
        this.socketManager?.socketEventEmitter.off('socketConnected', sub.callback)
      }
      // remove stored callback
      this.channelSubscribers = this.channelSubscribers.filter(
        (item) => item.channel !== channelName
      )
    },
    sendBySocketToChannel(channelName: string, payload: object) {
      this.sendBySocket({
        action: 'message',
        channel: channelName,
        data: payload
      })
    }
  }
})
