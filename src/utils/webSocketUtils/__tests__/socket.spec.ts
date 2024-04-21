import { describe, expect, it } from 'vitest'
import { Server } from 'mock-websocket'
import mitt from 'mitt'

import type { SocketEvents } from '@/models/socket-event-emitter.type'
import { getSocket } from '../socket'

describe('utils > webSocketUtils > getSocket', () => {
  it('creates a new socket that connects to socket url endpoint', async () => {
    // init test values
    const socketUrl = 'ws://localhost:8080/main-socket'
    let isSocketConnected = false
    let isSocketConnectedEventEmitted = false
    // init socket event emitter
    const eventEmitter = mitt<SocketEvents>()
    eventEmitter.on('socketConnected', () => {
      isSocketConnectedEventEmitted = true
    })
    // init mock server for connecting websocket clients
    const mockServer = new Server(socketUrl)
    mockServer.on('connection', () => {
      isSocketConnected = true
    })
    // call getSocket
    const socket = getSocket(socketUrl, eventEmitter)
    // wait for 2 seconds for socket connection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // assert socket connected and event emitted
    expect(isSocketConnected).toBe(true)
    expect(isSocketConnectedEventEmitted).toBe(true)
    // teardown
    eventEmitter.off('socketConnected')
    socket.close()
    mockServer.close()
  })

  describe('> socketEventEmitter', () => {
    it(
      're-emits websocket messages of channel subscriptions as channel subscription events',
      async () => {
        // init test values
        const socketUrl = 'ws://localhost:8080/main-socket'
        let isSocketConnected = false
        const channelName = 'test-channel'
        const subscribedPayload = { channel: channelName, subscribed: true }
        let isSubscribedChannelEventEmitted = false
        // init socket event emitter
        const eventEmitter = mitt<SocketEvents>()
        // init mock server for connecting websocket clients
        const mockServer = new Server(socketUrl)
        mockServer.on('connection', () => {
          isSocketConnected = true
        })
        // call getSocket
        const socket = getSocket(socketUrl, eventEmitter)
        // wait for 2 seconds for socket connection
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // assert socket connected and event emitted
        expect(isSocketConnected).toBe(true)
        // setup listener for channel subscribed event
        eventEmitter.on('channelSubscriptionStatus', (subscriptionStatus) => {
          expect(subscriptionStatus.channel).toBe(channelName)
          expect(subscriptionStatus.subscribed).toBe(subscribedPayload.subscribed)
          isSubscribedChannelEventEmitted = true
        })
        // send channel subscribe message
        mockServer.send(JSON.stringify(subscribedPayload))
        // wait for 2 seconds for socket connection
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // assert event emitted
        expect(isSubscribedChannelEventEmitted).toBe(true)
        // teardown
        eventEmitter.off('channelSubscriptionStatus')
        socket.close()
        mockServer.close()
      },
      { timeout: 10000 }
    )

    it(
      're-emits websocket messages of channel messages as channel message events',
      async () => {
        // init test values
        const socketUrl = 'ws://localhost:8080/main-socket'
        let isSocketConnected = false
        const channelName = 'test-channel'
        const channelMessagePayload = {
          channel: channelName,
          message: { data: 'some data' }
        }
        let isChannelMessageEventEmitted = false
        // init socket event emitter
        const eventEmitter = mitt<SocketEvents>()
        // init mock server for connecting websocket clients
        const mockServer = new Server(socketUrl)
        mockServer.on('connection', () => {
          isSocketConnected = true
        })
        // call getSocket
        const socket = getSocket(socketUrl, eventEmitter)
        // wait for 2 seconds for socket connection
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // assert socket connected and event emitted
        expect(isSocketConnected).toBe(true)
        // setup listener for channel subscribed event
        eventEmitter.on('channelMessage', (channelMessage) => {
          expect(channelMessage.channel).toBe(channelName)
          expect((channelMessage.message as any).data).toBe(channelMessagePayload.message.data)
          isChannelMessageEventEmitted = true
        })
        // send channel subscribe message
        mockServer.send(JSON.stringify(channelMessagePayload))
        // wait for 2 seconds for socket connection
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // assert event emitted
        expect(isChannelMessageEventEmitted).toBe(true)
        // teardown
        eventEmitter.off('channelMessage')
        socket.close()
        mockServer.close()
      },
      { timeout: 10000 }
    )

    it(
      're-emits non-channel websocket messages as other messages event',
      async () => {
        // init test values
        const socketUrl = 'ws://localhost:8080/main-socket'
        let isSocketConnected = false
        const otherMessagePayload = {
          nonChannelField: 'test value',
          subscribed: true,
          message: 'test'
        }
        let isOtherMessageEventEmitted = false
        // init socket event emitter
        const eventEmitter = mitt<SocketEvents>()
        // init mock server for connecting websocket clients
        const mockServer = new Server(socketUrl)
        mockServer.on('connection', () => {
          isSocketConnected = true
        })
        // call getSocket
        const socket = getSocket(socketUrl, eventEmitter)
        // wait for 2 seconds for socket connection
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // assert socket connected and event emitted
        expect(isSocketConnected).toBe(true)
        // setup listener for other message event
        eventEmitter.on('otherMessage', (otherMessage) => {
          expect(JSON.stringify(otherMessage)).toBe(JSON.stringify(otherMessagePayload))
          isOtherMessageEventEmitted = true
        })
        // send other message payload
        mockServer.send(JSON.stringify(otherMessagePayload))
        // wait for 2 seconds for socket connection
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // assert event emitted
        expect(isOtherMessageEventEmitted).toBe(true)
        // teardown
        eventEmitter.off('otherMessage')
        socket.close()
        mockServer.close()
      },
      { timeout: 10000 }
    )
  })
})
