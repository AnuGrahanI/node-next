import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.externals.push({
  //       bufferutil: 'bufferutil',
  //       'utf-8-validate': 'utf-8-validate',
  //     });
  //   }
  //   return config;
  // },
  images: {
    domains: ['lh3.googleusercontent.com'], // allow Google profile photos
  },
};

export default nextConfig;
