'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  async function onSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={onSignOut}
      className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
    >
      Sign out
    </button>
  )
}
