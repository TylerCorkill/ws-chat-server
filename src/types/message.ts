import { MessageType } from "./messageType"

export type Message = {
  authenticated?: boolean
  id?: string
  success?: boolean
  text?: string
  type: MessageType
}