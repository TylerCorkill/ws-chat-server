import { WebSocket } from 'ws'
import { Connection } from './connection'
import { Message } from '../types'

/**
 * Channel
 * The Channel class represents a single channel
 * and handles ws connections and user identity
 */
export class Channel {
  #connections: Array<Connection> = []

  /**
   * connect
   * Adds connection to channel
   *
   * @param ws
   * @return connection
   */
  connect(ws: WebSocket): Connection {
    const connection = new Connection(ws)
    this.#connections.push(connection)
    return connection
  }

  /**
   * disconnect
   * Removes websocket from channel
   *
   * @param connection
   * @return success
   */
  disconnect(connection: Connection): boolean {
    for (const i in this.#connections) {
      const c = this.#connections[i]
      if (c === connection) {
        c.close(1000)
        delete this.#connections[i]
        return true
      }
    }
    return false
  }

  /**
   * identify
   * Identifies user if name isn't in use
   *
   * @param user - String representing user's name
   * @param connection
   * @return success
   */
  identify(user: string, connection: Connection): boolean {
    for (const c of this.#connections) {
      if (c.user === user) { return false }
    }
    connection.user = user
    return true
  }

  /**
   * unidentify
   * Removes user from list
   *
   * @param connection
   * @return success
   */
  unidentify(connection: Connection): boolean {
    if (connection.user) {
      connection.user = ''
      return true
    }
    return false
  }

  /**
   * dispatch
   * Sends message to all Connections in a channel
   *
   * @param message
   * @param user
   */
  dispatch(message: Message, user: string): void {
    const timestampedMessage = { ...message, timestamp: Date.now(), user }
    this.#connections.forEach((c) => c.send(timestampedMessage))
  }
}