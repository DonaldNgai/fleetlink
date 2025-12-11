'use client';

import { useState } from 'react';

import { User as UserIcon, Home, LogOut, EllipsisVertical } from 'lucide-react';
import { User } from '@/lib/db/schema';

import { Avatar, AvatarImage } from '@chakra-ui/react';
import { AvatarFallback } from '@ui';
import { Menu } from '@chakra-ui/react';
import { cn, getInitials } from '@utils';
import Link from 'next/link';
import { adminRedirectPath } from '@/config/app-config';
import { SidebarMenuButton } from '@chakra-ui/react';
import { signOut } from '@/app/(login)/actions';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { loginRedirectPath, logoutRedirectPath } from '@/config/app-config';

export function AccountSwitcher({
  users,
  fullSize = false,
}: {
  readonly users: ReadonlyArray<User>;
  readonly fullSize?: boolean;
}) {
  const [activeUser, setActiveUser] = useState(users[0]);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push(logoutRedirectPath);
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        {fullSize ? (
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar.Root className="h-8 w-8 rounded-lg grayscale">
              <Avatar.Fallback className="rounded-lg">
                {getInitials(activeUser?.name || activeUser?.email)}
              </Avatar.Fallback>
            </Avatar.Root>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeUser?.name || activeUser?.email}</span>
              <span className="text-muted-foreground truncate text-xs">{activeUser?.email}</span>
            </div>
            <EllipsisVertical className="ml-auto size-4" />
          </SidebarMenuButton>
        ) : (
          <Avatar.Root className="size-9 rounded-lg">
            <Avatar.Fallback className="rounded-lg">
              {getInitials(activeUser?.name || activeUser?.email)}
            </Avatar.Fallback>
          </Avatar.Root>
        )}
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content
          className="min-w-56 space-y-1 rounded-lg"
          side="bottom"
          align="end"
        >
          {users.map(user => (
            <Menu.Item
              key={user.email}
              value={user.email}
              className={cn(
                'p-0',
                user.id === activeUser?.id && 'bg-accent/50 border-l-primary border-l-2'
              )}
              onClick={() => setActiveUser(user)}
            >
              <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
                <Avatar.Root className="size-9 rounded-lg">
                  <Avatar.Fallback className="rounded-lg">
                    {getInitials(user.name || user.email)}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name || user.email}</span>
                  <span className="truncate text-xs capitalize">{user.role}</span>
                </div>
              </div>
            </Menu.Item>
          ))}
          <Menu.Separator />
          <Menu.Item value="dashboard" className="w-full flex-1 cursor-pointer">
            <Link href={loginRedirectPath} className="flex w-full items-center">
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Menu.Item>
          <Menu.Item value="account" className="w-full flex-1 cursor-pointer">
            <Link href={adminRedirectPath} className="flex w-full items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Account</span>
            </Link>
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item value="signout" className="p-0">
            <form action={handleSignOut} className="w-full">
              <button type="submit" className="flex w-full">
                <div className="w-full flex-1 cursor-pointer flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </div>
              </button>
            </form>
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
