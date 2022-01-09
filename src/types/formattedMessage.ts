import { Message } from "./message";

export type FormattedMessage = Message & {
  timestamp: number
}