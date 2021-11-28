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
  DialogContent,
} from '@mui/material'
import Logout from '@mui/icons-material/Logout'
import { useRecoilState } from 'recoil'
import { userState } from '../services/state'
import { GitHub } from '@mui/icons-material'
import Slack from '../services/slack'

type InputType = 'Slack' | 'GitHub'

const UserMenu = () => {
  const [user, setUser] = useRecoilState(userState)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [currentInput, setCurrentInput] = useState<InputType | null>(null)

  const handleEnterToken = async (token: string) => {
    if (currentInput === 'Slack') {
      const client = new Slack(token)
      const user = await client.fetchUserInfo()
      setUser(user)
    } else {
      // TODO: add
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
          {user ? [
            <Avatar src={user.image} sx={{ width: 24, height: 24 }}/>,
            user.name,
          ] : (
            <>Slackでログイン</>
          )}
        </MenuItem>
        <MenuItem
          disabled={!user}
          onClick={() => setCurrentInput('GitHub')}
        >
          <ListItemIcon sx={{ justifyContent: 'center' }}>
            <GitHub fontSize="small"/>
          </ListItemIcon>
          {user?.githubInfo ? [
            <Avatar src={user.githubInfo.image} sx={{ width: 24, height: 24 }}/>,
            user.githubInfo.name,
          ] : (
            <>GitHubでログイン</>
          )}
        </MenuItem>
        {user && [
          <Divider/>,
          <MenuItem
            onClick={() => setUser(null)}
          >
            <ListItemIcon>
              <Logout fontSize="small"/>
            </ListItemIcon>
            ログアウト
          </MenuItem>,
        ]}
      </Menu>
      <Dialog open={!!currentInput} onClose={() => setCurrentInput(null)}>
        <DialogTitle>{currentInput}のTokenを入力してください</DialogTitle>
        <DialogContent>
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
