import {
  AuthTestResponse,
  BotsInfoResponse,
  ConversationsHistoryResponse, ConversationsRepliesResponse,
  UsersProfileGetResponse,
} from '@slack/web-api'
import axios from 'axios'
import { UserServiceInfo } from '../models/user'
import { get, set } from '../utils/cache'
import { errorMessage, Message, message2vm } from '../models/message'
import { sequential } from '../utils/promise'

const baseUrl = 'https://slack.com/api/'


export interface SlackUserInfo {
  username: string
  icons: {
    image_64: string
  },
  botType?: 'アプリ' | 'ワークフロー'
}

const emptySlackUserInfo: SlackUserInfo = {
  username: '',
  icons: {
    image_64: '',
  },
} as const

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
      console.warn(res.error)
      return { ...emptySlackUserInfo, username: user }
    }
  }

  async fetchBotInfo(bot: string): Promise<SlackUserInfo> {
    const cache = get<SlackUserInfo>(bot)
    if (cache) {
      return cache
    }
    const res = await this.post<BotsInfoResponse>('bots.info', { bot })
    if (res.ok && res.bot) {
      const info: SlackUserInfo = {
        username: res.bot.name || '',
        icons: {
          image_64: res.bot.icons?.image_48 || '',
        },
        botType: (res.bot as any).is_workflow_bot ? 'ワークフロー' : 'アプリ',
      }
      set(bot, info)
      return info
    } else {
      console.warn(res.error)
      return { ...emptySlackUserInfo, username: bot }
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

  private async fetchMassages(channel: string, ts: string, limit: number, reply: boolean) {
    const params = {
      channel,
      oldest: ts,
      limit,
      inclusive: true,
    }
    let res: ConversationsHistoryResponse | ConversationsRepliesResponse
    if (reply) {
      res = await this.post<ConversationsRepliesResponse>('conversations.replies', { ...params, ts })
    } else {
      res = await this.post<ConversationsHistoryResponse>('conversations.history', params)
    }
    if (res.ok && res.messages) {
      console.log(res.messages)
      return sequential(res.messages.map(message => async () => {
        if (message.user && message.user !== 'USLACKBOT') {
          const userInfo = await this.fetchUserInfo(message.user)
          Object.assign(message, userInfo)
        } else if (message.bot_id) {
          const botInfo = await this.fetchBotInfo(message.bot_id)
          Object.assign(message, botInfo)
        }
        // TODO: 必要な項目のみ抽出
        set(`${channel}.${ts}`, message)
        return message2vm(this.team, channel, message)
      }))
    } else {
      return [errorMessage]
    }
  }

  private parseUrl(url: string) {
    const { pathname, search } = new URL(url)
    const [channel, pts] = pathname.split('/').slice(-2)
    const ts = `${pts.slice(1, -6)}.${pts.slice(-6)}`
    return { channel, ts, reply: !!search }
  }

  async fetchMessageFromUrl(url: string) {
    const { channel, ts, reply } = this.parseUrl(url)
    const cache = get<Message>(`${channel}.${ts}`)
    if (cache) {
      return message2vm(this.team, channel, cache)
    } else {
      const [message] = await this.fetchMassages(channel, ts, 1, reply)
      return message
    }
  }

  async fetchMessagesFromUrl(url: string, limit: number = 20) {
    const { channel, ts, reply } = this.parseUrl(url)
    const messages = await this.fetchMassages(channel, ts, limit, reply)
    // order by ts desc
    return messages.reverse()
  }
}

export default Slack
