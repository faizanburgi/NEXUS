import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 blocks cross-origin requests to dev-only assets by default.
  // Allow the common local hosts so client chunks (and HMR) load whether the
  // app is opened via localhost, 127.0.0.1, or a LAN IP during development.
  allowedDevOrigins: ["localhost", "127.0.0.1", "0.0.0.0", "*.local"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
