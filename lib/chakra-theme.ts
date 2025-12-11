import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'] });

// Convert HSL color values to hex for Chakra UI
// Using the existing color scheme from globals.css
const theme = defineConfig({
  theme: {
    tokens: {
      colors: {
        background: { value: 'hsl(0 0% 100%)' },
        foreground: { value: 'hsl(222.2 84% 4.9%)' },
        card: { value: 'hsl(0 0% 100%)' },
        'card-foreground': { value: 'hsl(222.2 84% 4.9%)' },
        popover: { value: 'hsl(0 0% 100%)' },
        'popover-foreground': { value: 'hsl(222.2 84% 4.9%)' },
        primary: { value: 'hsl(222.2 47.4% 11.2%)' },
        'primary-foreground': { value: 'hsl(210 40% 98%)' },
        secondary: { value: 'hsl(210 40% 96.1%)' },
        'secondary-foreground': { value: 'hsl(222.2 47.4% 11.2%)' },
        muted: { value: 'hsl(210 40% 96.1%)' },
        'muted-foreground': { value: 'hsl(215.4 16.3% 46.9%)' },
        accent: { value: 'hsl(210 40% 96.1%)' },
        'accent-foreground': { value: 'hsl(222.2 47.4% 11.2%)' },
        destructive: { value: 'hsl(0 84.2% 60.2%)' },
        'destructive-foreground': { value: 'hsl(210 40% 98%)' },
        border: { value: 'hsl(214.3 31.8% 91.4%)' },
        input: { value: 'hsl(214.3 31.8% 91.4%)' },
        ring: { value: 'hsl(222.2 84% 4.9%)' },
      },
      fonts: {
        body: { value: manrope.style.fontFamily },
        heading: { value: manrope.style.fontFamily },
      },
      radii: {
        lg: { value: '0.5rem' },
        md: { value: 'calc(0.5rem - 2px)' },
        sm: { value: 'calc(0.5rem - 4px)' },
      },
    },
    semanticTokens: {
      colors: {
        'chakra-body-text': { value: { base: '{colors.foreground}', _dark: 'hsl(210 40% 98%)' } },
        'chakra-body-bg': { value: { base: '{colors.background}', _dark: 'hsl(222.2 84% 4.9%)' } },
        'chakra-border-color': { value: { base: '{colors.border}', _dark: 'hsl(217.2 32.6% 17.5%)' } },
      },
    },
  },
});

export const system = createSystem(defaultConfig, theme);

