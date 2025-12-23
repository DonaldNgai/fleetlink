import { ReactNode } from 'react';
import { headers } from 'next/headers';
import { requireAuthServer } from '@repo/next-utils';

export default async function Layout({ children }: { children: ReactNode }) {
  // Get current URL from headers (set by middleware)
  const headersList = await headers();
  
  // Get URL from custom headers set by middleware, or fallback to referer
  let currentUrl = headersList.get('x-url');

  if (!currentUrl) {
    // Fallback: try to get from referer header
    const referer = headersList.get('referer');
    if (referer) {
      try {
        const url = new URL(referer);
        currentUrl = `${url.pathname}${url.search}`;
      } catch {
        // Invalid URL, use fallback
        currentUrl = '/confirm-rental';
      }
    } else {
      // Last resort: use fallback
      currentUrl = '/confirm-rental';
    }
  }
  
  // This will redirect to login if not authenticated
  // The returnTo parameter will be the current URL
  await requireAuthServer(currentUrl);

  // If we get here, user is authenticated
  return <>{children}</>;
}

