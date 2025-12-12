import type { NextRequest } from 'next/server';
import { auth0 } from '@repo/api/auth/getAuth0Client';

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
