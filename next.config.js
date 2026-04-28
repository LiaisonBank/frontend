/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  // ✅ Image optimization config
  images: {
    // domains: ["picsum.photos"],
    formats: ['image/avif', 'image/webp'],
  },

  // ✅ Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://liaisonbank.frappe.cloud;",
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

  // ✅ Dev environment allowed origins
  allowedDevOrigins: [
    "192.168.56.1",
    "localhost",
    "*.localhost",
  ],
};

module.exports = nextConfig;