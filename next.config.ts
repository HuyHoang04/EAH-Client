import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    config.cache = false; // BẮT BUỘC phải tắt cache
    
    // Tắt hoàn toàn snapshot
    if (config.snapshot) {
      config.snapshot.managedPaths = [];
      config.snapshot.immutablePaths = [];
      config.snapshot.buildDependencies = undefined;
    }
    
    return config;
  },
};

export default nextConfig;