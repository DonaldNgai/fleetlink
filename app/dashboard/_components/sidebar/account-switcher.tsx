'use client';

import { useState } from 'react';

import { User as UserIcon, Home, LogOut, EllipsisVertical } from 'lucide-react';
import { User } from '@/lib/db/schema';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { cn, getInitials } from '@/lib/utils';
import Link from 'next/link';
import { adminRedirectPath } from '@/config/app-config';
import { SidebarMenuButton } from '@/components/ui/sidebar';
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {fullSize ? (
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage src={undefined} alt={activeUser?.name || ''} />
              <AvatarFallback className="rounded-lg">
                {getInitials(activeUser?.name || activeUser?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeUser?.name || activeUser?.email}</span>
              <span className="text-muted-foreground truncate text-xs">{activeUser?.email}</span>
            </div>
            <EllipsisVertical className="ml-auto size-4" />
          </SidebarMenuButton>
        ) : (
          <Avatar className="size-9 rounded-lg">
            <AvatarImage src={undefined} alt={activeUser?.name || ''} />
            <AvatarFallback className="rounded-lg">
              {getInitials(activeUser?.name || activeUser?.email)}
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 space-y-1 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        {users.map(user => (
          <DropdownMenuItem
            key={user.email}
            className={cn(
              'p-0',
              user.id === activeUser?.id && 'bg-accent/50 border-l-primary border-l-2'
            )}
            onClick={() => setActiveUser(user)}
          >
            <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
              <Avatar className="size-9 rounded-lg">
                <AvatarImage src={undefined} alt={user.name || ''} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.name || user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name || user.email}</span>
                <span className="truncate text-xs capitalize">{user.role}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="w-full flex-1 cursor-pointer">
            <Link href={loginRedirectPath} className="flex w-full items-center">
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full flex-1 cursor-pointer">
            <Link href={adminRedirectPath} className="flex w-full items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Account</span>
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <Link href={`${adminRedirectPath}/billing`} className="flex w-full items-center">
              <CreditCard />
              Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`${adminRedirectPath}/notifications`} className="flex w-full items-center">
              <Bell />
              Notifications
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <form action={handleSignOut} className="w-full">
            <button type="submit" className="flex w-full">
              <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
