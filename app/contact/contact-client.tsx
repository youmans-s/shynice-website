'use client'

import { useState } from 'react'
import { PROFILE } from '@/lib/supabase/portfolio-data'

export default function ContactClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()

    // Simple “send message” using mailto (no backend / no spam risk)
    const subject = encodeURIComponent(`Portfolio message from ${name || 'Someone'}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <div className="h-[2px] w-40 bg-emerald-500/80" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-[#f3efe5] p-5 ring-1 ring-black/5">
          <div className="text-sm font-semibold">Email</div>
          <div className="mt-2 text-sm text-neutral-700 break-words">{PROFILE.email}</div>
        </div>

        <div className="rounded-2xl bg-[#f4f7fb] p-5 ring-1 ring-black/5">
          <div className="text-sm font-semibold">Message me</div>
          <div className="mt-2 text-sm text-neutral-700">
            Send a note about opportunities, projects, or collaboration.
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-2xl bg-[#f4f7fb] p-5 ring-1 ring-black/5 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm text-neutral-700">Name</label>
            <input
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-700">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              type="email"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-neutral-700">Message</label>
          <textarea
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            rows={6}
            required
          />
        </div>

        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow hover:brightness-105 active:brightness-95"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
