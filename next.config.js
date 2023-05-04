/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  headers: () => [
    {
      source: '/chat',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
    {
      source: '/chat/plugins/evaluate',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: '*',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET, PUT, PATCH, POST, DELETE',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: '*',
        },
      ],
    },
  ],
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
}

module.exports = nextConfig
