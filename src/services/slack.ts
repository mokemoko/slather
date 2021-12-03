import { AuthTestResponse, ConversationsHistoryResponse, UsersProfileGetResponse } from '@slack/web-api'
import axios from 'axios'
import { UserServiceInfo } from '../models/user'
import { get, set } from '../utils/cache'
import { message2vm, Message } from '../models/message'

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

  async post<T>(method: string, params: any) {
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

  async fetchMassage(channel: string, ts: string) {
    const key = `${channel}.${ts}`
    let message = get<Message>(key)
    if (!message) {
      const params = {
        channel,
        oldest: ts,
        limit: 1,
        inclusive: true,
      }
      const res = await this.post<ConversationsHistoryResponse>('conversations.history', params)
      if (res.ok && res.messages) {
        const [_message] = res.messages
        if (_message.user) {
          const userInfo = await this.fetchUserInfo(_message.user)
          Object.assign(_message, userInfo)
        }
        message = _message
        // TODO: 必要な項目のみ抽出
        set(key, message)
      } else {
        throw res.error
      }
    }
    return message2vm(this.team, channel, message)
  }

  async fetchMessageFromUrl(url: string) {
    const [channel, pts] = url.split('/').slice(-2)
    const ts = `${pts.slice(1, -6)}.${pts.slice(-6)}`
    return this.fetchMassage(channel, ts)
  }
}

export default Slack
