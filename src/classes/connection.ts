import { WebSocket } from 'ws'
import { FormattedMessage, Message } from '../types'

/**
 * Connection
 * The Connection class represents a single user's
 * connection to a channel
 */
export class Connection {
  #ws: WebSocket
  public user = ''

  constructor(ws: WebSocket) {
    this.#ws = ws
  }

  /**
   * authenticated
   * Returns boolean representing connection authentication state
   *
   * @return authenticated
   */
  get authenticated(): boolean {
    return !!this.user
  }

  /**
   * close
   *
   * @param code
   * @param message
   */
  close(code: number, message?: string): boolean {
    switch (this.#ws.readyState) {
      case this.#ws.CONNECTING:
      case this.#ws.OPEN:
        this.#ws.close(code, message)
        return true
      case this.#ws.CLOSING:
      case this.#ws.CLOSED:
      default:
        return false
    }
  }

  /**
   * send
   * Sends message
   *
   * @param message
   */
  send(message: Message | FormattedMessage): void {
    this.#ws.send(JSON.stringify(message))
  }
}