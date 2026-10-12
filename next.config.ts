import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Browsers still probe /favicon.ico; the app icon is src/app/icon.png (= public/logo.png).
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/logo.png' }];
  },
  // Basic hardening (audit 2026-10). No CSP yet: the AI widget, OSM tiles and Nominatim would each need an
  // allow-list entry — add it with a report-only phase first.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // geolocation: "use my location" in the tester form; microphone: voice messages in the AI widget
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=(self), microphone=(self), payment=()' },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
      allowedOrigins: [
        'linart.club', 
        'https://linart.club',
        '*.linart.club', 
        'www.linart.club',
        'https://www.linart.club',
        'crm-iot.com', 
        'https://crm-iot.com',
        '*.crm-iot.com', 
        'www.crm-iot.com',
        'https://www.crm-iot.com',
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
