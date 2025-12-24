import { Auth0Client } from '@auth0/nextjs-auth0/server';

/**
 * Auth0 client instance
 * Following Auth0's recommended approach: https://auth0.com/docs/quickstart/webapp/nextjs
 * The Auth0Client constructor automatically reads configuration from environment variables:
 * - AUTH0_DOMAIN
 * - AUTH0_CLIENT_ID
 * - AUTH0_CLIENT_SECRET
 * - AUTH0_SECRET
 * - APP_BASE_URL
 * - AUTH0_SCOPE (via authorizationParameters)
 * - AUTH0_API_AUDIENCE (via authorizationParameters)
 */
export const auth0 = new Auth0Client();

