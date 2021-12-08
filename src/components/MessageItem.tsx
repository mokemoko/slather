import React, { useMemo } from 'react'
import type { MessageViewModel } from '../models/message'
import { Avatar, Box, Chip, Link, Stack, Typography } from '@mui/material'
import { BlockBase, QuoteBase } from './TextComponent'
import TextComponents from './TextComponent'

interface Props {
  message: MessageViewModel
}

const MessageItem = ({ message }: Props): JSX.Element => {
  const textComponent = useMemo(() => {
    return <TextComponents message={message.text || ''}/>
  }, [message])

  return (
    <Box>
      <Stack direction="row">
        <Avatar
          sx={{ borderRadius: 1, m: 1 }}
          src={message.avatarUrl}
        />
        <Stack direction="column" sx={{ flexGrow: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{message.username}</Typography>
            {message.bot_id && (
              <Chip
                size="small"
                label="アプリ"
                sx={{ height: 18, borderRadius: 0.5, fontSize: 11 }}
              />
            )}
            <Link
              variant="inherit"
              target="_blank"
              rel="noreferrer"
              href={message.link}
            >
              <Typography variant="body2">{message.date}</Typography>
            </Link>
          </Stack>
          <Box whiteSpace="break-spaces" sx={{ wordBreak: 'break-all' }}>
            {textComponent}
            {message.attachments?.map((attach, idx) => (
              <span key={idx}>
                <TextComponents message={attach.pretext || ''}/>
                <QuoteBase color={`#${attach.color || 'ddd'}`}>
                  <span style={{ fontWeight: 'bold' }}>{attach.title}</span>
                </QuoteBase>
                <QuoteBase color={`#${attach.color || 'ddd'}`}>
                  <TextComponents message={attach.text || ''}/>
                </QuoteBase>
              </span>
            ))}
            {message.files?.map((file, idx) => (
              <BlockBase key={idx} color="">
                <Typography style={{ fontWeight: 'bold' }}>{file.title}</Typography>
                {file.preview_plain_text}
              </BlockBase>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}

export default MessageItem
