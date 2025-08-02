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
  // 성능 최적화를 위한 실험적 기능
  experimental: {
    optimizeCss: false, // critters 이슈로 인해 일시적으로 비활성화
    // 특정 패키지 import 최적화
    optimizePackageImports: ['lodash', 'date-fns', 'framer-motion', 'lucide-react'],
  },
  // 프로덕션 환경에서 console 제거
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // 페이지 파일 확장자
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // 빌드 출력
  distDir: '.next',
  // 이미지 최적화 설정
  images: {
    // 원격 이미지 호스트
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 't1.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // 이미지 최적화 설정
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    // 이미지 최소화
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1년
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 메모리 사용량을 줄이기 위한 webpack 설정
  webpack: (config, { isServer }) => {
    // 클라이언트 사이드 최적화
    if (!isServer) {
      // 클라이언트 청크 그룹화
      config.optimization.splitChunks = {
        chunks: 'all',
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          // React 관련 라이브러리
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'react',
            priority: 40,
            chunks: 'all',
          },
          // UI 라이브러리
          ui: {
            test: /[\\/]node_modules[\\/](framer-motion|@radix-ui|lucide-react)[\\/]/,
            name: 'ui',
            priority: 30,
            chunks: 'all',
          },
          // 유틸리티 라이브러리
          utils: {
            test: /[\\/]node_modules[\\/](date-fns|axios|clsx|zustand)[\\/]/,
            name: 'utils',
            priority: 25,
            chunks: 'all',
          },
          // 나머지 vendor
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 20,
            chunks: 'all',
          },
          // 공통 모듈
          common: {
            name: 'common',
            minChunks: 2,
            priority: 10,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      };

      // 런타임 청크 최적화
      config.optimization.runtimeChunk = {
        name: 'runtime',
      };

      // 모듈 ID 최적화
      config.optimization.moduleIds = 'deterministic';
    }
    
    // 번들 크기 경고 설정
    config.performance = {
      maxAssetSize: 500000, // 500KB
      maxEntrypointSize: 600000, // 600KB
    };
    
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