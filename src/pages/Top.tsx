import React, { useEffect, useState } from 'react'
import {
  Alert,
  Grid,
  Paper,
} from '@mui/material'
import { useRecoilState } from 'recoil'
import { userState } from '../services/state'
import GitHub from '../services/github'
import type { FeedViewModel } from '../models/feed'
import { FeedItem, FeedItemSkeleton } from '../components/FeedItem'

const Top = (): JSX.Element => {
  const [user] = useRecoilState(userState)
  const [feeds, setFeeds] = useState<FeedViewModel[]>([])

  useEffect(() => {
    (async () => {
      if (!user) {
        return
      }
      const github = new GitHub(user)
      setFeeds(await github.fetchFeeds())
    })()
  }, [user])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={9}>
        {user ? feeds.map((feed, idx) => (
          <FeedItem key={idx} feed={feed}/>
        )) : (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>本サイトの利用には右上のアイコンからSlackにログインしてください</Alert>
            {[...Array(5)].map((_, idx) => <FeedItemSkeleton key={idx}/>)}
          </>
        )}
      </Grid>
      <Grid item xs={12} lg={3}>
        <Paper>検索</Paper>
      </Grid>
    </Grid>
  )
}

export default Top
