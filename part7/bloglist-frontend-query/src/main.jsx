import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { NotificationProvider } from './components/notification/NotificationProvider'
import { UserProvider } from './components/user/UserProvider'

const queryClient = new QueryClient()
const theme = createTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NotificationProvider>
          <UserProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </UserProvider>
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
