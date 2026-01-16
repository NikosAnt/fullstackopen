import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import usersService from '../../services/users'

const UsersView = () => {
  const {
    data: users = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll
  })

  if (isLoading) return <div>Loading users...</div>
  if (isError) return <div>Error loading users.</div>

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Users
      </Typography>
      <List>
        {users.map(user => (
          <ListItem
            key={user.id}
            disablePadding
            component={Link}
            to={`/users/${user.id}`}
            button="true"
          >
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default UsersView
