/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ["image/webp"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.liaisonbank.com",
        port: "",
        pathname: "/uploads/**",
      },
      // Local development
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://liaisonbank.frappe.cloud;",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  // Allow development access from other devices
  // through the Cloudflare tunnel
  allowedDevOrigins: [
    
    "localhost",
    "*.localhost",
    "192.168.56.1",
    "commodity-seventh-motorcycle-though.trycloudflare.com",
  ],
};

module.exports = nextConfig;

