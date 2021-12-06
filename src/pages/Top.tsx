import React, { useMemo, useState } from 'react'
import { Alert, FormControlLabel, FormGroup, Grid, Paper, Switch, TextField, } from '@mui/material'
import { useRecoilState } from 'recoil'
import { userState } from '../services/state'
import GitHub from '../services/github'
import type { FeedViewModel } from '../models/feed'
import { FeedItem, FeedItemSkeleton } from '../components/FeedItem'
import { useAsyncEffect } from '../utils/hook'

const Top = (): JSX.Element => {
  const [user] = useRecoilState(userState)
  const [feeds, setFeeds] = useState<FeedViewModel[]>([])
  const [searchText, setSearchText] = useState('')
  const [ownFlg, setOwnFlg] = useState(false)
  const filteredFeeds = useMemo(() => {
    return feeds
      .filter(feed => feed.author_id === user?.id)
      .filter(feed => feed.title.match(searchText) || feed.description.match(searchText))
  }, [feeds, ownFlg, searchText])

  useAsyncEffect(async () => {
    if (!user) return

    const github = new GitHub(user)
    setFeeds(await github.fetchFeeds())
  }, [user])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={9}>
        {user ? filteredFeeds.map((feed, idx) => (
          <FeedItem key={idx} feed={feed} clickable/>
        )) : (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>本サイトの利用には右上のアイコンからSlackにログインしてください</Alert>
            {[...Array(5)].map((_, idx) => <FeedItemSkeleton key={idx}/>)}
          </>
        )}
      </Grid>
      <Grid item xs={12} lg={3}>
        <Paper sx={{ p: 2 }}>
          <FormGroup>
            <TextField
              variant="standard"
              fullWidth
              placeholder="検索"
              sx={{ mb: 2 }}
              onChange={e => setSearchText(e.target.value)}
            />
            <FormControlLabel
              label="自分が投稿したもの"
              control={<Switch onChange={e => setOwnFlg(e.target.checked)}/>}
            />
          </FormGroup>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Top
