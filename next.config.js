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
  async redirects() {
    return [
      {
        source: '/image/art',
        destination: '/art',
        permanent: true,
      },
    ];
  },
  env: {
    PAYPAL_CLIENT_ID: 'AfjYHfieOAq6OpQyGrtQFHqcVooUAIx1pnxdQSOZFtmKKEJUpr6woB-Wys1NzP5JhGWMLRhu9d4nJiad'
  }
}

module.exports = nextConfig
