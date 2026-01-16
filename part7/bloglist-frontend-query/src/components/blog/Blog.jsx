import { Paper, Typography, Box } from '@mui/material'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const blogName = blog.title.replace(/\s+/g, '-')

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }} className="blog">
      <Box>
        <Typography
          variant="body1"
          component={Link}
          to={`/blogs/${blog.id}`}
          sx={{ textDecoration: 'none', color: 'primary.main' }}
        >
          {blogName}
        </Typography>
      </Box>
    </Paper>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired
}

export default Blog
