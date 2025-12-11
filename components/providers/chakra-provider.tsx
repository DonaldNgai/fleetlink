'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { system } from '@/lib/chakra-theme';

export function ChakraUIProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine initial color mode from the document
  const getInitialColorMode = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  };

  return (
    <ChakraProvider
      value={system}
      disableGlobalStyle={true}
      defaultColorMode={getInitialColorMode()}
    >
      {mounted ? children : null}
    </ChakraProvider>
  );
}

