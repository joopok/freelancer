import { Metadata } from 'next';

// 기본 메타데이터
export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://techbridge.co.kr'),
  title: {
    default: 'TechBridge - IT 프리랜서 매칭 플랫폼',
    template: '%s | TechBridge'
  },
  description: 'IT 프리랜서와 기업을 연결하는 대한민국 최고의 매칭 플랫폼. 검증된 전문가를 만나보세요.',
  keywords: [
    'IT 프리랜서',
    '개발자 구인',
    '프로젝트 매칭',
    '리모트 워크',
    '프리랜서 플랫폼',
    'React 개발자',
    'Node.js 개발자',
    'Python 개발자',
    '웹 개발',
    '앱 개발'
  ],
  authors: [{ name: 'TechBridge Team' }],
  creator: 'TechBridge',
  publisher: 'TechBridge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://techbridge.co.kr',
    siteName: 'TechBridge',
    title: 'TechBridge - IT 프리랜서 매칭 플랫폼',
    description: 'IT 프리랜서와 기업을 연결하는 대한민국 최고의 매칭 플랫폼',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechBridge - IT 프리랜서 매칭 플랫폼',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechBridge - IT 프리랜서 매칭 플랫폼',
    description: 'IT 프리랜서와 기업을 연결하는 대한민국 최고의 매칭 플랫폼',
    site: '@techbridge_kr',
    creator: '@techbridge_kr',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://techbridge.co.kr',
    languages: {
      'ko-KR': 'https://techbridge.co.kr',
      'en-US': 'https://techbridge.co.kr/en',
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
    other: {
      naver: 'naver-site-verification-code',
    },
  },
};

// 페이지별 메타데이터 생성 함수
export function generatePageMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const url = `https://techbridge.co.kr${path}`;
  const imageUrl = image || '/og-image.jpg';

  return {
    title,
    description,
    keywords: [...(defaultMetadata.keywords as string[]), ...keywords],
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}