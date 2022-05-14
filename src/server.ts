import { WebSocketServer } from 'ws'
import { ChannelService } from './services/channelService'
import { MessageType } from './types'
import { log } from './helpers'

const port = 6000
const wss = new WebSocketServer({ port })

wss.on('connection', (ws, req) => {
  // Create or join channel based on url
  const id = req.url?.split('/').slice(3).join('/') ?? ChannelService.generateUniqueId()
  const channel = ChannelService.get(id) ?? ChannelService.create(id)
  const connection = channel.connect(ws)

  // State
  let lastHb = Date.now()

  // Close connection if channel can't be found or created
  if (!channel) {
    connection.close(1011, 'Channel wasn\'t found and couldn\'t be created')
    return
  }

  // Remove WebSocket on connection close
  ws.on('close', () => {
    if (channel.disconnect(connection)) {
      log('closed successfully')
    } else {
      log('Error: Failed to close connection')
    }
  })

  // Heartbeat on interval
  setInterval(() => {
    connection.send({
      authenticated: connection.authenticated,
      type: MessageType.Heartbeat
    })

    if (Date.now() - lastHb >= 5000) {
      channel.unidentify(connection)
    }
  }, 1000)

  // Relay message to all connections
  ws.on('message', (data, isBinary) => {
    const message = JSON.parse(`${isBinary ? data : data.toString()}`)

    switch (message.type) {
      case MessageType.Message: {
        channel.dispatch(message, connection.user)
        return
      }
      case MessageType.Identity: {
        const success = channel.identify(message.user, connection)
        connection.send({
          success,
          type: MessageType.Identity
        })
        return
      }
      case MessageType.Heartbeat: {
        lastHb = Date.now()
        return
      }
    }
  })

  // Connection Established
  connection.send({
    type: MessageType.Connection,
    id,
    text: `connection established to channel ${id}`
  })
})

log(`server started on port ${port}`)