import { WebSocket, WebSocketServer } from 'ws'
import { ChannelService } from './services/channelService'
import { getCookies } from './services/cookieService'
import { FormattedMessage, Message, MessageType } from './types'

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

console.log(`server started on port ${port}`)

wss.on('connection', function connection(ws, req) {
  const cookieId = getCookies(req.headers.cookie ?? '')['TWS-Channel-ID']
  const id = ChannelService.createChannel(cookieId)
  const channel = ChannelService.getChannel(id)

  if (!channel) {
    ws.close(1011, 'Channel Not Found')
    return
  }
  channel.push(ws)

  // Relay message to all connections
  ws.on('message', (data, isBinary) => {
    const text = `${isBinary ? data : data.toString()}`
    sendMessage({
      type: MessageType.Message,
      text
    }, channel)
  })
  
  ws.on('close', () => {
    for (const index in channel) {
      if (channel[index] === ws) {
        delete channel[index]
        break
      }
    }
  })

  // Heartbeat on interval
  setInterval(() => {
    ws.send(formatMessage(heartbeat))
  }, 1000)

  // Connection Established
  ws.send(formatMessage({
    type: MessageType.Connection,
    text: `connection established to channel ${id}`
  }))
})