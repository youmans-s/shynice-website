'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PROJECTS } from '@/lib/supabase/portfolio-data'

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
      className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-black/5 hover:bg-emerald-50"
    >
      {label} →
    </a>
  )
}

export default function ProjectsClient() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
        <div className="h-[2px] w-40 bg-emerald-500/80" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PROJECTS.map((p) => {
          const open = openId === p.id

          return (
            <div key={p.id} className="overflow-hidden rounded-2xl bg-[#f3efe5] ring-1 ring-black/5">
              {/* Card header */}
              <button
                type="button"
                onClick={() => setOpenId(open ? null : p.id)}
                className="w-full text-left"
                aria-expanded={open}
              >
                <div className="grid grid-cols-[120px,1fr] gap-4 p-4">
                  <div className="h-24 w-28 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
                    {p.image ? (
                      <Image src={p.image} alt="" width={220} height={160} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-emerald-200 via-white to-pink-200" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs text-neutral-600">{p.category}</div>
                    <div className="mt-1 text-lg font-semibold">{p.title}</div>
                    <div className="mt-1 text-sm text-neutral-700">{p.summary}</div>
                    <div className="mt-2 text-xs text-emerald-800 font-semibold">
                      {open ? 'Click to collapse ↑' : 'Click for details →'}
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded */}
              {open && (
                <div className="border-t border-black/5 bg-white/70 p-4">
                  <div className="grid gap-5 lg:grid-cols-2">
                    {/* LEFT: text details */}
                    <div className="space-y-4">
                      {p.details && <p className="text-sm text-neutral-700 leading-relaxed">{p.details}</p>}

                      {p.role && (
                        <div>
                          <div className="text-xs font-semibold text-neutral-600">Role</div>
                          <div className="mt-1 text-sm text-neutral-800">{p.role}</div>
                        </div>
                      )}

                      {p.techStack && p.techStack.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-neutral-600">Tech stack</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {p.techStack.map((t) => (
                              <Chip key={t}>{t}</Chip>
                            ))}
                          </div>
                        </div>
                      )}

                      {p.skills && p.skills.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-neutral-600">Skills showcased</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {p.skills.map((s) => (
                              <Chip key={s}>{s}</Chip>
                            ))}
                          </div>
                        </div>
                      )}

                      {p.highlights && p.highlights.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-neutral-600">Highlights</div>
                          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-700">
                            {p.highlights.map((h) => (
                              <li key={h}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {p.links && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {p.links.github && <LinkBtn href={p.links.github} label="GitHub" />}
                          {p.links.demo && <LinkBtn href={p.links.demo} label="Demo" />}
                          {p.links.site && <LinkBtn href={p.links.site} label="Public site" />}
                          {p.links.linkedin && <LinkBtn href={p.links.linkedin} label="LinkedIn" />}
                        </div>
                      )}
                    </div>

                    {/* RIGHT: media */}
                    <div className="space-y-3">
                      {/* demo */}
                      {p.demo?.type === 'youtube' && (
                        <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-black/5">
                          <div className="relative aspect-video">
                            <iframe
                              className="absolute inset-0 h-full w-full"
                              src={p.demo.embedUrl}
                              title={`${p.title} demo video`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}

                      {p.demo?.type === 'video' && (
                        <video
                          className="w-full rounded-2xl ring-1 ring-black/5"
                          controls
                          src={p.demo.src}
                        />
                      )}

                      {/* gallery */}
                      {p.gallery && p.gallery.length > 0 && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {p.gallery.map((img) => (
                            <div key={img.src} className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
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

                      {/* fallback note if no media */}
                      {!p.demo && (!p.gallery || p.gallery.length === 0) && (
                        <div className="rounded-2xl bg-white p-4 text-sm text-neutral-600 ring-1 ring-black/5">
                          Add demo media by setting <span className="font-mono">demo</span> or <span className="font-mono">gallery</span> in{' '}
                          <span className="font-mono">lib/portfolio-data.ts</span>.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
