import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'I will say NO',
  description: 'An iMessage-like interface that responds with a bold NO',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 