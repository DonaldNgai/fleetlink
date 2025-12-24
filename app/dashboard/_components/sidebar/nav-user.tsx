'use client';

import { SidebarMenu, SidebarMenuItem } from '@DonaldNgai/chakra-ui';
import { User } from '@DonaldNgai/next-utils/auth/users';
import { AccountSwitcher } from '@DonaldNgai/chakra-ui';

export function NavUser({ users }: { readonly users: ReadonlyArray<User> }) {
  // Convert Auth0 User to format expected by AccountSwitcher
  const convertedUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.app_metadata?.role as string | undefined || null,
  }));

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AccountSwitcher users={convertedUsers} fullSize={true} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
