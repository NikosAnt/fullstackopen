import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

const blog = {
  title: 'test blog',
  author: 'test author',
  url: 'test.test',
  likes: '21',
  user: {
    name: 'test admin'
  }
}

const setup = (overrides = {}) => {
  const props = {
    blog,
    handleChangeLikes: vi.fn(),
    handleRemoveBlog: vi.fn(),
    canRemove: false,
    ...overrides
  }

  render(<Blog {...props} />)
  const user = userEvent.setup()

  const get = {
    view: () => screen.getByRole('button', { name: /view/i }),
    like: () => screen.getByRole('button', { name: /like/i }),
    title: () => screen.getByText(blog.title, { exact: false }),
    author: () => screen.getByText(blog.author, { exact: false }),
    url: () => screen.getByText(blog.url, { exact: false }),
    likes: () => screen.getByText(/likes\s*21/i)
  }

  const openDetails = async () => {
    await user.click(get.view())
  }

  return { user, get, openDetails, props }
}

describe('<Blog />', () => {
  test('Renders title and author but not URL or likes', async () => {
    const { get } = setup()

    expect(get.title()).toBeVisible()
    expect(get.author()).toBeVisible()
    expect(screen.queryByRole('region')).toBeNull()
  })

  test('URL and likes are shown when view is clicked', async () => {
    const { get, openDetails } = setup()

    await openDetails()

    // Panel is now visible, so region should be present
    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(get.url()).toBeVisible()
    expect(get.likes()).toBeVisible()
  })

  test('Like button is clicked twice', async () => {
    const { user, get, openDetails, props } = setup()

    await openDetails()

    await user.click(get.like())
    await user.click(get.like())

    expect(props.handleChangeLikes).toHaveBeenCalledTimes(2)
  })
})
