'use client';

import { Settings } from 'lucide-react';

import { Button, RadioGroup, HStack } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
  SelectControl,
  SelectPositioner,
} from '@chakra-ui/react';
// TODO: These functions need to be implemented or removed
// import { updateContentLayout, updateNavbarStyle, updateThemeMode, updateThemePreset } from '@DonaldNgai/chakra-ui';
import { setValueToCookie } from '@DonaldNgai/next-utils/client/preferences';
import { PreferencesStoreProvider } from '@DonaldNgai/chakra-ui/stores/preferences-provider';
import { usePreferencesStore } from '@DonaldNgai/chakra-ui/stores/preferences-store';
import { SidebarVariant,
  SidebarCollapsible,
  ContentLayout,
  NavbarStyle,
  THEME_PRESET_OPTIONS, 
  type ThemePreset, 
  type ThemeMode 
} from '@DonaldNgai/next-utils/types/preferences';

type LayoutControlsProps = {
  readonly variant: SidebarVariant;
  readonly collapsible: SidebarCollapsible;
  readonly contentLayout: ContentLayout;
  readonly navbarStyle: NavbarStyle;
};

export function LayoutControls(props: LayoutControlsProps) {
  const { variant, collapsible, contentLayout, navbarStyle } = props;

  const themeMode = usePreferencesStore(s => s.themeMode);
  const setThemeMode = usePreferencesStore(s => s.setThemeMode);
  const themePreset = usePreferencesStore(s => s.themePreset);
  const setThemePreset = usePreferencesStore(s => s.setThemePreset);

  const handleValueChange = async (key: string, value: any) => {
    if (key === 'theme_mode') {
      // updateThemeMode(value);
      setThemeMode(value as ThemeMode);
    }

    if (key === 'theme_preset') {
      // updateThemePreset(value);
      setThemePreset(value as ThemePreset);
    }

    if (key === 'content_layout') {
      // updateContentLayout(value);
    }

    if (key === 'navbar_style') {
      // updateNavbarStyle(value);
    }
    await setValueToCookie(key, value);
  };

  return (
    <Popover.Root>
      <PopoverTrigger asChild>
        <Button>
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <h4 className="text-sm leading-none font-medium">Layout Settings</h4>
            <p className="text-muted-foreground text-xs">
              Customize your dashboard layout preferences.
            </p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Preset</label>
              {/* @ts-ignore - Select.Root collection prop type issue */}
              <Select.Root
                defaultValue={[themePreset]}
                onValueChange={(e: any) => {
                  const value = Array.isArray(e.value) ? e.value[0] : e.value;
                  if (typeof value === 'string') {
                    handleValueChange('theme_preset', value);
                  }
                }}
              >
                <SelectControl>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValueText placeholder="Preset" />
                  </SelectTrigger>
                </SelectControl>
                <SelectPositioner>
                  <SelectContent>
                    {THEME_PRESET_OPTIONS.map((preset: any) => (
                      // @ts-ignore - SelectItem value prop type issue
                      <SelectItem key={preset.value} className="text-xs" value={preset.value}>
                        <span
                          className="size-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              themeMode === 'dark' ? preset.primary.dark : preset.primary.light,
                          }}
                        />
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectPositioner>
              </Select.Root>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Mode</label>
              <RadioGroup.Root
                value={themeMode}
                onValueChange={value => handleValueChange('theme_mode', value)}
              >
                <HStack gap={2}>
                  <HStack gap={1}>
                    <RadioGroup.Item value="light" id="mode-light" />
                    <label htmlFor="mode-light" className="text-xs cursor-pointer">Light</label>
                  </HStack>
                  <HStack gap={1}>
                    <RadioGroup.Item value="dark" id="mode-dark" />
                    <label htmlFor="mode-dark" className="text-xs cursor-pointer">Dark</label>
                  </HStack>
                </HStack>
              </RadioGroup.Root>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Sidebar Variant</label>
              <RadioGroup.Root
                value={variant}
                onValueChange={value => handleValueChange('sidebar_variant', value)}
              >
                <HStack gap={2} flexWrap="wrap">
                  <HStack gap={1}>
                    <RadioGroup.Item value="inset" id="variant-inset" />
                    <label htmlFor="variant-inset" className="text-xs cursor-pointer">Inset</label>
                  </HStack>
                  <HStack gap={1}>
                    <RadioGroup.Item value="sidebar" id="variant-sidebar" />
                    <label htmlFor="variant-sidebar" className="text-xs cursor-pointer">Sidebar</label>
                  </HStack>
                  <HStack gap={1}>
                    <RadioGroup.Item value="floating" id="variant-floating" />
                    <label htmlFor="variant-floating" className="text-xs cursor-pointer">Floating</label>
                  </HStack>
                </HStack>
              </RadioGroup.Root>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Navbar Style</label>
              <RadioGroup.Root
                value={navbarStyle}
                onValueChange={value => handleValueChange('navbar_style', value)}
              >
                <HStack gap={2}>
                  <HStack gap={1}>
                    <RadioGroup.Item value="sticky" id="navbar-sticky" />
                    <label htmlFor="navbar-sticky" className="text-xs cursor-pointer">Sticky</label>
                  </HStack>
                  <HStack gap={1}>
                    <RadioGroup.Item value="scroll" id="navbar-scroll" />
                    <label htmlFor="navbar-scroll" className="text-xs cursor-pointer">Scroll</label>
                  </HStack>
                </HStack>
              </RadioGroup.Root>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Sidebar Collapsible</label>
              <RadioGroup.Root
                value={collapsible}
                onValueChange={value => handleValueChange('sidebar_collapsible', value)}
              >
                <HStack gap={2}>
                  <HStack gap={1}>
                    <RadioGroup.Item value="icon" id="collapsible-icon" />
                    <label htmlFor="collapsible-icon" className="text-xs cursor-pointer">Icon</label>
                  </HStack>
                  <HStack gap={1}>
                    <RadioGroup.Item value="offcanvas" id="collapsible-offcanvas" />
                    <label htmlFor="collapsible-offcanvas" className="text-xs cursor-pointer">OffCanvas</label>
                  </HStack>
                </HStack>
              </RadioGroup.Root>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Content Layout</label>
              <RadioGroup.Root
                value={contentLayout}
                onValueChange={value => handleValueChange('content_layout', value)}
              >
                <HStack gap={2}>
                  <HStack gap={1}>
                    <RadioGroup.Item value="centered" id="layout-centered" />
                    <label htmlFor="layout-centered" className="text-xs cursor-pointer">Centered</label>
                  </HStack>
                  <HStack gap={1}>
                    <RadioGroup.Item value="full-width" id="layout-full-width" />
                    <label htmlFor="layout-full-width" className="text-xs cursor-pointer">Full Width</label>
                  </HStack>
                </HStack>
              </RadioGroup.Root>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover.Root>
  );
}
