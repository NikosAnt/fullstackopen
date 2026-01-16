import type { JSX } from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { Button, Divider, Container, Typography } from '@mui/material'

const App = (): JSX.Element => {
  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: '0.5em' }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Outlet />
      </Container>
    </div>
  )
}

export default App
