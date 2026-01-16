import PropTypes from 'prop-types'

const BlogForm = ({ values, onChange, onSubmit }) => (
  <>
    <h2>create new</h2>
    <form onSubmit={onSubmit} aria-label="create blog">
      <label htmlFor="title">
        title:
        <input
          type="text"
          name="title"
          id="title"
          value={values.title}
          onChange={onChange}
          placeholder="write blog title here"
        />
      </label>
      <label htmlFor="author">
        author:
        <input
          type="text"
          name="author"
          id="author"
          value={values.author}
          onChange={onChange}
          placeholder="write blog author here"
        />
      </label>
      <label htmlFor="url">
        url:
        <input
          type="text"
          name="url"
          id="url"
          value={values.url}
          onChange={onChange}
          placeholder="write blog url here"
        />
      </label>
      <button type="submit">create</button>
    </form>
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
