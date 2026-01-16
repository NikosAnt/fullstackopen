// Import Node.js HTTP module for creating the server
import http from 'node:http'

// Apollo Server for GraphQL API
import { ApolloServer } from '@apollo/server'
// Plugin to gracefully shut down HTTP server with Apollo
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
// Apollo integration for Express middleware
import { expressMiddleware } from '@as-integrations/express5'
// Load environment variables
import dotenvx from '@dotenvx/dotenvx'
// Create executable GraphQL schema from typeDefs and resolvers
import { makeExecutableSchema } from '@graphql-tools/schema'
// Node.js compression middleware
import compression from 'compression'
// CORS middleware for cross-origin requests
import cors from 'cors'
// Express web framework
import express from 'express'
// GraphQL WebSocket server for subscriptions
// eslint-disable-next-line import/no-unresolved
import { useServer } from 'graphql-ws/use/ws'
// Helmet for securing HTTP headers
import helmet from 'helmet'
// JWT for authentication
import jwt from 'jsonwebtoken'
// Mongoose for MongoDB ODM
import mongoose from 'mongoose'
// Morgan for HTTP request logging
import morgan from 'morgan'
// WebSocket server for subscriptions
import { WebSocketServer } from 'ws'

// Mongoose User model
import User from './models/user'
// GraphQL resolvers
import resolvers from './resolvers'
// GraphQL type definitions
import typeDefs from './schema'
// Winston logger for structured logging
import logger from './utils/logger'

// Initialize environment variables
dotenvx.config()
// Allow flexible queries in Mongoose
mongoose.set('strictQuery', false)
// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI
// Log MongoDB connection attempt
console.log('connecting to', MONGODB_URI)

// Connect to MongoDB
try {
  await mongoose.connect(MONGODB_URI)
  console.log('connected to MongoDB')
} catch (error) {
  console.log('error connection to MongoDB: ', error.message)
}

// Enable Mongoose debug logging for queries
mongoose.set('debug', true)

// Main server startup function
const start = async () => {
  // Create Express app
  const app = express()
  // Create HTTP server for Express
  const httpServer = http.createServer(app)

  // Create WebSocket server for GraphQL subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  // Build GraphQL schema
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  // Set up GraphQL WebSocket server for subscriptions
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
      onSubscribe: (ctx, msg) => {
        console.log('WS subscribe payload', msg?.payload?.query)
      },
      onError: (ctx, msg, errors) => {
        console.log('WS error:', errors)
      },
      onClose: (ctx, code, reason) => {
        console.log('WS closed:', code, reason?.toString?.())
      }
    },
    wsServer
  )

  // Create Apollo GraphQL server
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
          // Log GraphQL requests and variables
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

  // Start Apollo Server
  await server.start()

  // Use compression to reduce file size
  app.use(compression())
  // Use Morgan for HTTP request logging
  app.use(morgan('dev'))
  // Use Helmet for security in production
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet())
  }

  // Enable CORS for cross-origin requests
  app.use(
    cors({
      origin: process.env.ORIGIN + ':' + process.env.CORS_PORT,
      credentials: true,
      allowedHeaders: ['content-type', 'authorization']
    })
  )

  // Parse incoming JSON requests
  app.use(express.json())

  // Attach Apollo GraphQL middleware and authentication context
  app.use(
    '/',
    expressMiddleware(server, {
      context: async ({ req, res: _res }) => {
        // Extract and verify JWT for authentication
        const auth = req.headers?.authorization || null
        if (auth && auth.startsWith('Bearer ')) {
          try {
            const decodedToken = jwt.verify(
              auth.substring(7),
              process.env.JWT_SECRET
            )
            const currentUser = await User.findById(decodedToken.id)
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

  // Start HTTP server
  httpServer.listen(process.env.PORT, () =>
    console.log(
      `Server is now running on ${process.env.ORIGIN}:${process.env.PORT}/`
    )
  )
}

// Start the server
start()
