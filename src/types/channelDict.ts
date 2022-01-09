import { WebSocket } from 'ws'

export type ChannelDict = {
  [id: string]: Array<WebSocket>;
}