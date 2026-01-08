import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROJECTS } from '@/lib/supabase/site-data'

const FALLBACK_IMAGE = '/logo.png' // make sure /public/logo.png exists (you said it does)

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find((p) => p.slug === params.slug)
  if (!project) return notFound()

  const imageSrc = project.image ?? FALLBACK_IMAGE

  return (
    <div className="space-y-6">
      <Link className="text-sm hover:underline" href="/projects">
        ← Back to Projects
      </Link>

      <div className="rounded-2xl border overflow-hidden bg-neutral-50">
        <Image
          src={imageSrc}
          alt={project.title}
          width={1600}
          height={1000}
          className="h-[360px] w-full object-cover"
          priority
        />
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-semibold">{project.title}</h1>
        {/* <p className="text-neutral-700 text-lg">{project.long}</p> */}

        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="rounded-full border px-3 py-1 text-sm text-neutral-700">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border p-6 space-y-3">
        <h2 className="text-xl font-semibold">Highlights</h2>
        <ul className="list-inside list-disc space-y-1 text-neutral-700">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        {project.links?.length ? (
          <div className="pt-2 flex flex-wrap gap-3">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
