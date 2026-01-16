import dotenv from 'dotenv';
import os from 'os';
import path from 'path';
import { knexSnakeCaseMappers } from 'objection';
import { fileURLToPath } from 'url';

import knexfile from '../knexfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const API_PORT = process.env.PORT || 5000;

// Prefer explicit API_HOST. Some shells set HOST to the machine hostname
// (e.g. "Cobray"), which is not a useful bind address.
export const API_HOST =
  process.env.API_HOST ||
  (process.env.HOST && process.env.HOST !== os.hostname()
    ? process.env.HOST
    : '0.0.0.0');

export const APOLLO_PORT = process.env.APOLLO_PORT || 4000;

export const APOLLO_HOST = process.env.APOLLO_HOST || API_HOST;

export const JWT_SECRET = process.env.JWT_SECRET;

export const KNEX_CONFIG = {
  ...knexfile,
  ...knexSnakeCaseMappers(),
};

export const GITHUB_API_URL =
  process.env.GITHUB_API_URL || 'https://api.github.com';

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const ACCESS_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7;
