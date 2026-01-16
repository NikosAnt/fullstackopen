import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropTypes from 'prop-types'

import BlogForm from './BlogForm'
import { useBlogForm } from './useBlogForm'

const BlogFormWithHook = ({ onSubmit }) => {
  const { values, handleChange, handleSubmit } = useBlogForm({
    onSubmit
  })
  return (
    <BlogForm values={values} onChange={handleChange} onSubmit={handleSubmit} />
  )
}

BlogFormWithHook.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const spy = vi.fn()
  render(<BlogFormWithHook onSubmit={spy} />)

  await user.type(screen.getByPlaceholderText(/title/i), 'test title')
  await user.type(screen.getByPlaceholderText(/author/i), 'test author')
  await user.type(screen.getByPlaceholderText(/url/i), 'test.test')
  await user.click(screen.getByRole('button', { name: /create/i }))

  expect(spy).toHaveBeenCalledWith({
    title: 'test title',
    author: 'test author',
    url: 'test.test'
  })
})
