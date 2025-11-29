import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  } as any,
};

export default nextConfig;
