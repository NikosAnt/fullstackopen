import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, handleChangeLikes, handleRemoveBlog, canRemove }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const blogName = blog.title.replace(/\s+/g, '-')
  const toggleId = `blog-details-toggle-${blogName}`
  const detailsId = `blog-details-${blogName}`

  return (
    <article className="blog">
      <p>
        {blog.title} {blog.author}
      </p>
      <button
        id={toggleId}
        aria-label={`view details for ${blogName}`}
        aria-expanded={detailsVisible}
        aria-controls={detailsId}
        data-testid={`view-btn-${blogName}`}
        onClick={() => setDetailsVisible(!detailsVisible)}
      >
        {detailsVisible ? 'hide' : 'view'}
      </button>
      <section
        id={detailsId}
        aria-labelledby={toggleId}
        hidden={!detailsVisible}
      >
        <p>{blog.url}</p>
        <p aria-live="polite" data-testid={`likes-count-${blogName}`}>
          likes {blog.likes}
          <button
            onClick={handleChangeLikes}
            aria-label="like"
            data-testid={`like-btn-${blogName}`}
          >
            like
          </button>
        </p>
        <p>{blog.user.name}</p>
        {canRemove && (
          <button
            onClick={handleRemoveBlog}
            aria-label="delete"
            data-testid={`delete-btn-${blogName}`}
          >
            delete
          </button>
        )}
      </section>
    </article>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  handleChangeLikes: PropTypes.func.isRequired,
  handleRemoveBlog: PropTypes.func.isRequired,
  canRemove: PropTypes.bool.isRequired
}

export default Blog
