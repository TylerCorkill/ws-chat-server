import { WebSocketServer } from 'ws'
import { ChannelService } from './services/channelService'
import { MessageType } from './types'
import { Connection } from './classes/connection';

const port = 6000
const wss = new WebSocketServer({ port })

// const urlChunk = process.env.NODE_ENV === 'production' ? 3 : 1


wss.on('connection', (ws, req) => {
  const connection = new Connection(ws)

  // Create or join channel based on url
  const pathId = req.url?.split('/').slice(3).join('/')
  const id = ChannelService.createChannel(pathId)
  const channel = ChannelService.getChannel(id)
  
  if (!channel) {
    ws.close(1011, 'Channel Not Found')
    return
  }

  // Add connection to channel
  channel.connect(ws)

  // Remove WebSocket and user on connection close
  ws.on('close', () => {
    if (channel.unidentify(connection.user)) {
      console.log('user removed successfully')
    } else {
      console.log('Error: Failed to remove the user')
    }

    if (channel.disconnect(ws)) {
      console.log('closed successfully')
    } else {
      console.log('Error: Failed to close connection')
    }
  })

  // Heartbeat on interval
  setInterval(() => {
    connection.send({
      authenticated: !!connection.user,
      type: MessageType.Heartbeat
    })
  }, 1000)

  // Relay message to all connections
  ws.on('message', (data, isBinary) => {
    const message = JSON.parse(`${isBinary ? data : data.toString()}`)

    switch (message.type) {
      case MessageType.Message:
        channel.send(connection.formatMessage(message))
        return
      case MessageType.Identity:
        const success = channel.identify(message.user);
        if (success) {
          connection.user = message.user
        }
        connection.send({
          success,
          type: MessageType.Identity
        })
        return
    }
  })

  // Connection Established
  connection.send({
    type: MessageType.Connection,
    id,
    text: `connection established to channel ${id}`
  })
})

console.log(`server started on port ${port}`)