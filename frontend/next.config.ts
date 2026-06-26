import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "sultanat-explore.img.hasbii.online",
      },
    ],
  },
}

export default nextConfig
