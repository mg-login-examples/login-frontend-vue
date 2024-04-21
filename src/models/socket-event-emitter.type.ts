import type { SocketReceiveChannelMessage } from '@/models/socket-receive-channel-message.model'
import type { SocketReceiveChannelSubscriptionStatus } from '@/models/socket-receive-channel-subscription-status.model'

export type SocketEvents = {
  socketConnected: void
  socketDisconnected: void
  channelSubscriptionStatus: SocketReceiveChannelSubscriptionStatus
  channelMessage: SocketReceiveChannelMessage
  otherMessage: unknown
}
