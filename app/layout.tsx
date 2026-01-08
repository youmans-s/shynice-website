import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shynice | Software Engineer',
  description: 'Portfolio, projects, resume, and contact.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="page-wave" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
