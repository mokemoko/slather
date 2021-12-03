import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userState } from '../services/state'
import { useAsyncEffect } from '../utils/hook'
import GitHub from '../services/github'
import { FeedViewModel } from '../models/feed'
import { Alert, AlertTitle, Paper, Snackbar, Stack } from '@mui/material'
import { FeedItem } from '../components/FeedItem'
import MessageItem from '../components/MessageItem'

const Detail = (): JSX.Element => {
  const { id } = useParams()
  const [user] = useRecoilState(userState)
  const [feed, setFeed] = useState<FeedViewModel | null>(null)

  useAsyncEffect(async () => {
    if (!user || !id) return

    const github = new GitHub(user)
    setFeed(await github.fetchFeed(id))
  }, [user])

  return (
    (feed ? (
      <>
        <Paper>
          <FeedItem feed={feed} />
        </Paper>
        <Paper>
          <Stack spacing={1} sx={{ p: 2 }}>
            {feed.messages?.map((message, idx) => (
              <MessageItem key={idx} message={message} />
            ))}
          </Stack>
        </Paper>
        <Snackbar open>
          <Alert severity="error">
            <AlertTitle>title</AlertTitle>
            message
          </Alert>
        </Snackbar>
      </>
    ) : <></>)
  )
}

export default Detail
