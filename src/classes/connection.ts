import { WebSocket } from 'ws'
import { FormattedMessage, Message } from '../types'

export class Connection {
  private ws: WebSocket
  user = ''

  constructor(ws: WebSocket) {
    this.ws = ws
  }

  /**
   * formatMessage
   * Format Message to be sent by WebSocket
   *
   * @param message
   */
  formatMessage(message: Message): string {
    const m: FormattedMessage = { ...message, user: this.user, timestamp: Date.now() }
    return JSON.stringify(m)
  }

  /**
   * send
   *
   * @param message
   */
  send(message: Message) {
    this.ws.send(this.formatMessage(message))
  }
}