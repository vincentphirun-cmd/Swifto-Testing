import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import './globals.css'
import { AuthProviderWrapper } from '@/components/auth-provider-wrapper'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Swifto - Get trusted help fast from verified students',
  description: 'Post a task in minutes. Pay securely. Confirm when it\'s done.',
}

const abortErrorScript = `
(function() {
  function isAbortError(err) {
    if (!err) return false;
    if (typeof err === 'string') return err.toLowerCase().indexOf('abort') !== -1;
    if (err.name === 'AbortError') return true;
    var msg = typeof err.message === 'string' ? err.message : '';
    return msg.toLowerCase().indexOf('abort') !== -1;
  }
  window.addEventListener('unhandledrejection', function(e) {
    if (isAbortError(e && e.reason)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
  window.addEventListener('error', function(e) {
    if (isAbortError(e && e.error)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bricolage.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: abortErrorScript }} />
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  )
}

