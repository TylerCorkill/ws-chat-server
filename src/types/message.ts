import { MessageType } from "./messageType";

export type Message = {
  id?: string
  text?: string,
  type: MessageType,
}