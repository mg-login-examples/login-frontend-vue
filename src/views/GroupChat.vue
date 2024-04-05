<template>
  <div class="h-full flex flex-col items-center bg-slate-100">
    <div class="w-96 h-full bg-white p-4">
      <div v-if="!chatEntered" class="h-full flex justify-center items-center">
        <div class="w-48">
          <input
            type="text"
            placeholder="Room"
            v-model="chatName"
            class="p-2 my-4 w-full border"
            data-test="group-chat--room-input"
          />
          <button
            @click="requestChatRoomEntry"
            class="px-2 py-2 my-4 bg-slate-200 w-full"
            data-test="group-chat--enter-room-button"
          >
            Enter Chat Room
          </button>
        </div>
      </div>
      <div v-if="chatEntered" class="h-full flex flex-col">
        <div class="w-full flex">
          <button
            class="p-2"
            @click="requestChatRoomExit"
            data-test="group-chat--leave-room-button"
          >
            <font-awesome-icon icon="arrow-left" />
          </button>
          <div class="grow flex justify-center p-2" data-test="group-chat--room-name">
            {{ chatName }}
          </div>
          <div class="w-8"></div>
        </div>
        <div
          class="flex flex-col flex-grow overflow-auto"
          ref="chatMessagesViewEl"
          data-test="group-chat--chat-container"
        >
          <div
            v-for="(message, index) in chatMessages"
            :key="index"
            class="my-1 bg-slate-200 px-2 py-1 flex"
            data-test="group-chat--message-container"
          >
            <div data-test="group-chat--message-text">{{ message.text }}</div>
            <div class="flex-grow"></div>
            <div class="text-slate-500 text-right" data-test="group-chat--message-user">
              {{ message.user }}
            </div>
          </div>
        </div>
        <input
          v-model="messageToSendText"
          @keyup.enter="sendChatMessage"
          type="text"
          placeholder="Chat"
          class="p-2 border-2"
          data-test="group-chat--message-input"
        />
        <button
          @click="sendChatMessage"
          class="p-2 my-2 bg-blue-200"
          data-test="group-chat--send-message-button"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue'

import { useWebSocketStore } from '@/store/webSocket'
import type { SocketReceiveChannelSubscriptionStatus } from '@/models/socket-receive-channel-subscription-status.model'
import type { SocketReceiveChannelMessage } from '@/models/socket-receive-channel-message.model'
import type { GroupChatMessage } from '@/models/group-chat-message.model'

const webSocketStore = useWebSocketStore()

const chatName = ref('')
const chatEntered = ref(false)
const roomChannelName = computed(() => `group-chat/${chatName.value}`)

const chatMessages = ref<GroupChatMessage[]>([])
const messageToSendText = ref('')
const chatMessagesViewEl = ref<HTMLElement>()

// setup listener to handle chat room subscription success / failure
webSocketStore.socketEventEmitter?.on(
  'channelSubscriptionStatus',
  (chatRoomSubscription: SocketReceiveChannelSubscriptionStatus) => {
    if (chatRoomSubscription.channel === roomChannelName.value) {
      if (chatRoomSubscription.subscribed) {
        enterChatRoom()
      } else {
        exitChatRoom()
      }
    }
  }
)
function requestChatRoomEntry() {
  if (chatName.value) {
    // send subscribe request to receive messages from chat room
    webSocketStore.subscribeToChannel(roomChannelName.value)
  }
}
function enterChatRoom() {
  chatEntered.value = true
  chatMessages.value = []
  // ensure only one listener
  webSocketStore.socketEventEmitter?.off('channelMessage', handleChatRoomIncomingMessages)
  // start listening to incomming chat room messages
  webSocketStore.socketEventEmitter?.on('channelMessage', handleChatRoomIncomingMessages)
}
function requestChatRoomExit() {
  webSocketStore.unsubscribeFromChannel(roomChannelName.value)
}
function exitChatRoom() {
  chatEntered.value = false
  chatName.value = ''
  // stop listening to incomming chat room messages
  webSocketStore.socketEventEmitter?.off('channelMessage', handleChatRoomIncomingMessages)
}
function sendChatMessage() {
  if (messageToSendText.value) {
    webSocketStore.sendBySocketToChannel(roomChannelName.value, {
      text: messageToSendText.value
    })
    messageToSendText.value = ''
  }
}
function handleChatRoomIncomingMessages(channelMessage: SocketReceiveChannelMessage) {
  if (channelMessage.channel === roomChannelName.value) {
    const groupChatMessage = channelMessage.message as GroupChatMessage
    chatMessages.value.push(groupChatMessage)
    nextTick(() => {
      chatMessagesViewEl.value?.scrollTo(0, chatMessagesViewEl.value?.scrollHeight)
    })
  }
}

onUnmounted(() => {
  // send websocket message to unsubscribe from chat channel
  webSocketStore.unsubscribeFromChannel(roomChannelName.value)
  // unsubscribe from event emitter
  webSocketStore.socketEventEmitter?.off('channelMessage', handleChatRoomIncomingMessages)
})
</script>
