import assert from 'node:assert'
import { test, after, beforeEach, describe } from 'node:test'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { hash } from 'bcrypt'
import app from '../app'
import { dummy, totalLikes, mostBlogs, mostLikes } from '../utils/list_helper'
import {
  listWithOneBlog,
  blogs,
  emptyList,
  blogsInDb,
  usersInDb,
  getTokenFromResponse
} from './test_helper'
import Blog from '../models/blog'
import User from '../models/user'

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(listWithOneBlog)
})

test('dummy returns one', () => {
  const blogs = []

  const result = dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  test('when list is empty, equals zero', () => {
    const result = totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('most blogs', () => {
    const result = mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('most likes', () => {
    const result = mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})

test('blog identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  assert.ok(response.body.length > 0, 'No blogs returned')
  const hasId = Object.keys(response.body[0]).includes('id')
  assert.ok(hasId, 'Blog identifier is not named id')
})

test('HTTP POST creates a new blog', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testPassword1'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const loginResponse = await api.post('/api/login').send({
    username: newUser.username,
    password: newUser.password
  })

  const token = getTokenFromResponse(loginResponse)

  const newBlog = {
    title: 'Async/Await in Node.js',
    url: 'https://example.com/async-await-nodejs',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(blog => blog.title)

  assert.ok(titles.includes(newBlog.title), 'New blog title is not in the list')
})

test('HTTP POST without likes defaults to 0', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testPassword1'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const loginResponse = await api.post('/api/login').send({
    username: newUser.username,
    password: newUser.password
  })

  const token = getTokenFromResponse(loginResponse)

  const newBlog = {
    title: 'Default Likes Test',
    author: 'John Doe',
    url: 'https://example.com/default-likes-test'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const createdBlog = response.body.find(blog => blog.title === newBlog.title)

  assert.ok(createdBlog, 'New blog was not created')
  assert.strictEqual(createdBlog.likes, 0, 'Likes were not set to 0')
})

test('HTTP POST without title or url returns 400', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testPassword1'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const loginResponse = await api.post('/api/login').send({
    username: newUser.username,
    password: newUser.password
  })

  const token = getTokenFromResponse(loginResponse)

  const newBlog = {
    author: 'John Doe',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('HTTP DELETE removes a blog', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testPassword1'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const loginResponse = await api.post('/api/login').send({
    username: newUser.username,
    password: newUser.password
  })
  const token = getTokenFromResponse(loginResponse)

  const newBlog = {
    title: 'Async/Await in Node.js',
    url: 'https://example.com/async-await-nodejs',
    likes: 10
  }

  const blogToDelete = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  if (!blogToDelete || !blogToDelete.body || !blogToDelete.body.id) {
    throw new Error('Blog could not be deleted')
  }

  const blogsAtStart = await blogsInDb()

  await api
    .delete(`/api/blogs/${blogToDelete.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, (await blogsAtStart.length) - 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert.ok(
    !titles.includes(blogToDelete.title),
    'Deleted blog title is still in the list'
  )
})

test('HTTP PUT updates a blog', async () => {
  const blogsAtStart = await blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: 'Updated Title',
    author: 'Updated Author',
    url: 'https://example.com/updated-url',
    likes: 15
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await blogsInDb()
  const updatedBlogInDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

  assert.ok(updatedBlogInDb, 'Updated blog was not found in the database')
  assert.strictEqual(updatedBlogInDb.title, updatedBlog.title)
  assert.strictEqual(updatedBlogInDb.author, updatedBlog.author)
  assert.strictEqual(updatedBlogInDb.url, updatedBlog.url)
  assert.strictEqual(updatedBlogInDb.likes, updatedBlog.likes)
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    const passwordHash = await hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Short Username',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(
      result.body.error.includes(
        `User validation failed: username: Path \`username\` (\`ro\`, length 2) is shorter than the minimum allowed length (3).`
      )
    )

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'shortpass',
      name: 'Short Password',
      password: 'pw'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(
      result.body.error.includes(`Password must be at least 3 characters long`)
    )

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode if a token is not provided', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'https://example.com/new-url'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        assert.strictEqual(response.body.error, 'token missing')
      })
  })
})

after(async () => {
  await mongoose.connection.close()
})
