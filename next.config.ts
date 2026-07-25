import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ["image/webp"],
    deviceSizes: [390, 768, 1920, 3840],
  },
};

export default nextConfig;
