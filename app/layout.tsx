import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import { APP_CONFIG } from '@/config/app-config';
import { ChakraUIProvider } from '@ui';

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh]">
        <ChakraUIProvider>
          <SWRConfig
            value={{
              fallback: {
                // We do NOT await here
                // Only components that read this data will suspend
                // Wrap in Promise.resolve to handle errors gracefully
                '/api/user': getUser().catch(() => null),
                '/api/team': getTeamForUser().catch(() => null),
              },
            }}
          >
            {children}
          </SWRConfig>
        </ChakraUIProvider>
      </body>
    </html>
  );
}
