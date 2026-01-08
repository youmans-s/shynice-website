'use client'

export default function ScriptHoverWord({
  children,
  accent = 'emerald',
}: {
  children: string
  accent?: 'emerald' | 'pink'
}) {
  const scriptColor = accent === 'pink' ? 'text-pink-500' : 'text-emerald-700'
  const underlineColor = accent === 'pink' ? 'bg-pink-500' : 'bg-emerald-500'

  return (
    <span className="relative inline-block group cursor-default align-baseline">
      {/* normal text */}
      <span className="transition-opacity duration-200 group-hover:opacity-0">{children}</span>

      {/* cursive overlay */}
      <span
        className={[
          'absolute inset-0 opacity-0 transition-all duration-200',
          'group-hover:opacity-100 group-hover:-rotate-1',
          'text-[1.15em]',
          'font-[var(--font-script)]',
          scriptColor,
        ].join(' ')}
      >
        {children}
      </span>

      {/* underline “ink stroke” */}
      <span
        className={[
          'pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full',
          underlineColor,
          'origin-left scale-x-0 transition-transform duration-200',
          'group-hover:scale-x-100',
        ].join(' ')}
      />
    </span>
  )
}
