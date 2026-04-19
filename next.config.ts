import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
      allowedOrigins: [
        'linart.club', 
        '*.linart.club', 
        'www.linart.club',
        'crm-iot.com', 
        '*.crm-iot.com', 
        'www.crm-iot.com',
        'localhost:3000'
      ],
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
