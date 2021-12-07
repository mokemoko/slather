import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userState } from '../services/state'
import { useAsyncEffect } from '../utils/hook'
import GitHub from '../services/github'
import { FeedViewModel, feedVM2text } from '../models/feed'
import { Button, Paper, Stack } from '@mui/material'
import { ContentPaste as ContentPasteIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { FeedItem } from '../components/FeedItem'
import MessageItem from '../components/MessageItem'

const Detail = (): JSX.Element => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user] = useRecoilState(userState)
  const [feed, setFeed] = useState<FeedViewModel | null>(null)
  const [github, setGithub] = useState<GitHub | null>(null)
  const canEdit = useMemo(() => {
    return user?.githubInfo && feed?.author_id === user?.id
  }, [user, feed])

  useAsyncEffect(async () => {
    if (!user || !id) return

    const client = new GitHub(user)
    setGithub(client)
    setFeed(await client.fetchFeed(id))
  }, [user])

  const handleDelete = async () => {
    if (!github || !feed) return
    await github.deleteFeed(feed)
    navigate('/')
  }

  const handleCopy = async () => {
    if (!feed) return
    await navigator.clipboard.writeText(feedVM2text(feed))
  }

  return (
    (feed ? (
      <>
        <Stack direction="row" justifyContent="end" spacing={1} sx={{ mb: 1 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{ width: 120 }}
            startIcon={<ContentPasteIcon/>}
            onClick={handleCopy}
          >
            コピー
          </Button>
          <Button
            variant="contained"
            size="large"
            sx={{ width: 120 }}
            startIcon={<EditIcon/>}
            disabled={!canEdit}
            onClick={() => navigate(`/edit/${feed?.created_ms}`)}
          >
            編集
          </Button>
          <Button
            variant="contained"
            size="large"
            color="error"
            sx={{ width: 120 }}
            startIcon={<DeleteIcon/>}
            disabled={!canEdit}
            onClick={handleDelete}
          >
            削除
          </Button>
        </Stack>
        <Paper>
          <FeedItem feed={feed}/>
        </Paper>
        <Paper>
          <Stack spacing={1} sx={{ p: 2 }}>
            {feed.messages?.map((message, idx) => (
              <MessageItem key={idx} message={message}/>
            ))}
          </Stack>
        </Paper>
      </>
    ) : <></>)
  )
}

export default Detail
