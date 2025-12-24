import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@DonaldNgai/chakra-ui', '@DonaldNgai/next-utils'],
  experimental: {
    clientSegmentCache: true,
  },
  webpack: (config, { isServer }) => {
    // Resolve TypeScript path aliases for webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ui': path.resolve(__dirname, 'packages/ui/src'),
      '@utils': path.resolve(__dirname, 'packages/next-utils/src'),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
