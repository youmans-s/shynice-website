import Link from 'next/link'

export default function SiteNav() {
  return (
    <header className="py-6">
      <nav className="flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          shynice.com
        </Link>
      </nav>
    </header>
  )
}
