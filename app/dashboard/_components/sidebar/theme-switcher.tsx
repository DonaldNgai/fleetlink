'use client';

import { Moon, Sun } from 'lucide-react';

import { Button } from '@chakra-ui/react';
// TODO: updateThemeMode needs to be implemented or removed
// import { updateThemeMode } from '@DonaldNgai/chakra-ui';
import { setValueToCookie } from '@DonaldNgai/next-utils/client/preferences';
import { usePreferencesStore } from '@DonaldNgai/chakra-ui/stores/preferences-store';

export function ThemeSwitcher() {
  const themeMode = usePreferencesStore(s => s.themeMode);
  const setThemeMode = usePreferencesStore(s => s.setThemeMode);

  const handleValueChange = async () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    // updateThemeMode(newTheme);
    setThemeMode(newTheme);
    await setValueToCookie('theme_mode', newTheme);
  };

  return (
    <Button onClick={handleValueChange}>
      {themeMode === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
