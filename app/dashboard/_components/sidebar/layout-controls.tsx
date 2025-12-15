'use client';

import { Settings } from 'lucide-react';

import { Button } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@chakra-ui/react';
// ToggleGroup removed - use Chakra UI ButtonGroup or similar;
import { updateContentLayout, updateNavbarStyle, updateThemeMode, updateThemePreset } from '@ui';
import { setValueToCookie } from '@utils';
import { usePreferencesStore } from '@utils';
import type {
  SidebarVariant,
  SidebarCollapsible,
  ContentLayout,
  NavbarStyle,
} from '@utils';
import { THEME_PRESET_OPTIONS, type ThemePreset, type ThemeMode } from '@utils';

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
      updateThemeMode(value);
      setThemeMode(value as ThemeMode);
    }

    if (key === 'theme_preset') {
      updateThemePreset(value);
      setThemePreset(value as ThemePreset);
    }

    if (key === 'content_layout') {
      updateContentLayout(value);
    }

    if (key === 'navbar_style') {
      updateNavbarStyle(value);
    }
    await setValueToCookie(key, value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon">
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
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
              <Select
                value={themePreset}
                onValueChange={value => handleValueChange('theme_preset', value)}
              >
                <SelectTrigger size="sm" className="w-full text-xs">
                  <SelectValue placeholder="Preset" />
                </SelectTrigger>
                <SelectContent>
                  {THEME_PRESET_OPTIONS.map(preset => (
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
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Mode</label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={themeMode}
                onValueChange={value => handleValueChange('theme_mode', value)}
              >
                <ToggleGroupItem className="text-xs" value="light" aria-label="Toggle inset">
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem className="text-xs" value="dark" aria-label="Toggle sidebar">
                  Dark
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Sidebar Variant</label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={variant}
                onValueChange={value => handleValueChange('sidebar_variant', value)}
              >
                <ToggleGroupItem className="text-xs" value="inset" aria-label="Toggle inset">
                  Inset
                </ToggleGroupItem>
                <ToggleGroupItem className="text-xs" value="sidebar" aria-label="Toggle sidebar">
                  Sidebar
                </ToggleGroupItem>
                <ToggleGroupItem className="text-xs" value="floating" aria-label="Toggle floating">
                  Floating
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Navbar Style</label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={navbarStyle}
                onValueChange={value => handleValueChange('navbar_style', value)}
              >
                <ToggleGroupItem className="text-xs" value="sticky" aria-label="Toggle sticky">
                  Sticky
                </ToggleGroupItem>
                <ToggleGroupItem className="text-xs" value="scroll" aria-label="Toggle scroll">
                  Scroll
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Sidebar Collapsible</label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={collapsible}
                onValueChange={value => handleValueChange('sidebar_collapsible', value)}
              >
                <ToggleGroupItem className="text-xs" value="icon" aria-label="Toggle icon">
                  Icon
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="text-xs"
                  value="offcanvas"
                  aria-label="Toggle offcanvas"
                >
                  OffCanvas
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Content Layout</label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={contentLayout}
                onValueChange={value => handleValueChange('content_layout', value)}
              >
                <ToggleGroupItem className="text-xs" value="centered" aria-label="Toggle centered">
                  Centered
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="text-xs"
                  value="full-width"
                  aria-label="Toggle full-width"
                >
                  Full Width
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
