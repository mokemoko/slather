import React from 'react'
import Edit from './pages/Edit'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Detail from './pages/Detail'
import Top from './pages/Top'
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { grey } from '@mui/material/colors'
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'
import env from './utils/env'

const theme = createTheme({
  palette: {
    background: {
      default: grey.A100,
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <BrowserRouter basename={env.routeBase}>
          <Navigation/>
          <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
            <CssBaseline/>
            <Routes>
              <Route path="/" element={<Top/>}/>
              <Route path="/detail/:id" element={<Detail/>}/>
              <Route path="/edit/:id" element={<Edit/>}/>
            </Routes>
          </Container>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
