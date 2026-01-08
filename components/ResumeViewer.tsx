'use client'

import { useEffect, useState } from 'react'

export default function ResumeViewer({ src = '/resume.pdf' }: { src?: string }) {
  const [status, setStatus] = useState<'checking' | 'ok' | 'missing'>('checking')

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        const res = await fetch(src, { method: 'HEAD' })
        const ct = res.headers.get('content-type') ?? ''

        // If your server doesn’t return a content-type for HEAD,
        // still accept res.ok as a good signal.
        const looksLikePdf = ct.includes('pdf') || ct === ''

        if (!cancelled) setStatus(res.ok && looksLikePdf ? 'ok' : 'missing')
      } catch {
        if (!cancelled) setStatus('missing')
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [src])

  if (status === 'checking') {
    return <p className="text-neutral-600">Loading resume…</p>
  }

  if (status === 'missing') {
    return (
      <div className="rounded-xl border p-4">
        <div className="font-semibold">Resume not found</div>
        <p className="mt-1 text-sm text-neutral-700">
          Add your PDF at <code>public/resume.pdf</code> (exact filename), then restart your dev server.
        </p>
      </div>
    )
  }

  return (
    <div className="h-[80vh] w-full overflow-hidden rounded-2xl border bg-white">
      <iframe src={`${src}#toolbar=0&navpanes=0`} className="h-full w-full" />
    </div>
  )
}
