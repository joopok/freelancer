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
    // 서버 사이드 최적화
    if (isServer) {
      // 서버에서 불필요한 패키지 외부화
      config.externals.push('framer-motion');
    }
    
    // 클라이언트 사이드 최적화
    if (!isServer) {
      // 클라이언트 청크 그룹화
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
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
        destination: 'http://localhost:8081/:path*'  // /api 부분 제거
      }
    ];
  }
}

module.exports = withBundleAnalyzer(nextConfig); 