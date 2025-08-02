import { Inter, Noto_Sans_KR } from 'next/font/google';

// 영문 폰트 - Inter
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// 한글 폰트 - Noto Sans KR
export const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: true,
  fallback: ['Malgun Gothic', 'Apple SD Gothic Neo', 'sans-serif'],
});

// 폰트 클래스명 결합
export const fontClassNames = `${inter.variable} ${notoSansKr.variable}`;