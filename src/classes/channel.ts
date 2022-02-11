import { WebSocket } from 'ws'

export class Channel {
  private connections: Array<WebSocket> = []
  private userList: {
    [id: string]: true;
  } = {}

  /**
   * connect
   * Adds connection to channel
   *
   * @param ws
   */
  connect(ws: WebSocket): void {
    this.connections.push(ws)
  }

  /**
   * disconnect
   * Removes websocket from channel
   *
   * @param ws
   */
  disconnect(ws: WebSocket): boolean {
    for (const index in this.connections) {
      if (this.connections[index] === ws) {
        delete this.connections[index]
        return true
      }
    }
    return false
  }

  /**
   * identify
   * Identifies user
   *
   * @param user
   */
  identify(user: string): boolean {
    if (this.userList[user]) {
      return false
    }
    return this.userList[user] = true
  }

  /**
   * unidentify
   * Removes user from list
   *
   * @param user
   */
  unidentify(user: string): boolean {
    if (this.userList[user]) {
      delete this.userList[user]
      return true
    }
    return false
  }

  /**
   * send
   * Sends message to all WebSockets in a channel
   *
   * @param formattedMessage
   */
  send(formattedMessage: string): void {
    this.connections.forEach((ws) => ws.send(formattedMessage))
  }
}