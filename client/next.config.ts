import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  ...(process.env.NODE_ENV === 'production' && {
    distDir: '../public'
  })
};

export default nextConfig;
