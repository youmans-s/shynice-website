import { Suspense } from 'react'
import ApartmentsClient from './apartments-client'

export const dynamic = 'force-dynamic' // recommended for auth/private pages

export default function ApartmentsPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-neutral-600">Loading apartments…</div>}>
      <ApartmentsClient />
    </Suspense>
  )
}
