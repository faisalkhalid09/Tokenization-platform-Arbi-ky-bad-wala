/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Allow production build to complete even if TypeScript errors exist
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow production build to complete even if ESLint errors exist
    ignoreDuringBuilds: false,
  },
  webpack: (config) => {
    // Handle node modules that need to be polyfilled
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    
    // Enable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
  // Railway deployment configuration
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname, '../'),
  },
}

module.exports = nextConfig;
