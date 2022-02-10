import { ChannelDict } from '../types'
import { Channel } from '../classes/channel';

export class ChannelService {
  static #channels: ChannelDict = {}
  static #idDictionary = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  /**
   * createRoom
   * Creates room at existing id or creates new
   * @param ws - WebSocket that's creating the room
   * @return id - Room ID
   */
  static createChannel(id = ChannelService.generateUniqueId()): string {
    if (!id) {
      id = ChannelService.generateUniqueId()
    }
    
    if (!ChannelService.#channels[id]) {
      ChannelService.#channels[id] = new Channel()
    }
    return id
  }

  /**
   *
   * @param id
   */
  static getChannel(id: string): Channel {
    return ChannelService.#channels[id]
  }

  /**
   *
   * @param length
   */
  static generateId(length = 12): string {
    let id = ''
    while(length--) {
      const char = Math.floor(Math.random() * (ChannelService.#idDictionary.length - 0) + 0)
      id += ChannelService.#idDictionary[char]
    }
    console.log(id)
    return id
  }

  /**
   *
   * @param length
   */
  static generateUniqueId(length = 12): string {
    let id: string;
    do {
      id = ChannelService.generateId(length)
    } while (ChannelService.#channels[id])
    return id
  }
}