import axios from 'axios'
import type { Feed } from '../models/feed'
import type { User } from '../models/user'
import Slack from './slack'
import { sequential } from '../utils/promise'
import { feed2vm } from '../models/feed'

class GitHub {
  token?: string
  slack: Slack

  constructor(user: User) {
    this.slack = new Slack(user)
    if (user.githubInfo) {
      this.token = user.githubInfo.token
    }
  }

  async fetchFeeds() {
    const res = await axios.get<Feed[]>(import.meta.env.VITE_GITHUB_PAGES_BASE + '/data/all.json')
    return await sequential(res.data.map(async feed => {
      const user = await this.slack.fetchUserInfo(feed.author_id)
      return feed2vm(feed, user)
    }))
  }

  async fetchFeed(id: string) {
    const res = await axios.get<Feed>(import.meta.env.VITE_GITHUB_PAGES_BASE + `/feeds/${id}.json`)
    const feed = res.data
    const user = await this.slack.fetchUserInfo(feed.author_id)
    const vm = feed2vm(feed, user)
    vm.messages = await sequential(feed.message_links!.map(async url => await this.slack.fetchMessageFromUrl(url)))
    return vm
  }
}

export default GitHub
