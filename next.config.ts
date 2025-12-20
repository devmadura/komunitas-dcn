import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },
      {
        protocol: "https",
        hostname: "**.ucarecdn.com",
      },
      {
        protocol: "https",
        hostname: "**.ucarecdn.net",
      },
      {
        protocol: "https",
        hostname: "**.ucarecd.net",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
