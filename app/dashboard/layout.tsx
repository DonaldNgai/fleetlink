import { ReactNode } from 'react';
import { cookies } from 'next/headers';

import { AppSidebar } from './_components/sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { getPreference } from '@/lib/server/server-actions';
import { Toaster } from '@/components/ui/sonner';
import { PreferencesStoreProvider } from '@/lib/stores/preferences/preferences-provider';
import {
  THEME_MODE_VALUES,
  THEME_PRESET_VALUES,
  type ThemeMode,
  type ThemePreset,
} from '@/types/preferences/theme';
import {
  SIDEBAR_VARIANT_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  type SidebarVariant,
  type SidebarCollapsible,
  type ContentLayout,
  type NavbarStyle,
} from '@/types/preferences/layout';

import { AccountSwitcher } from './_components/sidebar/account-switcher';
import { LayoutControls } from './_components/sidebar/layout-controls';
import { SearchDialog } from './_components/sidebar/search-dialog';
import { ThemeSwitcher } from './_components/sidebar/theme-switcher';
import { getUser } from '@/lib/db/queries';

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  // Get user data server-side instead of using SWR
  const user = await getUser();

  const themeMode = await getPreference<ThemeMode>('theme_mode', THEME_MODE_VALUES, 'dark');
  const themePreset = await getPreference<ThemePreset>(
    'theme_preset',
    THEME_PRESET_VALUES,
    'tangerine'
  );

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  const [sidebarVariant, sidebarCollapsible, contentLayout, navbarStyle] = await Promise.all([
    getPreference<SidebarVariant>('sidebar_variant', SIDEBAR_VARIANT_VALUES, 'inset'),
    getPreference<SidebarCollapsible>('sidebar_collapsible', SIDEBAR_COLLAPSIBLE_VALUES, 'icon'),
    getPreference<ContentLayout>('content_layout', CONTENT_LAYOUT_VALUES, 'full-width'),
    getPreference<NavbarStyle>('navbar_style', NAVBAR_STYLE_VALUES, 'scroll'),
  ]);

  const layoutPreferences = {
    contentLayout,
    variant: sidebarVariant,
    collapsible: sidebarCollapsible,
    navbarStyle,
  };

  return (
    <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <Toaster />
        <AppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
        <SidebarInset
          data-content-layout={contentLayout}
          className={cn(
            'data-[content-layout=centered]:!mx-auto data-[content-layout=centered]:max-w-screen-2xl',
            // Adds right margin for inset sidebar in centered layout up to 113rem.
            // On wider screens with collapsed sidebar, removes margin and sets margin auto for alignment.
            'max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto'
          )}
        >
          <header
            data-navbar-style={navbarStyle}
            className={cn(
              'flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
              // Handle sticky navbar style with conditional classes so blur, background, z-index, and rounded corners remain consistent across all SidebarVariant layouts.
              'data-[navbar-style=sticky]:bg-background/50 data-[navbar-style=sticky]:sticky data-[navbar-style=sticky]:top-0 data-[navbar-style=sticky]:z-50 data-[navbar-style=sticky]:overflow-hidden data-[navbar-style=sticky]:rounded-t-[inherit] data-[navbar-style=sticky]:backdrop-blur-md'
            )}
          >
            <div className="flex w-full items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-1 lg:gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
                {/* <SearchDialog /> */}
              </div>
              <div className="flex items-center gap-2">
                {/* <LayoutControls {...layoutPreferences} /> */}
                {/* <ThemeSwitcher /> */}
                <AccountSwitcher users={user ? [user] : []} />
              </div>
            </div>
          </header>
          <div className="h-full p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </PreferencesStoreProvider>
  );
}
