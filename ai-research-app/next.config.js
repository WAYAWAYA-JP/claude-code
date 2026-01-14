/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/claude-code',
  assetPrefix: '/claude-code/',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
