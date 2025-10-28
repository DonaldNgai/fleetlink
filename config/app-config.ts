import packageJson from '../package.json';

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: 'FleetLink',
  version: packageJson.version,
  copyright: `© ${currentYear}, FleetLink.`,
  meta: {
    title: 'FleetLink - Reliable Equipment Rental',
    description:
      'FleetLink is a modern fully automated construction equipment rental platform. It handles all the payment and management processes so you can focus on your projects.',
  },
};

export const adminRedirectPath = '/admin/';
export const loginRedirectPath = '/dashboard/';
export const logoutRedirectPath = '/';
