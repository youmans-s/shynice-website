'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginClient() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const searchParams = useSearchParams()

  const nextUrl = searchParams.get('next') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // If already signed in, go straight to admin
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return
      if (data.session) router.replace(nextUrl)
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      // If password provided -> password sign-in
      if (password.trim()) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) {
          setMessage(error.message)
          return
        }

        router.replace(nextUrl)
        return
      }

      // Otherwise -> magic link (passwordless)
      // NOTE: this will send an email to you. You can remove this section if you only want password login.
      const origin =
        typeof window !== 'undefined' ? window.location.origin : ''

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}${nextUrl}`,
        },
      })

      if (error) {
        setMessage(error.message)
        return
      }

      setMessage('Check your email for the sign-in link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl font-semibold">Admin login</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Sign in to access your private dashboard.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-2xl border bg-white/70 p-5">
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Password (optional — leave blank for magic link)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md border px-4 py-2 font-medium hover:bg-neutral-50 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : password.trim() ? 'Sign in' : 'Send magic link'}
        </button>

        {message && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
