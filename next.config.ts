import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: false, // disables LightningCSS
  },
};

export default nextConfig;
