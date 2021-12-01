import { AuthTestResponse, ConversationsHistoryResponse, UsersProfileGetResponse } from '@slack/web-api'
import axios from 'axios'
import { UserServiceInfo } from '../models/user'
import { get, set } from '../utils/cache'
import { message2vm } from '../models/message'

const baseUrl = 'https://slack.com/api/'

interface SlackUserInfo {
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

  async fetchUserInfo(user: string) {
    const cache = get<SlackUserInfo>(user)
    if (cache) {
      return cache
    }
    const res = await this.post<UsersProfileGetResponse>('users.profile.get', { user })
    if (res.ok) {
      const info = {
        username: res.profile?.display_name,
        icons: {
          image_64: res.profile?.image_48,
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
    const params = {
      channel,
      oldest: ts,
      limit: 1,
      inclusive: true,
    }
    const res = await this.post<ConversationsHistoryResponse>('conversations.history', params)
    if (res.ok && res.messages) {
      const [message] = res.messages
      if (message.user) {
        const userInfo = await this.fetchUserInfo(message.user)
        Object.assign(message, userInfo)
      }
      return message2vm(this.team, channel, message)
    } else {
      throw res.error
    }
  }

  async fetchMessageFromUrl(url: string) {
    const [channel, pts] = url.split('/').slice(-2)
    const ts = `${pts.slice(1, -6)}.${pts.slice(-6)}`
    return this.fetchMassage(channel, ts)
  }
}

export default Slack
