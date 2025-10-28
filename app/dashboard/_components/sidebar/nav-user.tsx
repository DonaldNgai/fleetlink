'use client';

import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { User } from '@/lib/db/schema';
import { AccountSwitcher } from './account-switcher';

export function NavUser({ users }: { readonly users: ReadonlyArray<User> }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AccountSwitcher users={users} fullSize={true} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
