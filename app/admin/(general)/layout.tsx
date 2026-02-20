'use client';

import { DashboardLayout } from '@DonaldNgai/chakra-ui';
import { Settings, CreditCard } from 'lucide-react';
import { APP_CONFIG, logoutRedirectPath } from '@/config/app-config';

const adminNavigation = [
  {
    label: 'Admin',
    items: [
      { title: 'Overview', url: '/admin', icon: Settings },
      { title: 'Payments', url: '/admin/payments', icon: CreditCard },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      appName={APP_CONFIG.name}
      logoUrl="/logo.png"
      logoIconUrl="/logo-icon.png"
      navigation={adminNavigation}
      user={null}
      logoutRedirectPath={logoutRedirectPath}
    >
      {children}
    </DashboardLayout>
  );
}
