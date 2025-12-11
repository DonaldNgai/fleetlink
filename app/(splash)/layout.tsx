'use client';

import Link from 'next/link';
import { use, useState, Suspense } from 'react';
import { Button } from '@chakra-ui/react';
import { CircleIcon, Home, LogOut, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { Menu } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import { adminRedirectPath, loginRedirectPath } from '@/config/app-config';
import useSWR, { mutate } from 'swr';
import { logoutRedirectPath } from '@/config/app-config';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push(logoutRedirectPath);
  }

  if (!user) {
    return (
      <>
        <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
          Pricing
        </Link>
        <Button asChild className="rounded-full">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </>
    );
  }

  return (
    <Menu.Root open={isMenuOpen} onOpenChange={(e) => setIsMenuOpen(e.open)}>
      <Menu.Trigger asChild>
        <button className="cursor-pointer">
          <Avatar.Root className="size-9">
            <Avatar.Fallback>
              {user.email
                .split(' ')
                .map(n => n[0])
                .join('')}
            </Avatar.Fallback>
          </Avatar.Root>
        </button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content className="flex flex-col gap-1">
          <Menu.Item value="dashboard" className="cursor-pointer">
            <Link href={loginRedirectPath} className="flex w-full items-center">
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Menu.Item>
          <Menu.Item value="account" className="cursor-pointer">
            <Link href={adminRedirectPath} className="flex w-full items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Account</span>
            </Link>
          </Menu.Item>
          <Menu.Separator />
          <form action={handleSignOut} className="w-full">
            <button type="submit" className="flex w-full">
              <Menu.Item value="signout" className="w-full flex-1 cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </Menu.Item>
            </button>
          </form>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}

function Header() {
  return (
    <header className="border-b border-gray-200 bg-background relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="FleetLink" width={150} height={600} />
        </Link>
        <div className="flex items-center space-x-4">
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen relative">
      <Header />
      {children}
    </section>
  );
}
