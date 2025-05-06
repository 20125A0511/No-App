import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'I will say NO',
  description: 'An iMessage-like interface that responds with a bold NO',
  icons: {
    icon: '/app_logo.png',
    apple: '/app_logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/app_logo.png" />
        <link rel="apple-touch-icon" href="/app_logo.png" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
} 