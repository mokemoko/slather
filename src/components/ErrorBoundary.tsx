import React from 'react'
import { Alert, AlertTitle, Avatar, Box, Chip, Snackbar, Stack, Typography } from '@mui/material'

interface Props {
}

interface State {
  error?: Error
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error })
  }

  render() {
    return (
      <>
        {this.state.error ? (
          <Snackbar open>
            <Alert severity="error">
              <AlertTitle>{this.state.error.name}</AlertTitle>
              {this.state.error.message}
            </Alert>
          </Snackbar>
        ) : this.props.children}
      </>
    )
  }
}

export default ErrorBoundary
