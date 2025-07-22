import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MANDIACX - Security Monitoring',
  description: 'Advanced CCTV monitoring and incident management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0D1117] text-gray-200 antialiased`}>
        {children}
      </body>
    </html>
  )
}