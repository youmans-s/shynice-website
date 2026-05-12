import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shynice | Software Engineer',
  description: 'Portfolio, projects, resume, and contact.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <div className="page-wave" aria-hidden="true" />
        <SpeedInsights />
      </body>
    </html>
  )
}
