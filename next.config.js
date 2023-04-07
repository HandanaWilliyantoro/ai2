/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  env: {
    MIDTRANS_CLIENT_KEY: 'SB-Mid-client-tvrkLcncRRxaVXZ-'
  }
}

module.exports = nextConfig
