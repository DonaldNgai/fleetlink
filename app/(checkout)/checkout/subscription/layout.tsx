import { ReactNode } from 'react';
import { RequireAuthLayout } from '@DonaldNgai/chakra-ui/server';

export const dynamic = 'force-dynamic';

/**
 * Layout that requires authentication for all checkout pages
 * Automatically redirects to login if user is not authenticated
 * Preserves the current URL for return after login
 */
export default async function Layout({ children }: { children: ReactNode }) {
  return <RequireAuthLayout fallbackUrl="/checkout/subscription">{children}</RequireAuthLayout>;
}
