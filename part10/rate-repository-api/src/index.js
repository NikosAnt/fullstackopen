import http from 'http';

import logger from './utils/logger.js';
import { getLanIPv4 } from './utils/network.js';
import { API_HOST, API_PORT, APOLLO_HOST, APOLLO_PORT } from './config.js';
import createApolloServer from './apolloServer.js';
import app from './app.js';

const startServer = async () => {
  const httpServer = http.createServer(app);

  const apolloServer = createApolloServer();

  await apolloServer.listen({ host: APOLLO_HOST, port: APOLLO_PORT });

  httpServer.on('request', app.callback());

  await new Promise((resolve) =>
    httpServer.listen({ host: API_HOST, port: API_PORT }, resolve),
  );

  const lanIp = getLanIPv4();
  const prettyHost = (host) => (host === '0.0.0.0' ? 'localhost' : host);

  logger.info(`REST API ready at http://${prettyHost(API_HOST)}:${API_PORT}`);
  if (API_HOST === '0.0.0.0' && lanIp) {
    logger.info(`REST API available on LAN at http://${lanIp}:${API_PORT}`);
  }

  logger.info(
    `Apollo Server ready at http://${prettyHost(APOLLO_HOST)}:${APOLLO_PORT}`,
  );
  if (APOLLO_HOST === '0.0.0.0' && lanIp) {
    logger.info(`Apollo Server available on LAN at http://${lanIp}:${APOLLO_PORT}`);
  }
};

startServer();
