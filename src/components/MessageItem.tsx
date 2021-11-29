import React from 'react'
import type { MessageViewModel } from '../models/message'
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material'

interface Props {
  message: MessageViewModel
}

const MessageItem = ({ message }: Props): JSX.Element => {
  return (
    <Box>
      <Stack direction="row">
        <Avatar
          sx={{ m: 1 }}
          src={message.avatarUrl}
        />
        <Stack direction="column" sx={{ flexGrow: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{message.username}</Typography>
            {message.bot_id && (
              <Chip
                size="small"
                label="アプリ"
                sx={{ height: 18, borderRadius: 0.5, fontSize: 11 }}
              />
            )}
            <Typography variant="body2">{message.date}</Typography>
          </Stack>
          <Typography variant="body1">{message.text}</Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default MessageItem
