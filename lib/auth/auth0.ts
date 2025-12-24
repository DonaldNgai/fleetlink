import { Auth0Client } from '@auth0/nextjs-auth0/server';

/**
 * Auth0 client instance
 * Following Auth0's recommended approach: https://auth0.com/docs/quickstart/webapp/nextjs
 * The Auth0Client constructor automatically reads configuration from environment variables.
 * 
 * Required environment variables:
 * - AUTH0_SECRET: A long, random string used to encrypt cookies (32+ bytes recommended)
 * - AUTH0_DOMAIN: Your Auth0 domain (e.g., 'your-tenant.auth0.com')
 * - AUTH0_CLIENT_ID: Your Auth0 application client ID
 * - AUTH0_CLIENT_SECRET: Your Auth0 application client secret
 * - APP_BASE_URL or AUTH0_BASE_URL: Your application's base URL (e.g., 'http://localhost:3000')
 * 
 * Optional:
 * - AUTH0_SCOPE: OAuth scope (defaults to 'openid profile email')
 * - AUTH0_API_AUDIENCE: API audience for access tokens
 */
export const auth0 = new Auth0Client();