import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  turbopack: {
    rules: {
      "*.{glb,gltf,hdr}": {
        loaders: ["file-loader"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|hdr)$/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
