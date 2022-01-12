import { WebSocket, WebSocketServer } from 'ws'
import { ChannelService } from './services/channelService'
import { cookieName, getCookies } from './services/cookieService'
import { FormattedMessage, Message, MessageType } from './types'
import * as process from 'process';
import * as path from 'path';

const port = 6000
const wss = new WebSocketServer({ port })
const chatRooms: Array<Array<WebSocket>> = []
// Heartbeat message
const heartbeat = {
  type: MessageType.Heartbeat
}

/**
 * sendMessage
 * Sends message to all WebSockets in a channel
 * @param msg
 * @param connections
 */
function sendMessage(message: Message, connections: WebSocket[]) {
  connections.forEach((ws) => ws.send(formatMessage(message)))
}

/**
 * formatMessage
 * Format Message to be sent by WebSocket
 * @param message
 */
function formatMessage(message: Message): string {
  const m: FormattedMessage = { ...message, timestamp: Date.now() }
  return JSON.stringify(m)
}

// const urlChunk = process.env.NODE_ENV === 'production' ? 3 : 1

wss.on('connection', (ws, req) => {
  const pathId = req.url?.split('/').slice(3).join('/')
  const id = ChannelService.createChannel(pathId)
  const channel = ChannelService.getChannel(id)
  
  if (!channel) {
    ws.close(1011, 'Channel Not Found')
    return
  }

  // Add connection to channel
  channel.push(ws)

  // Remove WebSocket on connection close
  ws.on('close', () => {
    for (const index in channel) {
      if (channel[index] === ws) {
        console.log('closed successfully')
        delete channel[index]
        break
      }
    }
  })

  // Heartbeat on interval
  setInterval(() => {
    ws.send(formatMessage(heartbeat))
  }, 1000)

  // Relay message to all connections
  ws.on('message', (data, isBinary) => {
    const message = JSON.parse(`${isBinary ? data : data.toString()}`)

    switch (message.type) {
      case MessageType.Message:
        sendMessage(message, channel)
        return
    }
  })

  // Connection Established
  ws.send(formatMessage({
    type: MessageType.Connection,
    id,
    text: `connection established to channel ${id}`
  }))
})

console.log(`server started on port ${port}`)