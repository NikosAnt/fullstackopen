import { Paper, Typography, Box, TextField, Button } from '@mui/material'
import PropTypes from 'prop-types'

const BlogForm = ({ values, onChange, onSubmit }) => (
  <>
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Create new blog
      </Typography>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          id="title"
          name="title"
          label="Title"
          value={values.title}
          onChange={onChange}
          placeholder="Title"
          fullWidth
          required
        />
        <TextField
          id="author"
          name="author"
          label="Author"
          value={values.author}
          onChange={onChange}
          placeholder="Author"
          fullWidth
          required
        />
        <TextField
          id="url"
          name="url"
          label="URL"
          value={values.url}
          onChange={onChange}
          placeholder="URL"
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </Box>
    </Paper>
  </>
)

BlogForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
}

export default BlogForm
