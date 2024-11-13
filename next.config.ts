import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Tüm hostlara izin verir
      },
    ],
  },
};

export default nextConfig;
