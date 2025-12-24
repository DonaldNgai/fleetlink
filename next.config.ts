import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['chakraui', '@DonaldNgai/next-utils'],
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
