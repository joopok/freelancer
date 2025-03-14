/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'play-lh.googleusercontent.com',
      't1.kakaocdn.net',
      'www.google.com'
    ],
  },
}

module.exports = nextConfig 