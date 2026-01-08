'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ScriptHoverWord from '@/components/ScriptHoverWord'
import { PROFILE, CERTIFICATIONS } from '@/lib/supabase/portfolio-data'
import BrandLogo from '@/components/BrandLogo'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

/** Simple inline icons (no extra dependencies) */
function Icon({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-5 w-5 items-center justify-center">{children}</span>
}

function HomeIcon() {
  return (
    <Icon>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    </Icon>
  )
}
function ResumeIcon() {
  return (
    <Icon>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 3h10v18H7z" />
        <path d="M9 7h6M9 11h6M9 15h6" />
      </svg>
    </Icon>
  )
}
function WorkIcon() {
  return (
    <Icon>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 6V4h6v2" />
        <path d="M4 7h16v13H4z" />
      </svg>
    </Icon>
  )
}
function ContactIcon() {
  return (
    <Icon>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16v12H4z" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    </Icon>
  )
}

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 transition hover:bg-emerald-100 hover:text-emerald-800">
      {children}
    </span>
  )
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 .5A11.5 11.5 0 0 0 8.4 23c.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.8 2.5 3.3 1.8.1-.7.4-1.1.7-1.4-2.6-.3-5.3-1.3-5.3-5.7 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3 .1a10.4 10.4 0 0 1 5.4 0c2.1-.4 3-.1 3-.1.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.1v3.1c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3.5 21h3V9h-3v12zM9 9h2.9v1.6h.04c.4-.8 1.4-1.7 2.9-1.7 3.1 0 3.7 2 3.7 4.6V21h-3v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9V9z" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.8l-5.3-6.6L4.9 22H2l7.4-8.5L1 2h7l4.8 6.1L18.9 2zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20z" />
    </svg>
  )
}
function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M20 4.8A16.7 16.7 0 0 0 16 3.5l-.5 1.1a14.8 14.8 0 0 0-3.1-.3 14.8 14.8 0 0 0-3.1.3L8.8 3.5A16.7 16.7 0 0 0 4.8 4.8C2.8 7.8 2.2 10.7 2.4 13.6c1.2.9 2.5 1.6 3.9 2.1l.7-1.2c-.5-.2-1-.5-1.5-.8l.3-.2c3 1.4 6.2 1.4 9.2 0l.3.2c-.5.3-1 .6-1.5.8l.7 1.2c1.4-.5 2.7-1.2 3.9-2.1.3-3-.3-5.8-2.3-8.8zM8.5 12.7c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3 1.1.6 1.1 1.3-.5 1.3-1.1 1.3zm7 0c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3 1.1.6 1.1 1.3-.5 1.3-1.1 1.3z" />
    </svg>
  )
}

