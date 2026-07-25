import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
    formats: ["image/webp"],
    deviceSizes: [390, 768, 1920, 3840],
  },
};

export default nextConfig;
