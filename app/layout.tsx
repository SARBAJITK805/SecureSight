import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SecureSight - CCTV Monitoring Dashboard',
  description: 'Advanced CCTV monitoring and incident management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white antialiased">
        {children}
      </body>
    </html>
  )
}