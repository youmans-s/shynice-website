'use client'

import { useState } from 'react'

export default function DragonMascot({ size = 34 }: { size?: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        aria-label="Dragon mascot"
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white/70 p-2 shadow-soft backdrop-blur transition hover:border-emerald-300"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          className="text-emerald-700 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105"
          fill="none"
        >
          {/* tail */}
          <path
            d="M14 44 C6 48, 8 58, 18 56"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* body */}
          <ellipse cx="30" cy="40" rx="18" ry="12" fill="currentColor" opacity="0.95" />

          {/* wing */}
          <path d="M22 35 L10 28 L14 46 Z" fill="currentColor" opacity="0.35" />

          {/* head */}
          <circle cx="46" cy="28" r="9" fill="currentColor" />

          {/* snout line */}
          <path
            d="M52 30 C57 30, 58 32, 58 34 C58 38, 54 39, 52 38"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* eye */}
          <circle cx="48" cy="26" r="2" fill="white" />
          <circle cx="48" cy="26" r="1" fill="#0f172a" />

          {/* flame (hot pink) */}
          <path
            d="M60 36
               C61 34, 63 34, 63 36
               C63 39, 60 40, 60 42
               C59 40, 56 39, 56 37
               C56 35, 58 35, 60 36 Z"
            fill="#ec4899"
            className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 shadow-soft">
          Go Dragons 🐉
        </div>
      )}
    </div>
  )
}
