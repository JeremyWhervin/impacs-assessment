import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Setting turbo to false disables Turbopack, which in turn disables Lightning CSS
    turbo: false, 
  },
};

export default nextConfig;