import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth/auth0';

export async function middleware(request: NextRequest) {
    const response = await auth0.middleware(request);
    
    // Add custom headers with the current URL for server components to use
    if (response instanceof NextResponse) {
      const url = request.nextUrl.clone();
      const currentUrl = `${url.pathname}${url.search}`;
      response.headers.set('x-url', currentUrl);
      response.headers.set('x-pathname', url.pathname);
      response.headers.set('x-search-params', url.search);
    }
    
    return response;
  }

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs', // Use Node.js runtime for Auth0 middleware
};
