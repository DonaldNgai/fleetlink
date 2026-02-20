import { ReactNode } from 'react';
import { cookies } from 'next/headers';

import { getPreference } from '@DonaldNgai/next-utils/server/preferences';
import { THEME_MODE_VALUES, THEME_PRESET_VALUES, type ThemeMode, type ThemePreset } from '@DonaldNgai/next-utils';
import { getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import { auth0 } from '@/lib/auth/auth0';
import { DashboardLayoutWrapper } from './_components/dashboard-layout-wrapper';

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUserFullDetails(auth0);

  const themeMode = await getPreference<ThemeMode>('theme_mode', THEME_MODE_VALUES, 'dark');
  const themePreset = await getPreference<ThemePreset>(
    'theme_preset',
    THEME_PRESET_VALUES,
    'tangerine'
  );

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <DashboardLayoutWrapper
      user={user}
      themeMode={themeMode}
      themePreset={themePreset}
      defaultSidebarOpen={defaultOpen}
    >
      {children}
    </DashboardLayoutWrapper>
  );
}
