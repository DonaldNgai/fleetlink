import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@DonaldNgai/chakra-ui', '@DonaldNgai/next-utils'],
  experimental: {
    clientSegmentCache: true,
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
