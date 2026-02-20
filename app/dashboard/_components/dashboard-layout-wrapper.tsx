'use client';

import { DashboardLayout } from '@DonaldNgai/chakra-ui';
import { LayoutDashboard, ChartBar, Mail, MessageSquare } from 'lucide-react';
import type { User } from '@DonaldNgai/next-utils/auth/users';
import type { ThemeMode, ThemePreset } from '@DonaldNgai/next-utils';
import { APP_CONFIG, logoutRedirectPath } from '@/config/app-config';

const navigation = [
  {
    label: 'Dashboards',
    items: [
      { title: 'Requests', url: '/dashboard', icon: LayoutDashboard },
      { title: 'Fleet', url: '/dashboard/crm', icon: ChartBar },
    ],
  },
  {
    label: 'Actions',
    items: [
      { title: 'Request Equipment', url: '/rent', icon: Mail },
      { title: 'Submit Equipment To Rent', url: '/dashboard/submit-equipment', icon: MessageSquare },
    ],
  },
];

interface Props {
  children: React.ReactNode;
  user: User | null;
  themeMode: ThemeMode;
  themePreset: ThemePreset;
  defaultSidebarOpen: boolean;
}

export function DashboardLayoutWrapper({ children, user, themeMode, themePreset, defaultSidebarOpen }: Props) {
  return (
    <DashboardLayout
      appName={APP_CONFIG.name}
      logoUrl="/logo.png"
      logoIconUrl="/logo-icon.png"
      navigation={navigation}
      user={user}
      defaultSidebarOpen={defaultSidebarOpen}
      themeMode={themeMode}
      themePreset={themePreset}
      logoutRedirectPath={logoutRedirectPath}
    >
      {children}
    </DashboardLayout>
  );
}
