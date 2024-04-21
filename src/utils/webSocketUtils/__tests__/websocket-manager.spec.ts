vi.mock('@/utils/webSocketUtils/socket')
vi.mock('@/utils/webSocketUtils/socket-reconnect')
vi.mock('mitt')
import { describe, expect, it, vi, type Mock } from 'vitest'
import mitt from 'mitt'

import { getWebsocketManager } from '../websocket-manager'
import { socketReconnectOnUnexpectedClose } from '../socket-reconnect'
import { getSocket } from '../socket'

describe('utils > webSocketUtils > getWebsocketManager()', () => {
  it('gets socket manager containing a websocket and event emitter', () => {
    // init test values
    const socketUrl = 'http://test-domain.com/main-socket'
    // mock mitt implementation for event emitter creation
    const mockEventEmitter = vi.fn()
    ;(mitt as Mock).mockReturnValue(mockEventEmitter)
    // mock getSocket implementation
    const mockSocket = vi.fn()
    ;(getSocket as Mock).mockReturnValue(mockSocket)
    // call getWebsocketManager
    const socketManager = getWebsocketManager(socketUrl)
    // assert socketManager object as expected
    expect(socketManager.socket).toBe(mockSocket)
    expect(socketManager.socketEventEmitter).toBe(mockEventEmitter)
    // assert socketReconnectOnUnexpectedClose called on socketManager
    expect(socketReconnectOnUnexpectedClose).toBeCalledWith(socketManager, socketUrl)
  })
})
