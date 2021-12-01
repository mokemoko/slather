import { Avatar, Card, CardActionArea, CardContent, CardHeader, Skeleton, Typography } from '@mui/material'
import React from 'react'
import type { FeedViewModel } from '../models/feed'
import { useNavigate } from 'react-router-dom'

interface Props {
  feed: FeedViewModel
}

const FeedItem = ({ feed }: Props) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/detail/${feed.created_ms}`)
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography variant="h6">{feed.title}</Typography>
          <Typography variant="body1">{feed.description}</Typography>
        </CardContent>
        <CardHeader
          avatar={
            <Avatar src={feed.author.icons.image_64}/>
          }
          title={`created by ${feed.author.username}`}
          subheader={`at ${feed.created}`}
          sx={{
            justifyContent: 'flex-end',
            '& .MuiCardHeader-content': {
              flex: '0 auto',
            },
          }}
        />
      </CardActionArea>
    </Card>
  )
}

const FeedItemSkeleton = () => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Skeleton animation={false} width="40%"/>
        <Skeleton animation={false}/>
        <Skeleton animation={false} width="70%"/>
        <Skeleton animation={false} width="90%"/>
      </CardContent>
      <CardHeader
        avatar={
          <Skeleton variant="circular" animation={false} width={40} height={40}/>
        }
        title={<Skeleton animation={false} width={150}/>}
        subheader={<Skeleton animation={false} width={100}/>}
        sx={{
          justifyContent: 'flex-end',
          '& .MuiCardHeader-content': {
            flex: '0 auto',
          },
        }}
      />
    </Card>
  )
}

export { FeedItem, FeedItemSkeleton }
