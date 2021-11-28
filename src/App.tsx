import React from 'react'
import Edit from './pages/Edit'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Detail from './pages/Detail'
import Top from './pages/Top'
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { grey } from '@mui/material/colors'
import Navigation from './components/Navigation'

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
      <Navigation/>
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <CssBaseline/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Top/>}/>
            <Route path="/detail/:id" element={<Detail/>}/>
            <Route path="/edit/:id" element={<Edit/>}/>
          </Routes>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  )
}

export default App
