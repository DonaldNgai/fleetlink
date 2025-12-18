import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAuth0Client } from '@utils/auth/getAuth0Client';

export async function middleware(request: NextRequest) {
    const client = await getAuth0Client();
    return client.middleware(request);
  }

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs', // Use Node.js runtime for Auth0 middleware
};
