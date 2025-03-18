/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: [
      'play-lh.googleusercontent.com',
      't1.kakaocdn.net',
      'www.google.com',
      'images.unsplash.com',
      'randomuser.me'
    ],
  },
  // CORS 이슈 해결을 위한 프록시 설정 수정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8081/:path*'  // /api 부분 제거
      }
    ];
  }
}

module.exports = nextConfig 