import { Container, Typography } from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'

import Blog from './components/blog/Blog'
import BlogView from './components/blog/BlogView'
import BlogForm from './components/blogform/BlogForm'
import { useBlogForm } from './components/blogform/useBlogForm'
import LoginForm from './components/LoginForm'
import Navigation from './components/Navigation'
import Notification from './components/notification/Notification'
import { useNotification } from './components/notification/useNotification'
import Togglable from './components/Togglable'
import UsersView from './components/user/UsersView'
import UserView from './components/user/UserView'
import { useUser } from './components/user/useUser'
import {
  setToken,
  getAll,
  create,
  update,
  createComment
} from './services/blogs'
import { login } from './services/login'

const App = () => {
  const { notification, dispatch } = useNotification()
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const timeoutRef = useRef(null)

  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll
  })

  const queryClient = useQueryClient()
  const { user, dispatch: userDispatch } = useUser()

  const createBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: newBlog => {
      queryClient.setQueryData(['blogs'], old =>
        old ? [...old, newBlog] : [newBlog]
      )
      flash('notification', `Created "${newBlog.title}"`)
    },
    onError: error => {
      flash('error', error.response?.data?.error || 'Error creating blog')
    }
  })

  const updateBlogMutation = useMutation({
    onMutate: async blog => {
      await queryClient.cancelQueries(['blogs'])
      const previousBlogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], old =>
        old.map(b => (b.id === blog.id ? { ...b, likes: b.likes + 1 } : b))
      )
      return { previousBlogs }
    },
    mutationFn: blog => {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user?.id || blog.user || null
      }
      return update(blog.id, updatedBlog)
    },
    onSuccess: serverUpdatedBlog => {
      if (!serverUpdatedBlog) return
      queryClient.setQueryData(['blogs'], old =>
        old.map(b =>
          b.id === serverUpdatedBlog.id
            ? {
                ...b,
                ...serverUpdatedBlog,
                likes: Math.max(b.likes, serverUpdatedBlog.likes)
              }
            : b
        )
      )
    },
    onError: (error, _blog, context) => {
      if (context?.previousBlogs) {
        queryClient.setQueryData(['blogs'], context.previousBlogs)
      }
      flash('error', error.response?.data?.error || 'Error updating likes')
    }
  })

  const addCommentMutation = useMutation({
    mutationFn: ({ blogId, comment }) => createComment(blogId, comment),
    onSuccess: updatedBlog => {
      queryClient.setQueryData(['blogs'], old =>
        old.map(b => (b.id === updatedBlog.id ? updatedBlog : b))
      )
    },
    onError: error => {
      flash('error', error.response?.data?.error || 'Error adding comment')
    }
  })

  useEffect(() => {
    const fetchLoggedUser = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        userDispatch({ type: 'LOGIN', payload: user })
        setToken(user.token)
      }
    }
    fetchLoggedUser()
  }, [userDispatch])

  const flash = (type, text) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { type, text } })
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 3000)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setToken(user.token)
      userDispatch({ type: 'LOGIN', payload: user })
      setUserName('')
      setPassword('')
    } catch (error) {
      flash('error', error.response?.data?.error || 'Wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'LOGOUT' })
  }
  const createBlogHandler = blog => createBlogMutation.mutate(blog)

  const updateLikesHandler = blog => updateBlogMutation.mutate(blog)

  const { values, handleChange, handleSubmit, reset } = useBlogForm({
    onSubmit: blog => {
      createBlogHandler(blog)
      reset()
    }
  })

  const addCommentHandler = (blogId, comment) => {
    addCommentMutation.mutate({ blogId, comment })
  }

  const loginForm = () => (
    <>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUserName(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </>
  )

  const blogList = () => (
    <>
      <Togglable buttonLabel="create new">
        <BlogForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </>
  )

  return (
    <Container component="main">
      <Notification message={notification} />
      {user && <Navigation user={user} onLogout={handleLogout} />}
      {!user && loginForm()}
      {user && (
        <>
          <Typography variant="h2" component="h2">
            blog app
          </Typography>
          <Routes>
            <Route
              path="/blogs/:id"
              element={
                <BlogView
                  handleChangeLikes={updateLikesHandler}
                  handleAddComment={addCommentHandler}
                />
              }
            />
            <Route path="/users/:id" element={<UserView />} />
            <Route path="/users" element={<UsersView />} />
            <Route path="/" element={blogList()} />
          </Routes>
        </>
      )}
    </Container>
  )
}

export default App
