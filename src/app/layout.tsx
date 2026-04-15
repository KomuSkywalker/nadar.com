import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nadar Kartvizit — Dijital Kartvizit Platformu',
  description: 'Profesyonel dijital kartvizitinizi dakikalar içinde oluşturun. Tek link ile paylaşın.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Nadar Kartvizit',
    description: 'Profesyonel dijital kartvizit platformu',
    url: 'https://nadarkartvizit.com',
    siteName: 'Nadar Kartvizit',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="h-full" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
