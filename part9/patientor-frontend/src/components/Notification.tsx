import type { JSX } from 'react'
import { Snackbar, Alert } from '@mui/material'

interface NotificationProps {
  open: boolean
  message: string
  severity: 'success' | 'error'
  onClose: () => void
}

export const Notification = ({
  open,
  message,
  severity,
  onClose
}: NotificationProps): JSX.Element => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
)
