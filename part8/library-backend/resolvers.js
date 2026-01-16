import { RedisPubSub } from 'graphql-redis-subscriptions'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

import Author from './models/author'
import Book from './models/book'
import User from './models/user'
import requireAuth from './utils/requireAuth'

const pubsub = new RedisPubSub({
  connection: { host: '127.0.0.1', port: 6379 }
})

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => {
      const authors = await Author.find({})
      const bookCounts = await Book.aggregate([
        { $group: { _id: "$author", count: { $sum: 1 } } }
      ])
      const countMap = Object.fromEntries(bookCounts.map(bc => [bc._id.toString(), bc.count]))
      return authors.map(author => ({
        ...author.toObject(),
        bookCount: countMap[author._id.toString()] || 0
      }))
    },
    allBooks: async (root, args) => {
      const filter = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filter.author = author._id
        } else {
          return []
        }
      }
      if (args.genre) {
        filter.genres = args.genre
      }

      return await Book.find(filter).populate('author')
    },
    me: (root, args, context) => context.currentUser
  },
  Author: {
    id: parent => parent._id.toString()
  },
  Book: {
    id: parent => parent._id.toString()
  },
  User: {
    id: parent => parent._id.toString()
  },
  Mutation: {
    addBook: async (root, args, context) => {
      requireAuth(context)
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Author creation failed: ' + error.message, {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.author }
          })
        }
      }

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
        const populatedBook = await Book.findById(book._id).populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
        return populatedBook
      } catch (error) {
        throw new GraphQLError('Book creation failed: ' + error.message, {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args }
        })
      }
    },
    editAuthor: async (root, args, context) => {
      requireAuth(context)
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name }
        })
      }
      author.born = args.setBornTo
      try {
        await author.save()
        return author
      } catch (error) {
        throw new GraphQLError('Failed to update author: ' + error.message, {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args }
        })
      }
    },
    addAuthor: async (root, args, context) => {
      requireAuth(context)
      const author = new Author({ name: args.name, born: args.born })
      try {
        await author.save()
        return author
      } catch (error) {
        throw new GraphQLError('Author creation failed: ' + error.message, {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args }
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })
      try {
        await user.save()
        return user
      } catch (error) {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

export default resolvers
