import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@DonaldNgai/next-utils', '@DonaldNgai/chakra-ui'],
  experimental: {
    clientSegmentCache: true,
    optimizePackageImports: ['@chakra-ui/react'],
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
