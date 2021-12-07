import axios, { AxiosInstance } from 'axios'
import type { Feed } from '../../models/feed'
import type { User } from '../../models/user'
import Slack from '../slack'
import { sequential } from '../../utils/promise'
import { feed2vm } from '../../models/feed'
import { feedTemplate, apiPath4content } from './util'
import { UserServiceInfo } from '../../models/user'

interface GitHubUserInfo {
  id: string
  login: string
  avatar_url: string
}

class GitHub {
  token?: string
  pageClient: AxiosInstance
  apiClient: AxiosInstance
  slack?: Slack

  constructor(token: string)
  constructor(user: User)
  constructor(param: string | User) {
    if (typeof param === 'string') {
      this.token = param
    } else {
      this.slack = new Slack(param)
      this.token = param.githubInfo?.token
    }
    this.pageClient = axios.create({
      baseURL: import.meta.env.VITE_GITHUB_PAGES_BASE,
    })
    this.apiClient = axios.create({
      baseURL: import.meta.env.VITE_GITHUB_API_BASE,
      headers: {
        Authorization: `token ${this.token}`,
      },
    })
  }

  async checkAuth(): Promise<UserServiceInfo> {
    const { data } = await this.apiClient.get<GitHubUserInfo>('/user')
    return {
      id: data.id,
      team: '',
      name: data.login,
      image: data.avatar_url,
      token: this.token!,
    }
  }

  async fetchFeeds() {
    const res = await this.pageClient.get<Feed[]>('/data/all.json', {
      params: { ts: (new Date()).getTime() },
    })
    return await sequential(res.data.map(async feed => {
      const user = await this.slack!.fetchUserInfo(feed.author_id)
      return feed2vm(feed, user)
    }))
  }

  async fetchFeed(id: string) {
    const res = await this.pageClient.get<Feed>(`/feeds/${id}.json`, {
      params: { ts: (new Date()).getTime() },
    })
    const feed = res.data
    const user = await this.slack!.fetchUserInfo(feed.author_id)
    const vm = feed2vm(feed, user)
    vm.messages = await sequential(feed.message_links!.map(async url => await this.slack!.fetchMessageFromUrl(url)))
    return vm
  }

  private async fetchFeedSha(feed: Feed) {
    try {
      const res = await this.apiClient.get<{ sha: string }>(apiPath4content(feed))
      return res.data.sha
    } catch (e) {
      return null
    }
  }

  async postFeed(feed: Feed) {
    const sha = await this.fetchFeedSha(feed)
    await this.apiClient.put<Feed>(apiPath4content(feed), {
      message: sha ? 'update feed' : 'add feed',
      content: btoa(unescape(encodeURIComponent(feedTemplate(feed)))),
      sha,
    })
  }

  async deleteFeed(feed: Feed) {
    const sha = await this.fetchFeedSha(feed)
    await this.apiClient.delete<Feed>(apiPath4content(feed), {
      data: {
        message: 'remove feed',
        sha,
      },
    })
  }
}

export default GitHub
