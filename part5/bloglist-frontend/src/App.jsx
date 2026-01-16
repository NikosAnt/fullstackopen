import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useBlogForm } from './components/useBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUserName] = useState('')
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      const initialBlogs = await blogService.getAll()
      setBlogs(initialBlogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const flash = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const login = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUserName('')
      setPassword('')
    } catch (error) {
      flash('error', error.response?.data?.error || 'Wrong credentials')
    }
  }

  const createBlog = async data => {
    try {
      const created = await blogService.create(data)
      setBlogs(prev => prev.concat(created))
      flash('notification', `Added blog "${data.title}"`)
    } catch (error) {
      flash('error', error.response?.data?.error || 'Error creating blog')
    }
  }

  const removeBlog = async blog => {
    const id = blog.id
    const confirmMsg = `Remove blog "${blog.title}" by ${blog.author}?`
    if (!window.confirm(confirmMsg)) return

    try {
      await blogService.remove(id)
      setBlogs(prev => prev.filter(b => b.id !== id))
      flash('notification', `Removed "${blog.title}"`)
    } catch (error) {
      flash('error', error.response?.data?.error || 'Error removing blog')
    }
  }

  const updateLikes = async blog => {
    try {
      const currentBlog = blogs.find(b => b.id === blog.id)
      if (!currentBlog) return

      const updatedBlog = {
        title: currentBlog.title,
        author: currentBlog.author,
        url: currentBlog.url,
        likes: currentBlog.likes + 1,
        user: currentBlog.user?.id || currentBlog.user || null
      }
      const returnedBlog = await blogService.update(currentBlog.id, updatedBlog)
      setBlogs(blogs.map(b => (b.id === blog.id ? returnedBlog : b)))
    } catch (error) {
      flash('error', error.response?.data?.error || 'Error updating likes')
    }
  }

  const { values, handleChange, handleSubmit, reset } = useBlogForm({
    onSubmit: data => {
      createBlog(data)
      reset()
    }
  })

  const loginForm = () => (
    <>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUserName(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={login}
      />
    </>
  )

  const blogList = () => (
    <>
      <h2>blogs</h2>
      {user.name} logged in{' '}
      <button
        onClick={() => {
          window.localStorage.removeItem('loggedBlogappUser')
          setUser(null)
        }}
      >
        logout
      </button>
      <Togglable buttonLabel="create new blog">
        <BlogForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            handleChangeLikes={() => updateLikes(blog)}
            handleRemoveBlog={() => removeBlog(blog)}
            canRemove={blog.user.id === user.id}
          />
        ))}
    </>
  )

  return (
    <>
      <Notification message={message} />
      {!user && loginForm()}
      {user && blogList()}
    </>
  )
}

export default App
