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

export const defaultFeed = (): Feed => ({
  title: '',
  description: '',
  author_id: '',
  created_ms: (new Date()).getTime(),
  message_links: [],
})

export const defaultFeedVM = (): FeedViewModel => ({
  ...feed2vm(defaultFeed(), {
    username: '',
    icons: {
      image_64: '',
    },
  }),
  messages: [],
})

export const feed2vm = (feed: Feed, user: SlackUserInfo): FeedViewModel => {
  return {
    ...feed,
    author: user,
    created: (new Date(feed.created_ms)).toLocaleString(),
  }
}

export const feedVM2feed = (vm: FeedViewModel): Feed => {
  return {
    title: vm.title,
    description: vm.description,
    author_id: vm.author_id,
    created_ms: vm.created_ms,
    message_links: vm.messages?.map(m => m.link),
  }
}

export const feedVM2text = (vm: FeedViewModel): string => {
  return [
    `# ${vm.title}`,
    vm.description,
    `created by ${vm.author.username} at ${vm.created}`,
    '---',
    (vm.messages || []).map(message => [
      `${message.username} ${message.date}`,
      message.text,
    ].join('\n')).join('\n\n'),
  ].join('\n')
}
