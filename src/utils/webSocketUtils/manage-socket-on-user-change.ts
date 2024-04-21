import { useUserStore } from '@/store/user'
import { useWebSocketStore } from '@/store/webSocket'

export function connectDisconnectSocketOnUserLogin() {
  const userStore = useUserStore()
  const webSocketStore = useWebSocketStore()

  userStore.$subscribe((_callbackMutation, userState) => {
    if (userState.user) {
      // user login or authenticate
      webSocketStore.reconnectSocket()
    } else {
      webSocketStore.disconnectSocketIfConnected()
    }
  })
}
