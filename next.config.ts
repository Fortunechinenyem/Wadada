import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.json$/,
      use: "json-loader",
      type: "javascript/auto",
    });
    return config;
  },
};

export default nextConfig;
