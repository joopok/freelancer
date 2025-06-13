import './styles/globals.css'
import './styles/animations.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/components/layout/Header";
import Bottom from "@/components/layout/Bottom";
import dynamic from 'next/dynamic';

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

// Auth 관련 컴포넌트 동적 임포트
const ClientAuthProvider = dynamic(
  () => import('@/components/auth/AuthProvider').then(mod => mod.default),
  { ssr: false }
);

const ClientAutoLogoutProvider = dynamic(
  () => import('@/components/auth/AutoLogoutProvider').then(mod => mod.default),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "잡코리아 빌보드",
  description: "프리랜서와 프로젝트를 연결하는 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ClientLoadingProvider>
          <ClientAppContainer>
            <ClientStateProvider>
              <ClientAuthProvider>
                <ClientAutoLogoutProvider>
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Bottom />
                </ClientAutoLogoutProvider>
              </ClientAuthProvider>
            </ClientStateProvider>
          </ClientAppContainer>
        </ClientLoadingProvider>
      </body>
    </html>
  );
}
