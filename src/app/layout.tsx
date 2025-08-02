import "@/app/styles/globals.css";
import { fontClassNames } from '@/app/fonts';
import { defaultMetadata } from '@/app/metadata';
import LoadingProvider from '@/components/layout/Loading';
import Header from '@/components/layout/Header';
import Bottom from '@/components/layout/Bottom';
import { WebSocketProvider } from '@/components/providers/WebSocketProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ClientOnly } from '@/components/ClientOnly';
import Script from 'next/script';

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={fontClassNames} suppressHydrationWarning>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = JSON.parse(localStorage.getItem('theme-storage'));
                  if (theme && theme.state && theme.state.isDarkMode) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <ErrorBoundary>
          <LoadingProvider>
            <WebSocketProvider>
              <div className="min-h-screen flex flex-col">
                <ClientOnly>
                  <Header />
                </ClientOnly>
                <main className="flex-1">
                  {children}
                </main>
                <Bottom />
              </div>
            </WebSocketProvider>
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
} 