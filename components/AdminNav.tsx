import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'

export default function AdminNav() {
  return (
    <div className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-lg font-semibold">
          Admin
        </Link>

        <Link href="/admin/wishlist" className="text-sm text-neutral-700 hover:underline">
          Wishlist
        </Link>
        <Link href="/admin/resolutions" className="text-sm text-neutral-700 hover:underline">
          Resolutions
        </Link>
        <Link href="/admin/apartments" className="text-sm text-neutral-700 hover:underline">
          Apartments
        </Link>
        <Link href="/admin/outfits" className="text-sm text-neutral-700 hover:underline">
          Outfits
        </Link>
        <Link href="/admin/debts" className="text-sm text-neutral-700 hover:underline">
          Debt
        </Link>

      </div>

      <SignOutButton />
    </div>
  )
}
