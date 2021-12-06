import { AppBar, Button, Snackbar, Toolbar, Tooltip, Typography, Alert } from '@mui/material'
import { List, Add } from '@mui/icons-material'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { userState } from '../services/state'
import UserMenu from './UserMenu'
import { useNavigate } from 'react-router-dom'

const Navigation = (): JSX.Element => {
  const [user] = useRecoilState(userState)
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const navigate = useNavigate()

  const handleClickCreate = () => {
    if (user) {
      navigate('/edit/new')
    } else {
      setIsOpenAlert(true)
    }
  }

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Slather
          </Typography>
          <Button
            color="inherit"
            startIcon={<List/>}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            一覧を見る
          </Button>
          <Button
            color="inherit"
            startIcon={<Add/>}
            onClick={handleClickCreate}
          >
            まとめを作成する
          </Button>
          <UserMenu/>
        </Toolbar>
      </AppBar>
      <Snackbar
        open={isOpenAlert}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setIsOpenAlert(false)}
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          Githubでログインするとまとめを作成できます
        </Alert>
      </Snackbar>
    </>
  )
}

export default Navigation
