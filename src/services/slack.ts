import { AuthTestResponse, ConversationsHistoryResponse, UsersProfileGetResponse } from '@slack/web-api'
import axios from 'axios'
import { UserServiceInfo } from '../models/user'

const baseUrl = 'https://slack.com/api/'

class Slack {
  token: string

  constructor(token: string) {
    this.token = token
  }

  async post<T>(method: string, params: any) {
    const data = new URLSearchParams({
      token: this.token,
      ...params,
    })
    const res = await axios.post<T>(baseUrl + method, data)
    return res.data
  }

  async fetchUserInfo(): Promise<UserServiceInfo> {
    const profileRes = await this.post<UsersProfileGetResponse>('users.profile.get', {})
    const authRes = await this.post<AuthTestResponse>('auth.test', {})
    if (profileRes.ok && authRes.ok) {
      return {
        id: authRes.user_id!,
        name: profileRes.profile?.display_name || '',
        image: profileRes.profile?.image_48 || '',
        token: this.token,
      }
    } else {
      throw profileRes.error || authRes.error
    }
  }

  async fetchMassage(channel: string, ts: string) {
    const params = {
      channel,
      oldest: ts,
      limit: 1,
    }
    const res = await this.post<ConversationsHistoryResponse>('conversations.history', params)
    if (res.ok && res.messages) {
      return res.messages[0]
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
