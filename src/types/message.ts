import { MessageType } from "./messageType";

export type Message = {
  type: MessageType,
  text?: string
}