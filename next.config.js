/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('next-bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

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
    // 이미지 최적화 설정
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
  // 메모리 사용량을 줄이기 위한 webpack 설정
  webpack: (config, { isServer }) => {
    // 클라이언트 사이드 최적화
    if (!isServer) {
      // 클라이언트 청크 그룹화
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
  // CORS 이슈 해결을 위한 프록시 설정 수정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*'
      }
    ];
  }
}

module.exports = withBundleAnalyzer(nextConfig); 