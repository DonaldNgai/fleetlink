'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Profile, OutlineButton } from '@DonaldNgai/chakra-ui';
import { adminRedirectPath, loginRedirectPath, logoutRedirectPath } from '@/config/app-config';

function Header() {
  const router = useRouter();

  return (
    <header className="border-b border-gray-200 bg-background relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="FleetLink" width={150} height={600} />
        </Link>
        <div className="flex items-center space-x-4">
          <OutlineButton
                onClick={() => router.push('/rent')}
                width="full"
                size="lg"
                fontWeight="bold"
                >Book Now</OutlineButton>
          <Link href="/pricing" className="text-base font-semibold text-gray-700 hover:text-gray-900">
            Pricing
          </Link>
          <Suspense fallback={<div className="h-9 w-9" />}>
            <Profile
              loginRedirectPath={loginRedirectPath}
              adminRedirectPath={adminRedirectPath}
              logoutRedirectPath={logoutRedirectPath}
            />
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
