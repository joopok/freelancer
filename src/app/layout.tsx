import { Inter } from "next/font/google";
import "@/app/styles/globals.css";
import LoadingProvider from '@/components/layout/Loading';
import Header from '@/components/layout/Header';
import Bottom from '@/components/layout/Bottom';
import { WebSocketProvider } from '@/components/providers/WebSocketProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "잡코리아 빌보드",
  description: "프리랜서 매칭 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = JSON.parse(localStorage.getItem('theme-storage'));
                  if (theme.state.isDarkMode) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <LoadingProvider>
          <WebSocketProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Bottom />
            </div>
          </WebSocketProvider>
        </LoadingProvider>
      </body>
    </html>
  );
} 