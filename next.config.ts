import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'linart.club' },
      { protocol: 'https', hostname: '*.linart.club' },
      { protocol: 'https', hostname: 'crm-iot.com' },
      { protocol: 'https', hostname: '*.crm-iot.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
};

export default nextConfig;
