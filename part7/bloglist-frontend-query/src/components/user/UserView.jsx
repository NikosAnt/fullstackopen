import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import usersService from '../../services/users'

const UserView = () => {
  const { id } = useParams()
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll
  })

  const user = users.find(u => u.id === id)
  if (!user) return <div>User not found.</div>

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {user.name}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Added blogs
      </Typography>
      <List>
        {user.blogs.map(blog => (
          <ListItem key={blog.id} disablePadding>
            <ListItemText primary={blog.title} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default UserView
