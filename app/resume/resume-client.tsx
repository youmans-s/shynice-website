'use client'

import { useState } from 'react'
import { RESUME } from '@/lib/supabase/portfolio-data'

export default function ResumeClient() {
  const [tab, setTab] = useState<'education' | 'experience'>('education')

  const rows = tab === 'education' ? RESUME.education : RESUME.experience

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Resume</h1>
        <div className="h-[2px] w-40 bg-emerald-500/80" />
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-2xl bg-neutral-100 p-1 ring-1 ring-black/5">
        <button
          type="button"
          onClick={() => setTab('education')}
          className={[
            'rounded-2xl px-4 py-2 text-sm font-semibold transition',
            tab === 'education' ? 'bg-white shadow text-emerald-800' : 'text-neutral-700 hover:bg-white/60',
          ].join(' ')}
        >
          Education
        </button>
        <button
          type="button"
          onClick={() => setTab('experience')}
          className={[
            'rounded-2xl px-4 py-2 text-sm font-semibold transition',
            tab === 'experience' ? 'bg-white shadow text-emerald-800' : 'text-neutral-700 hover:bg-white/60',
          ].join(' ')}
        >
          Experience
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <div key={r.title + r.org} className="rounded-2xl bg-[#f3efe5] p-5 ring-1 ring-black/5">
            <div className="text-xs text-neutral-600">{r.time}</div>
            <div className="mt-1 font-semibold">{r.title}</div>
            <div className="text-sm text-neutral-700">{r.org}</div>
            {r.meta && <div className="mt-2 text-sm text-neutral-600">{r.meta}</div>}
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-[#f4f7fb] p-5 ring-1 ring-black/5">
          <div className="font-semibold">Work Skills</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {RESUME.workSkills.map((s) => (
              <span key={s} className="rounded-full bg-white px-3 py-1 text-xs text-neutral-700 ring-1 ring-black/5">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#f4f7fb] p-5 ring-1 ring-black/5">
          <div className="font-semibold">Soft Skills</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {RESUME.softSkills.map((s) => (
              <span key={s} className="rounded-full bg-white px-3 py-1 text-xs text-neutral-700 ring-1 ring-black/5">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
