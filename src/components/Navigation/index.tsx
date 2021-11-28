import { AppBar, Avatar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'

const Navigation = (): JSX.Element => {
  const [user, setUser] = useState<Record<string, any> | null>(null)

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Slather
        </Typography>
        {user ? (
          <IconButton
            color="inherit"
            onClick={() => setUser(null)}
          >
            <Avatar/>
          </IconButton>
        ) : (
          <Button
            color="inherit"
            onClick={() => setUser({})}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
