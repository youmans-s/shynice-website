import ResolutionsClient from './resolutions-client'
import CareerClient from './career-client'

export default function ResolutionsPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">Resolutions</h1>
        <p className="text-neutral-700">Short-term + long-term personal goals.</p>
        <ResolutionsClient />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Career Goals</h2>
        <p className="text-neutral-700">Career-focused goals (short-term + long-term).</p>
        <CareerClient />
      </section>
    </div>
  )
}