export default function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const tabs = [
    { href: '/', label: 'Home', icon: <HomeIcon /> },
    { href: '/resume', label: 'Resume', icon: <ResumeIcon /> },
    { href: '/projects', label: 'Work', icon: <WorkIcon /> },
    { href: '/contact', label: 'Contact', icon: <ContactIcon /> },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* gradient frame */}
      <div className="rounded-[34px] bg-gradient-to-br from-emerald-500 via-emerald-400 to-pink-400 p-[3px] shadow-lg">
        {/* wave background surface */}
        <div className="rounded-[32px] wave-surface p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              {/* TOP BAR (tabs above BOTH cards like the demo) */}
              <div className="mb-14 flex items-start justify-between gap-4">
  {/* Push logo closer to the top-left corner */}
  <div className="-ml-2 -mt-2">
    <BrandLogo />
  </div>

  <div className="rounded-2xl bg-white/70 backdrop-blur-md p-2 shadow-sm ring-1 ring-black/5">
    <div className="flex gap-2">
      {tabs.map((t) => {
        const active = isActive(pathname, t.href)
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cx(
              'flex w-[92px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-3 text-xs font-semibold transition',
              active
                ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            )}
          >
            <span className={cx(active ? 'text-white' : 'text-neutral-700')}>{t.icon}</span>
            <span>{t.label}</span>
          </Link>
        )
      })}
    </div>
  </div>


              </div>

              {/* TWO EQUAL-HEIGHT CARDS */}
              <div className="grid grid-cols-[320px_1fr] gap-6 items-stretch">
                {/* LEFT SIDEBAR */}
                <aside className="relative h-full rounded-3xl bg-white/70 backdrop-blur-md shadow-sm ring-1 ring-black/5 px-5 pb-5 pt-20">
                  {/* floating avatar (half outside the sidebar like the demo) */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-32 w-32 overflow-hidden rounded-3xl bg-neutral-100 ring-1 ring-black/10 shadow-md">
                      <Image
                        src={PROFILE.profileImage}
                        alt="Profile photo"
                        width={320}
                        height={320}
                        className="h-full w-full object-cover"
                        priority
                      />
                    </div>
                  </div>

                  <div className="flex h-full flex-col items-center text-center">
                    <div className="mt-4 text-3xl font-semibold tracking-tight">
                      {PROFILE.firstName} {PROFILE.lastName}{' '}

                      {/* <span className="text-emerald-700">
                        <ScriptHoverWord>{PROFILE.lastName}</ScriptHoverWord>
                        <ScriptHoverWord>{PROFILE.firstName}</ScriptHoverWord>
                      </span> */}
                    </div>

                    <div className="mt-1 text-sm text-neutral-600">{PROFILE.title}</div>

                    {/* socials */}
                    <div className="mt-5 flex items-center gap-3">
                      <a href={PROFILE.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                        <SocialIcon>
                          <GithubIcon />
                        </SocialIcon>
                      </a>
                      <a href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                        <SocialIcon>
                          <LinkedInIcon />
                        </SocialIcon>
                      </a>
                      <a href={PROFILE.socials.x} target="_blank" rel="noreferrer" aria-label="X">
                        <SocialIcon>
                          <XIcon />
                        </SocialIcon>
                      </a>
                      <a href={PROFILE.socials.discord} target="_blank" rel="noreferrer" aria-label="Discord">
                        <SocialIcon>
                          <DiscordIcon />
                        </SocialIcon>
                      </a>
                    </div>

                    {/* certifications */}
<div className="mt-6 w-full rounded-2xl bg-[#f4f7fb] p-4 text-left ring-1 ring-black/5">
  <div className="flex items-center justify-between">
    <div className="text-xs text-neutral-500">Certifications</div>
  </div>

  <div className="mt-3 space-y-3">
    {CERTIFICATIONS.map((c) => (
      <div key={c.name} className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-neutral-900">{c.name}</div>
          <div className="mt-0.5 text-xs text-neutral-600">
            {c.issuer}
            {c.year ? ` • ${c.year}` : ''}
          </div>
        </div>

        {c.url ? (
          <a
            href={c.url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-lg bg-white/70 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-black/5 hover:bg-white"
          >
            View
          </a>
        ) : null}
      </div>
    ))}
  </div>
</div>

                    {/* contact info */}
                    <div className="mt-6 w-full rounded-2xl bg-white/60 p-4 text-left ring-1 ring-black/5">
                      <div className="text-xs text-neutral-500">Email</div>
                      <div className="text-sm font-medium text-neutral-900 break-words">{PROFILE.email}</div>

                      <div className="mt-4 text-xs text-neutral-500">Location</div>
                      <div className="text-sm font-medium text-neutral-900">{PROFILE.location}</div>
                    </div>

                    {/* pinned resume button (keeps sidebar looking “filled”) */}
                    <div className="mt-auto w-full pt-5">
                      <a
                        href={PROFILE.resumeUrl}
                        download
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow hover:brightness-105 active:brightness-95"
                      >
                        Download Resume
                      </a>
                    </div>
                  </div>
                </aside>

                {/* RIGHT CONTENT */}
                <section className="h-full">
                  <div className="h-full rounded-3xl bg-white/70 backdrop-blur-md p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
                    {children}
                  </div>
                </section>
              </div>
              {/* end two cards */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
