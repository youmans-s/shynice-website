import PortfolioShell from '@/components/PortfolioShell'
import { WHAT_I_DO } from '@/lib/supabase/portfolio-data'

export default function HomePage() {
  return (
    <PortfolioShell>
      <div className="space-y-8">
        {/* About */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold tracking-tight">ABOUT ME</h1>
            <div className="h-[2px] w-40 bg-emerald-500/80" />
          </div>

          <p className="max-w-2xl text-neutral-700 leading-relaxed">
            Hello! I’m a full‑stack developer passionate about building clean, user‑friendly products.
            I enjoy combining strong engineering fundamentals with UI that feels polished and easy to use.
          </p>
        </div>

        {/* What I do */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">What I do!</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {WHAT_I_DO.map((item) => (
              <div
                key={item.title}
                className={[
                  'rounded-2xl ring-1 ring-black/5 p-5',
                  item.style === 'image' ? 'bg-[#f3efe5]' : 'bg-[#f4f7fb]',
                ].join(' ')}
              >
                {item.style === 'image' && (
                  <div className="mb-4 h-24 rounded-2xl bg-gradient-to-br from-emerald-200 via-white to-pink-200" />
                )}

                <div className="text-lg font-semibold">{item.title}</div>
                <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortfolioShell>
  )
}
