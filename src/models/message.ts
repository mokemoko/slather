import type { Message as MessageType } from '@slack/web-api/dist/response/ConversationsHistoryResponse'

export type Message = MessageType

export type MessageViewModel = Message & {
  avatarUrl?: string,
  date: string,
  link: string,
  botType?: 'アプリ' | 'ワークフロー',
}

export const errorMessage: MessageViewModel = {
  text: '表示できないメッセージです',
  date: '',
  link: '',
} as const

// util

const ts2localeString = (ts: string) => {
  const date = new Date(parseInt(ts) * 1000)
  return date.toLocaleString()
}

const message2url = (team: string, channel: string, message: Message) => {
  // TODO: consider thread
  const pts = `p${message.ts?.replace(/\./, '')}`
  return `https://${team}.slack.com/archives/${channel}/${pts}`
}

export const message2vm = (team: string, channel: string, message: Message): MessageViewModel => {
  return {
    ...message,
    username: message.username || message.bot_profile?.name,
    // TODO: consider emoji icon
    avatarUrl: message.icons?.image_64,
    date: ts2localeString(message.ts!),
    link: message2url(team, channel, message),
  }
}
