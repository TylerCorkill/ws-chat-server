import { WebSocketServer } from 'ws'
import { ChannelService } from './services/channelService'
import { MessageType } from './types'
import { Connection } from './classes/connection'

const port = 6000
const wss = new WebSocketServer({ port })

enum LogType {
  Log,
  Warn,
  Error
}

function log(text: string, type = LogType.Log): void {
  switch (type) {
    case LogType.Log:
      console.log(text) // eslint-disable-line
      return
    case LogType.Warn:
      console.warn(text) // eslint-disable-line
      return
    case LogType.Error:
      console.error(text) // eslint-disable-line
      return
  }
}

wss.on('connection', (ws, req) => {
  const connection = new Connection(ws)

  // Create or join channel based on url
  const id = req.url?.split('/').slice(3).join('/') ?? ChannelService.generateUniqueId()
  const channel = ChannelService.get(id) ?? ChannelService.create(id)

  // State
  let lastHb = Date.now()
  
  if (!channel) {
    ws.close(1011, 'Channel wasn\'t found and couldn\'t be created')
    return
  }

  // Add connection to channel
  channel.connect(ws)

  // Remove WebSocket and user on connection close
  ws.on('close', () => {
    if (channel.unidentify(connection.user)) {
      log('user removed successfully')
    } else {
      log('Error: Failed to remove the user')
    }

    if (channel.disconnect(ws)) {
      log('closed successfully')
    } else {
      log('Error: Failed to close connection')
    }
  })

  // Heartbeat on interval
  setInterval(() => {
    connection.send({
      authenticated: !!connection.user,
      type: MessageType.Heartbeat
    })

    if (Date.now() - lastHb >= 5000) {
      channel.unidentify(connection.user)
      connection.user = ''
    }
  }, 1000)

  // Relay message to all connections
  ws.on('message', (data, isBinary) => {
    const message = JSON.parse(`${isBinary ? data : data.toString()}`)

    switch (message.type) {
      case MessageType.Message: {
        channel.send(connection.formatMessage(message))
        return
      }
      case MessageType.Identity: {
        const success = channel.identify(message.user)
        if (success) {
          connection.user = message.user
        }
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

console.log(`server started on port ${port}`) // eslint-disable-line