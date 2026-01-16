import { RedisPubSub } from 'graphql-redis-subscriptions'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

import Person from './models/person'
import User from './models/user'

const pubsub = new RedisPubSub({
  connection: { host: '127.0.0.1', port: 6379 }
})

const resolvers = {
  Query: {
    personsCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) {
        return await Person.find({}).populate('friendOf')
      }

      if (args.phone === 'YES') {
        const hasPhoneQuery = {
          phone: { $exists: true, $nin: [null, ''] }
        }
        return await Person.find(hasPhoneQuery).populate('friendOf')
      }

      const noPhoneQuery = {
        $or: [{ phone: { $exists: false } }, { phone: null }, { phone: '' }]
      }
      return await Person.find(noPhoneQuery).populate('friendOf')
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Person: {
    id: root => (root.id ? root.id : root._id ? root._id.toString() : null),
    address: root => {
      return {
        street: root.street,
        city: root.city
      }
    },
    friendOf: async root => {
      const friends = await User.find({
        friends: {
          $in: [root._id]
        }
      })
      return friends
    }
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const existing = await Person.findOne({ name: args.name })
      if (existing) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      const person = new Person({ ...args })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError('Saving person failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      console.log('Publishing PERSON_ADDED for:', person.name)
      pubsub.publish('PERSON_ADDED', { personAdded: person })

      return person
    },

    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      if (!person) {
        return null
      }

      person.phone = args.phone
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Saving number failed', {
          extensions: {
            code: 'BAD_USER_UNPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return person
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      try {
        return await user.save()
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
            code: 'BAD_USER_LOGIN'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    addAsFriend: async (root, args, { currentUser }) => {
      const isFriend = person =>
        currentUser.friends
          .map(friend => friend._id.toString())
          .includes(person._id.toString())

      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_UNPUT' }
        })
      }

      const person = await Person.findOne({ name: args.name })
      if (!isFriend(person)) {
        currentUser.friends = currentUser.friends.concat(person)
      }

      await currentUser.save()

      return currentUser
    }
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
    }
  }
}

export default resolvers
