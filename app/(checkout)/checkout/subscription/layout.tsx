import { RequireAuthLayout } from '@ui';

/**
 * Layout that requires authentication for all checkout pages
 * Automatically redirects to login if user is not authenticated
 * Preserves the current URL for return after login
 */
export default RequireAuthLayout;
