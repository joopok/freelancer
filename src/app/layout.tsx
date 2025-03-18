import './styles/globals.css'
import './styles/animations.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/components/layout/Header";
import Bottom from "@/components/layout/Bottom";
import dynamic from 'next/dynamic';
import LoadingProvider from '@/components/layout/Loading';

const inter = Inter({ subsets: ["latin"] });

// 클라이언트 컴포넌트로 동적 임포트
const ClientLoadingProvider = dynamic(
  () => import('@/components/layout/Loading').then(mod => mod.default),
  { ssr: false }
);

// 클라이언트 컴포넌트로 동적 임포트
const ClientStateProvider = dynamic(
  () => import('@/components/layout/StateProvider').then(mod => mod.default),
  { ssr: false }
);

// 클라이언트 앱 컨테이너 동적 임포트
const ClientAppContainer = dynamic(
  () => import('./ClientAppContainer'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: '잡코리아 빌보드',
  description: '프리랜서와 프로젝트를 연결하는 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="h-full">
    <body className={ `${inter.className} flex flex-col min-h-screen` }>
      <LoadingProvider>
        <ClientLoadingProvider>
          <ClientAppContainer>
            <ClientStateProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Bottom />
            </ClientStateProvider>
          </ClientAppContainer>
        </ClientLoadingProvider>
      </LoadingProvider>
      </body>
    </html>
  )
}
