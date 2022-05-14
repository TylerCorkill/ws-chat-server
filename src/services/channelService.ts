import { ChannelDict } from '../types'
import { Channel } from '../classes'

/**
 * ChannelService
 * The channel service handles the creation and deletion of channels
 */
export class ChannelService {
  static #channels: ChannelDict = {}
  static #idDictionary = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  /**
   * create
   * Creates channel
   *
   * @param id - String used for channel lookup
   * @return channel - Channel
   */
  static create(id: string): Channel {
    return ChannelService.#channels[id] = new Channel()
  }

  /**
   * delete
   * Deletes channel
   *
   * @param id - String used for channel lookup
   * @return success - Boolean representing successful deletion
   */
  static delete(id: string): boolean {
    if (ChannelService.#channels[id]) {
      delete ChannelService.#channels[id]
      return true
    }
    return false
  }

  /**
   * get
   * Returns channel if one exists with a given id
   *
   * @param id - String used for channel lookup
   * @return channel - Channel
   */
  static get(id: string): Channel {
    return ChannelService.#channels[id]
  }

  /**
   * exists
   * Checks if channel with given id exists
   *
   * @param id - String used for channel lookup
   * @return success - Boolean representing existence of channel
   */
  static exists(id: string): boolean {
    return !!ChannelService.#channels[id]
  }

  /**
   * generateId
   * Generates an id of a given length using characters from #idDictionary
   *
   * @param length - Length of id
   * @return id - String used for channel lookup
   */
  static generateId(length = 12): string {
    let id = ''
    while(length--) {
      const index = Math.floor(Math.random() * ChannelService.#idDictionary.length)
      id += ChannelService.#idDictionary[index]
    }
    return id
  }

  /**
   * generateUniqueId
   * Generates a unique id that isn't already associated with a channel
   *
   * @param length - Length of id
   * @return id - String used for channel lookup
   */
  static generateUniqueId(length = 12): string {
    let id: string
    do {
      id = ChannelService.generateId(length)
    } while (ChannelService.exists(id))
    return id
  }
}