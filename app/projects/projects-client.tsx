'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { PROJECTS, type PortfolioProject } from '@/lib/supabase/portfolio-data'

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white px-3 py-1 text-xs text-neutral-700 ring-1 ring-black/5">
      {children}
    </span>
  )
}

function LinkBtn({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
    >
      {label} →
    </a>
  )
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: PortfolioProject
  onOpen: () => void
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-[#f3efe5] ring-1 ring-black/5 transition hover:shadow-md">
      <div className="h-44 w-full overflow-hidden bg-white">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            width={800}
            height={400}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-200 via-white to-pink-200" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs font-medium text-neutral-600">{project.category}</div>
        <div className="mt-1 text-lg font-semibold">{project.title}</div>
        <div className="mt-2 text-sm leading-relaxed text-neutral-700">{project.summary}</div>

        {project.techStack && project.techStack.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {project.techStack.slice(0, 4).map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-xs text-neutral-500">+{project.techStack.length - 4} more</span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            View details →
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({
  project,
  onClose,
}: {
  project: PortfolioProject | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!project) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [project, onClose])

  if (!project) return null

  const hasLinks = !!(
    project.links?.github ||
    project.links?.demo ||
    project.links?.site ||
    project.links?.linkedin
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-12 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-neutral-700 shadow ring-1 ring-black/5 transition hover:bg-white hover:text-neutral-900"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="h-32 w-full overflow-hidden bg-neutral-100 sm:h-40">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                width={1200}
                height={400}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-emerald-200 via-white to-pink-200" />
            )}
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <div>
              <div className="text-xs font-medium text-neutral-600">{project.category}</div>
              <h2 id="project-modal-title" className="mt-1 text-2xl font-semibold tracking-tight">
                {project.title}
              </h2>
            </div>

            {project.details && (
              <p className="text-sm leading-relaxed text-neutral-700">{project.details}</p>
            )}

            {project.role && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Role</div>
                <div className="mt-1 text-sm text-neutral-800">{project.role}</div>
              </div>
            )}

            {project.highlights && project.highlights.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Highlights</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                  {project.highlights.map((h) => (
                    <li key={h} className="leading-relaxed">{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.techStack && project.techStack.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Tech stack</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>
            )}

            {project.skills && project.skills.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Skills</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.skills.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
            )}

            {project.demo?.type === 'youtube' && (
              <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-black/5">
                <div className="relative aspect-video">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={project.demo.embedUrl}
                    title={`${project.title} demo video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {project.demo?.type === 'video' && (
              <video className="w-full rounded-2xl ring-1 ring-black/5" controls src={project.demo.src} />
            )}

            {project.gallery && project.gallery.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {project.gallery.map((img) => (
                  <div key={img.src} className="overflow-hidden rounded-2xl bg-neutral-50 ring-1 ring-black/5">
                    <Image
                      src={img.src}
                      alt={img.alt ?? ''}
                      width={1200}
                      height={900}
                      className="h-44 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {hasLinks && (
          <div className="flex flex-wrap gap-2 border-t border-black/5 bg-white p-4 sm:p-5">
            {project.links?.github && <LinkBtn href={project.links.github} label="GitHub" />}
            {project.links?.demo && <LinkBtn href={project.links.demo} label="Business page" />}
            {project.links?.site && <LinkBtn href={project.links.site} label="Live Site" />}
            {project.links?.linkedin && <LinkBtn href={project.links.linkedin} label="LinkedIn" />}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProjectsClient() {
  const [openId, setOpenId] = useState<string | null>(null)
  const openProject = openId ? PROJECTS.find((p) => p.id === openId) ?? null : null

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
        <div className="h-[2px] w-40 bg-emerald-500/80" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={() => setOpenId(p.id)} />
        ))}
      </div>

      <ProjectModal project={openProject} onClose={() => setOpenId(null)} />
    </div>
  )
}