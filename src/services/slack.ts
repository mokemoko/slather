import { AuthTestResponse, ConversationsHistoryResponse, UsersProfileGetResponse } from '@slack/web-api'
import axios from 'axios'
import { UserServiceInfo } from '../models/user'
import { get, set } from '../utils/cache'
import { Message, message2vm } from '../models/message'
import { sequential } from '../utils/promise'

const baseUrl = 'https://slack.com/api/'

export interface SlackUserInfo {
  username: string
  icons: {
    image_64: string
  }
}

class Slack {
  team: string
  token: string

  constructor(token: string)
  constructor(info: UserServiceInfo)
  constructor(param: string | UserServiceInfo) {
    if (typeof param === 'string') {
      this.team = ''
      this.token = param
    } else {
      this.team = param.team
      this.token = param.token
    }
  }

  private async post<T>(method: string, params: any) {
    const data = new URLSearchParams({
      token: this.token,
      ...params,
    })
    const res = await axios.post<T>(baseUrl + method, data)
    return res.data
  }

  async fetchUserInfo(user: string): Promise<SlackUserInfo> {
    const cache = get<SlackUserInfo>(user)
    if (cache) {
      return cache
    }
    const res = await this.post<UsersProfileGetResponse>('users.profile.get', { user })
    if (res.ok) {
      const info = {
        username: res.profile?.display_name || '',
        icons: {
          image_64: res.profile?.image_48 || '',
        },
      }
      set(user, info)
      return info
    } else {
      throw res.error
    }
  }

  async checkAuth(): Promise<UserServiceInfo> {
    const res = await this.post<AuthTestResponse>('auth.test', {})
    if (res.ok) {
      const userInfo = await this.fetchUserInfo(res.user_id!)
      return {
        id: res.user_id!,
        team: res.team!,
        name: userInfo.username || '',
        image: userInfo.icons.image_64 || '',
        token: this.token,
      }
    } else {
      throw res.error
    }
  }

  private async fetchMassages(channel: string, ts: string, limit: number) {
    const params = {
      channel,
      oldest: ts,
      limit,
      inclusive: true,
    }
    const res = await this.post<ConversationsHistoryResponse>('conversations.history', params)
    if (res.ok && res.messages) {
      return sequential(res.messages.map(async message => {
        if (message.user) {
          const userInfo = await this.fetchUserInfo(message.user)
          Object.assign(message, userInfo)
        }
        // TODO: 必要な項目のみ抽出
        set(`${channel}.${ts}`, message)
        return message2vm(this.team, channel, message)
      }))
    } else {
      throw res.error
    }
  }

  private parseUrl(url: string) {
    const [channel, pts] = url.split('/').slice(-2)
    const ts = `${pts.slice(1, -6)}.${pts.slice(-6)}`
    return { channel, ts }
  }

  async fetchMessageFromUrl(url: string) {
    const { channel, ts } = this.parseUrl(url)
    const cache = get<Message>(`${channel}.${ts}`)
    if (cache) {
      return message2vm(this.team, channel, cache)
    } else {
      const [message] = await this.fetchMassages(channel, ts, 1)
      return message
    }
  }

  async fetchMessagesFromUrl(url: string, limit: number = 20) {
    const { channel, ts } = this.parseUrl(url)
    const messages = await this.fetchMassages(channel, ts, limit)
    return messages.reverse()
  }
}

export default Slack
