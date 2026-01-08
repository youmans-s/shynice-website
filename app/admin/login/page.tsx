import { Suspense } from 'react'
import LoginClient from './login-client'

export const dynamic = 'force-dynamic' // recommended for auth pages

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 py-10 text-neutral-600">Loading…</div>}>
      <LoginClient />
    </Suspense>
  )
}
