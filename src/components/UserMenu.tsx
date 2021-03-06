import React, { useState } from 'react'
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent, Link,
} from '@mui/material'
import { Logout as LogoutIcon, GitHub as GitHubIcon } from '@mui/icons-material'
import { useRecoilState } from 'recoil'
import { userState } from '../services/state'
import Slack from '../services/slack'
import GitHub from '../services/github'
import env from '../utils/env'

type InputType = 'Slack' | 'GitHub'

const UserMenu = () => {
  const [user, setUser] = useRecoilState(userState)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [currentInput, setCurrentInput] = useState<InputType | null>(null)

  const handleEnterToken = async (token: string) => {
    if (currentInput === 'Slack') {
      const client = new Slack(token)
      const user = await client.checkAuth()
      setUser(user)
    } else {
      const client = new GitHub(token)
      const githubInfo = await client.checkAuth()
      setUser({
        ...user!,
        githubInfo,
      })
    }
    setCurrentInput(null)
  }

  return (
    <>
      <IconButton
        size="small"
        sx={{ ml: 2 }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Avatar
          sx={{ width: 32, height: 32 }}
          src={user?.image}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => user || setCurrentInput('Slack')}
        >
          <ListItemIcon>
            <img src="https://cdn.brandfolder.io/5H442O3W/at/pl546j-7le8zk-6gwiyo/Slack_Mark.svg"/>
          </ListItemIcon>
          {user ? (
            <>
              <Avatar src={user.image} sx={{ width: 24, height: 24 }}/>
              {user.name}
            </>
          ) : (
            <>Slack???????????????</>
          )}
        </MenuItem>
        <MenuItem
          disabled={!user}
          onClick={() => setCurrentInput('GitHub')}
        >
          <ListItemIcon sx={{ justifyContent: 'center' }}>
            <GitHubIcon fontSize="small"/>
          </ListItemIcon>
          {user?.githubInfo ? (
            <>
              <Avatar src={user.githubInfo.image} sx={{ width: 24, height: 24 }}/>
              {user.githubInfo.name}
            </>
          ) : (
            <>GitHub???????????????</>
          )}
        </MenuItem>
        {user && [
          <Divider key={1}/>,
          <MenuItem
            key={2}
            onClick={() => setUser(null)}
          >
            <ListItemIcon sx={{ justifyContent: 'center' }}>
              <LogoutIcon fontSize="small"/>
            </ListItemIcon>
            ???????????????
          </MenuItem>,
        ]}
      </Menu>
      <Dialog open={!!currentInput} onClose={() => setCurrentInput(null)}>
        <DialogTitle>{currentInput}???Token???????????????????????????</DialogTitle>
        <DialogContent>
          <Link
            target="_blank"
            rel="noreferrer"
            href={currentInput === 'Slack' ? env.slackTokenLink : env.gitHubTokenLink}
          >
            ??????
          </Link>
          ????????????????????????
          <TextField
            variant="outlined"
            fullWidth
            onKeyDown={(e) => e.key === 'Enter' && handleEnterToken((e.target as any).value)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserMenu
