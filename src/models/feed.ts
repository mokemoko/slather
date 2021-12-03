import type { SlackUserInfo } from '../services/slack'
import { MessageViewModel } from './message'

export interface Feed {
  title: string
  description: string
  author_id: string
  created_ms: number
  message_links?: string[]
}

export interface FeedViewModel extends Feed {
  author: SlackUserInfo
  created: string
  messages?: MessageViewModel[]
}

export const feed2vm = (feed: Feed, user: SlackUserInfo): FeedViewModel => {
  return {
    ...feed,
    author: user,
    created: (new Date(feed.created_ms)).toLocaleString(),
  }
}
