import { ReactNode } from 'react';
import { RequireAuthLayout } from '@DonaldNgai/chakra-ui/server';
import { auth0 } from '@/lib/auth/auth0';

export const dynamic = 'force-dynamic';

/**
 * Layout that requires authentication for all checkout pages
 * Automatically redirects to login if user is not authenticated
 * Preserves the current URL for return after login
 */
export default async function Layout({ children }: { children: ReactNode }) {
  return <RequireAuthLayout fallbackUrl="/checkout/subscription" auth0={auth0}>{children}</RequireAuthLayout>;
}
