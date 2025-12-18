'use client';

import Link from 'next/link';

import { Settings, CircleHelp, Search, Database, ClipboardList, File, Command } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@ui';
import { APP_CONFIG } from '@/config/app-config';
import { User } from '@repo/next-utils/db/schema';
import useSWR from 'swr';
import { sidebarItems } from '@ui';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getUserByEmail } from '@/app/actions/user';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const data = {
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: Settings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: CircleHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: Search,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: Database,
    },
    {
      name: 'Reports',
      url: '#',
      icon: ClipboardList,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: File,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user: auth0User } = useUser();
  const { data: user } = useSWR<User | null>(
    auth0User?.email ? `user-${auth0User.email}` : null,
    async () => {
      if (!auth0User?.email) return null;
      return getUserByEmail(auth0User.email);
    }
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard">
                <img
                  src="/logo.png"
                  alt={APP_CONFIG.name}
                  className="h-5 w-auto group-data-[collapsible=icon]:hidden"
                />
                <img
                  src="/logo-icon.png"
                  alt={APP_CONFIG.name}
                  className="h-6 w-auto hidden group-data-[collapsible=icon]:block"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser users={user ? [user] : []} />
      </SidebarFooter>
    </Sidebar>
  );
}
