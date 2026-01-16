import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useBlogForm } from './components/useBlogForm'
import { setBlogs, addBlog, updateBlog, removeBlog } from './reducers/blogSlice'
import {
  setNotification,
  clearNotification
} from './reducers/notificationSlice'
import { setUser, clearUser } from './reducers/userSlice'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const message = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const timeoutRef = useRef(null)

  const flash = (type, text) => {
    dispatch(setNotification({ type, text }))
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      dispatch(clearNotification())
      timeoutRef.current = null
    }, 3000)
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const initialBlogs = await blogService.getAll()
      dispatch(setBlogs(initialBlogs))
    }
    fetchBlogs()
  }, [dispatch])

  const createBlogHandler = async blog => {
    try {
      const created = await blogService.create(blog)
      dispatch(addBlog(created))
      flash('notification', `Created "${blog.title}"`)
    } catch (error) {
      flash('error', error.response?.blog?.error || 'Error creating blog')
    }
  }

  const removeBlogHandler = async blog => {
    const id = blog.id
    const confirmMsg = `Remove blog "${blog.title}" by ${blog.author}?`
    if (!window.confirm(confirmMsg)) return

    try {
      await blogService.remove(id)
      dispatch(removeBlog(id))
      flash('notification', `Removed "${blog.title}"`)
    } catch (error) {
      flash('error', error.response?.data?.error || 'Error removing blog')
    }
  }

  const updateLikesHandler = async blog => {
    try {
      const currentBlog = blogs.find(b => b.id === blog.id)
      if (!currentBlog) return

      const updatedBlog = {
        ...currentBlog,
        likes: currentBlog.likes + 1,
        user: currentBlog.user?.id || currentBlog.user || null
      }
      const returnedBlog = await blogService.update(currentBlog.id, updatedBlog)
      dispatch(updateBlog(returnedBlog))
    } catch (error) {
      flash('error', error.response?.data?.error || 'Error updating likes')
    }
  }

  useEffect(() => {
    const fetchLoggedUser = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        dispatch(setUser(user))
        blogService.setToken(user.token)
      }
    }
    fetchLoggedUser()
  }, [dispatch])

  const login = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUserName('')
      setPassword('')
    } catch (error) {
      flash('error', error.response?.data?.error || 'Wrong credentials')
    }
  }

  const { values, handleChange, handleSubmit, reset } = useBlogForm({
    onSubmit: data => {
      createBlogHandler(data)
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
          dispatch(clearUser())
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
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            handleChangeLikes={() => updateLikesHandler(blog)}
            handleRemoveBlog={() => removeBlogHandler(blog)}
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
