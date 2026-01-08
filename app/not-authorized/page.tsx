import Link from 'next/link'

export default function NotAuthorizedPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Not authorized</h1>
      <p className="text-neutral-700">This admin area is restricted.</p>

      <Link className="hover:underline" href="/">
        Go back home
      </Link>
    </div>
  )
}
