import http from 'node:http'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'
import dotenvx from '@dotenvx/dotenvx'
import { makeExecutableSchema } from '@graphql-tools/schema'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import { useServer } from 'graphql-ws/use/ws'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { WebSocketServer } from 'ws'

import logger from './utils/logger'
import User from './models/user'
import resolvers from './resolvers'
import typeDefs from './schema'

dotenvx.config()
mongoose.set('strictQuery', false)
const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to MongoDB')

try {
  mongoose.connect(MONGODB_URI)
  console.log('connected to MongoDB')
} catch (error) {
  console.error('error connection to MongoDB: ', error.message)
}

mongoose.set('debug', true)

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer(
    {
      schema,
      onConnect: ctx => {
        try {
          console.log(
            'WS connected. Origin:',
            ctx.extra?.request?.headers?.origin
          )
        } catch {
          // not needed yet
        }
      },
      onSubscribe: (_ctx, msg) => {
        console.log('WS subscribe payload:', msg?.payload?.query)
      },
      onError: (_ctx, _msg, errors) => {
        console.error('WS error:', errors)
      },
      onClose: (_ctx, code, reason) => {
        console.log('WS closed:', code, reason?.toString?.())
      }
    },
    wsServer
  )

  const server = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== 'production',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        },
        async requestDidStart(requestContext) {
          logger.info(
            `GraphQL Request: ${requestContext.request.operationName || 'Unnamed'} - Query: ${requestContext.request.query}`
          )
          logger.info(
            `Variables: ${JSON.stringify(requestContext.request.variables)}`
          )
          return {
            didEncounterErrors(ctx) {
              ctx.errors.forEach(error => {
                logger.error(`GraphQL Error: ${error.message}`)
              })
            }
          }
        }
      }
    ]
  })

  await server.start()

  app.use(compression())
  app.use(morgan('dev'))
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet())
  }
  app.use(
    cors({
      origin: process.env.ORIGIN + ':' + process.env.CORS_PORT,
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )

  app.use(express.json())

  app.use(
    '/',
    expressMiddleware(server, {
      context: async ({ req, res: _res }) => {
        const auth = req.headers?.authorization || null
        if (auth && auth.startsWith('Bearer ')) {
          try {
            const decodedToken = jwt.verify(
              auth.substring(7),
              process.env.JWT_SECRET
            )
            const currentUser = await User.findById(decodedToken.id).populate(
              'friends'
            )
            return { currentUser }
          } catch (error) {
            console.error('JWT verification or user lookup failed:', error)
            return { currentUser: null }
          }
        }
        return { currentUser: null }
      }
    })
  )

  httpServer.listen(process.env.PORT, () =>
    console.log(
      `Server is now running on ${process.env.ORIGIN}:${process.env.PORT}/`
    )
  )
}

start()
