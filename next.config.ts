import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['chakraui', '@repo/next-utils'],
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
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
