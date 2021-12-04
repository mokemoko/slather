import React from 'react'
import { Alert, AlertTitle, Snackbar } from '@mui/material'
import axios from 'axios'

interface Props {
}

interface State {
  error?: Error
}

const setupInterceptor = (cb: (err: Error) => void) => {
  axios.interceptors.response.use(res => res, cb)
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    setupInterceptor(error => this.setState({ error }))
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error })
  }

  render() {
    return (
      <>
        {this.props.children}
        {this.state.error && (
          <Snackbar open>
            <Alert severity="error">
              <AlertTitle>{this.state.error.name}</AlertTitle>
              {this.state.error.message}
            </Alert>
          </Snackbar>
        )}
      </>
    )
  }
}

export default ErrorBoundary
