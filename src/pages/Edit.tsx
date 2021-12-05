import React, { useState } from 'react'
import { Box, Button, Grid, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'
import MessageItem from '../components/MessageItem'
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import { Save as SaveIcon, Colorize as ColorizeIcon } from '@mui/icons-material'
import type { MessageViewModel } from '../models/message'
import Slack from '../services/slack'
import { useRecoilState } from 'recoil'
import { userState } from '../services/state'
import { blue, red } from '@mui/material/colors'
import { defaultFeedVM, feed2vm, FeedViewModel, feedVM2feed } from '../models/feed'
import { useNavigate, useParams } from 'react-router-dom'
import { useAsyncEffect } from '../utils/hook'
import GitHub from '../services/github'

const Edit = (): JSX.Element => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [srcMessages, setSrcMessages] = useState<MessageViewModel[]>([])
  const [feed, setFeed] = useState<FeedViewModel>(defaultFeedVM())
  const [user] = useRecoilState(userState)

  useAsyncEffect(async () => {
    if (!user || !id) return
    if (id === 'new') {
      setFeed({
        ...feed,
        author_id: user.id,
      })
    } else {
      const github = new GitHub(user)
      setFeed(await github.fetchFeed(id))
    }
  }, [user])

  const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      return
    }
    const src = result.source.droppableId === 'source' ? srcMessages : feed.messages!
    const dst = result.destination.droppableId === 'source' ? srcMessages : feed.messages!
    const [srcItem] = src.splice(result.source.index, 1)
    dst.splice(result.destination.index, 0, srcItem)
    setSrcMessages(srcMessages)
    setFeed({...feed})
  }

  const handleInputLink = async (url: string) => {
    if (!user) {
      return
    }
    const client = new Slack(user)
    const msg = await client.fetchMessagesFromUrl(url)
    setSrcMessages(msg)
  }

  const handleChange = (key: 'title' | 'description', value: string) => {
    feed[key] = value
    setFeed({...feed})
  }

  const handleSubmit = async () => {
    const github = new GitHub(user!)
    await github.postFeed(feedVM2feed(feed))
    navigate('/')
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 1, mb: 1 }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="抽出対象とするメッセージリンクを入力"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ColorizeIcon/>
                  </InputAdornment>
                ),
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleInputLink((e.target as any).value)}
            />
          </Paper>
          <Droppable
            droppableId="source"
            isDropDisabled
          >
            {((provided, snapshot) => (
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  p: 2,
                  height: 540,
                  overflow: 'scroll',
                }}
              >
                {srcMessages.map((message, idx) => (
                  <Draggable
                    key={idx}
                    draggableId={`source${idx}`}
                    index={idx}
                  >
                    {((provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          mb: 1,
                          bgcolor: snapshot.isDragging ? blue[100] : '',
                        }}
                      >
                        <MessageItem
                          message={message}
                        />
                      </Box>
                    ))}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Paper>
            ))}
          </Droppable>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Droppable droppableId="dest">
            {((provided, snapshot) => (
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  p: 2,
                  height: 596,
                  overflow: 'scroll',
                  bgcolor: snapshot.isDraggingOver ? red[50] : '',
                }}
              >
                {feed.messages!.map((message, idx) => (
                  <Draggable key={idx} draggableId={`dest${idx}`} index={idx}>
                    {((provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <MessageItem
                          message={message}
                        />
                      </Box>
                    ))}
                  </Draggable>
                ))}
                {feed.messages!.length > 0 ? provided.placeholder : (
                  <Box
                    sx={{
                      display: 'flex',
                      height: 564,
                      border: '3px dashed grey',
                      borderRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6">
                      抽出したメッセージを選んでここにドラッグ&ドロップ
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Droppable>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={1}>
              <TextField
                fullWidth
                placeholder="まとめのタイトル"
                value={feed.title}
                onChange={e => handleChange('title', e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="まとめの説明文（省略可）"
                value={feed.description}
                onChange={e => handleChange('description', e.target.value)}
              />
              <Button
                variant="contained"
                size="large"
                fullWidth
                disableElevation
                startIcon={<SaveIcon/>}
                onClick={handleSubmit}
              >
                この内容で作成
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </DragDropContext>
  )
}

export default Edit
