import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const cards = [
  { title: 'Wishlist', href: '/admin/wishlist', desc: 'Bags, shoes, furniture, etc.' },
  { title: 'Resolutions', href: '/admin/resolutions', desc: 'Short-term / long-term checklists.' },
  { title: 'Apartments', href: '/admin/apartments', desc: 'Private shortlist with notes.' },
  { title: 'Outfits', href: '/admin/outfits', desc: 'Collages made from wishlist items.' },
  { title: 'Debt', href: '/admin/debts', desc: 'Balances, minimum payments, due dates.' },
]

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const email = data.user?.email ?? null

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold">Dashboard</h1>
        {email ? <p className="text-neutral-700">Signed in as: {email}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border p-4 hover:bg-neutral-50 transition"
          >
            <div className="font-semibold">{c.title}</div>
            <div className="text-sm text-neutral-700">{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}