import { Paper, Typography, Button, TextField, Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { getAll } from '../../services/blogs'

const BlogView = ({ handleChangeLikes, handleAddComment }) => {
  const { id } = useParams()
  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll
  })

  const blog = blogs.find(b => b.id === id)
  const [comment, setComment] = useState('')
  if (!blog) return <div>Blog not found</div>

  const blogName = blog.title.replace(/\s+/g, '-')

  const handleCommentChange = e => setComment(e.target.value)
  const handleSubmitComment = e => {
    e.preventDefault()
    handleAddComment(blog.id, comment)
    setComment('')
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {blog.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        <a
          href={blog.url.startsWith('http') ? blog.url : `http://${blog.url}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1976d2', textDecoration: 'underline' }}
        >
          {blog.url}
        </a>
      </Typography>
      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        <Typography
          variant="body1"
          aria-live="polite"
          data-testid={`likes-count-${blogName}`}
          sx={{ mr: 2 }}
        >
          likes {blog.likes}
        </Typography>
        <Button
          onClick={() => handleChangeLikes(blog)}
          aria-label="like"
          data-testid={`like-btn-${blogName}`}
          variant="contained"
          color="primary"
          size="small"
        >
          Like
        </Button>
      </Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        added by {blog.author}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmitComment}
        sx={{ display: 'flex', gap: 1, mb: 2 }}
      >
        <TextField
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add a comment"
          size="small"
          fullWidth
        />
        <Button type="submit" variant="contained" color="secondary">
          Add comment
        </Button>
      </Box>
      <Box component="ul" sx={{ pl: 2, mb: 0 }}>
        {blog.comments?.map((comment, idx) => (
          <li key={idx}>
            <Typography variant="body2" component="span">
              {comment}
            </Typography>
          </li>
        ))}
      </Box>
    </Paper>
  )
}

BlogView.propTypes = {
  handleChangeLikes: PropTypes.func,
  handleAddComment: PropTypes.func
}

export default BlogView
