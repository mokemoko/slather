import type { MessageViewModel } from './message'
import type { SlackUserInfo } from '../services/slack'

export interface Feed {
  title: string
  description: string
  author_id: string
  created_ms: number
  messages?: MessageViewModel[]
}

export interface FeedViewModel extends Feed {
  author: SlackUserInfo
  created: string
}

export const feed2vm = (feed: Feed, user: SlackUserInfo): FeedViewModel => {
  return {
    ...feed,
    author: user,
    created: (new Date(feed.created_ms)).toLocaleString(),
  }
}
