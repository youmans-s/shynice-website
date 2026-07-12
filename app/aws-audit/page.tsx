import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
})
const body = Inter({ subsets: ['latin'], variable: '--font-body' })
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'AWS Cost Audit — Cut Your Bill 20–40% Without Touching Reliability',
  description:
    "A read-only AWS cost audit that shows exactly where you're overspending, in real dollars. No reliability risk. If I can't identify at least 3x the audit fee in savings, you don't pay.",
  robots: { index: false, follow: false },
}

// ============================================================
// SWAP BEFORE PUBLIC LAUNCH:
//   - RECOMMENDATION block: add Brian's real words + title once he confirms.
//   - /audit-sample.pdf: make sure this file exists in /public.
//   - CONTACT_EMAIL / BOOKING_URL: confirm both are live.
// ============================================================
const BOOKING_URL = 'https://cal.com/awsshynice/15min'
const CONTACT_EMAIL = 'aws@shynice.com'
// Wordmark shown in the nav. Note: avoid putting "AWS" in the brand name itself
// (Amazon's trademark rules don't allow it as your product/brand name). Saying
// "AWS" in descriptive copy — like the hero eyebrow — is fine.
// Alternatives: 'CloudTrim' · 'ClearSpend' · 'RightSized' · 'Cut Your Cloud Bill'
const BRAND = 'Cloud Cost Audit'
// const RECOMMENDATION_QUOTE = '"..."'
// const RECOMMENDATION_ATTRIBUTION = 'Brian Jopling, Security Engineer IV & Senior DevOps Lead'

// ---- Statement rows (illustrative example, clearly labelled) ----
const CUTS = [
  { label: 'Oversized instances (rightsizing)', amount: 2700 },
  { label: 'Non-prod running 24/7', amount: 1400 },
  { label: 'No Savings Plan coverage', amount: 2000 },
  { label: 'NAT + idle resources', amount: 853 },
  { label: 'Storage tiering + log retention', amount: 810 },
]
const CURRENT = 18400
const SAVED = CUTS.reduce((s, c) => s + c.amount, 0) // 7,763
const OPTIMIZED = CURRENT - SAVED // 10,637
const usd = (n: number) => '$' + n.toLocaleString('en-US')

// ---- Falling cherry-blossom petals (deterministic values) ----
const PETALS = [
  { left: '6%', size: 13, dur: 15, delay: -1, x: '50px' },
  { left: '16%', size: 10, dur: 19, delay: -6, x: '-40px' },
  { left: '27%', size: 15, dur: 17, delay: -3, x: '70px' },
  { left: '38%', size: 9, dur: 21, delay: -9, x: '-30px' },
  { left: '49%', size: 12, dur: 16, delay: -12, x: '55px' },
  { left: '60%', size: 14, dur: 20, delay: -4, x: '-60px' },
  { left: '71%', size: 10, dur: 18, delay: -8, x: '45px' },
  { left: '82%', size: 13, dur: 22, delay: -2, x: '-50px' },
  { left: '91%', size: 11, dur: 17, delay: -11, x: '40px' },
]

const FAQ = [
  {
    q: 'Do you need admin access?',
    a: "No — read-only billing access only. I can see your bill and usage and nothing else. No write permissions, no ability to change or delete a single resource.",
  },
  {
    q: 'Will this cause downtime?',
    a: 'No. The quick wins carry no reliability risk, and nothing in production is touched without your explicit written sign-off. Safe, mechanical fixes are kept separate from changes that need a conversation.',
  },
  {
    q: 'How long does it take?',
    a: 'Cost Quick Look: about 3 days. Full Audit: 1–2 weeks from access to report.',
  },
  {
    q: "What if we've already optimized?",
    a: "Then I'll tell you on the call and we won't waste each other's time — that's what the qualifying questions are for. The guarantee only works because I turn down environments that aren't a fit.",
  },
  {
    q: 'What does it cost?',
    a: 'Cost Quick Look is $350–$500. Full Audit is $1,500–$3,000 (lower end for smaller environments). Optional implementation is priced as a share of what it saves you.',
  },
]

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[#0B7A4B]"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {children}
    </div>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl font-semibold tracking-tight text-[#14171A] sm:text-4xl"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {children}
    </h2>
  )
}

export default function AwsAuditPage() {
  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable} relative min-h-screen bg-[#FAFAF7] text-[#14171A] antialiased`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-[#E6E4DD] bg-[#FAFAF7]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#top"
            className="text-sm font-semibold tracking-tight text-[#14171A]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {BRAND}
          </a>
          <div className="hidden gap-7 text-sm text-[#575D63] sm:flex">
            <a href="#how" className="transition hover:text-[#0B7A4B]">How it works</a>
            <a href="#pricing" className="transition hover:text-[#0B7A4B]">Pricing</a>
            <a href="#faq" className="transition hover:text-[#0B7A4B]">FAQ</a>
          </div>
          <a
            href="#booking"
            className="rounded-full bg-[#14171A] px-4 py-2 text-xs font-medium text-[#FAFAF7] transition hover:bg-[#0B7A4B] motion-reduce:transition-none"
          >
            Book a call
          </a>
        </div>
      </nav>

      {/* Animated emerald→pink gradient frame around the content */}
      <div id="top" className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="animated-frame rounded-[34px] p-[3px] shadow-[0_20px_60px_-30px_rgba(20,23,26,0.35)]">
          <div className="relative overflow-hidden rounded-[31px] bg-[#FAFAF7]">

            {/* Cherry blossom — top-of-page background + petals falling from the top */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[880px] overflow-hidden" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cherryblossom.avif" alt="" className="blossom blossom-left" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cherryblossom.avif" alt="" className="blossom blossom-right" />
              {PETALS.map((p, i) => (
                <span
                  key={i}
                  className="petal"
                  style={{
                    left: p.left,
                    width: p.size,
                    height: p.size,
                    animationDuration: `${p.dur}s`,
                    animationDelay: `${p.delay}s`,
                    ['--x' as string]: p.x,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 px-5 sm:px-10">

              {/* Hero */}
              <section className="grid items-center gap-12 pt-32 pb-14 sm:pt-36 sm:pb-20 md:grid-cols-2 md:gap-10">
                <div>
                  <Eyebrow>Read-only AWS cost audit</Eyebrow>
                  <h1
                    className="text-[2.6rem] font-bold leading-[1.05] tracking-tight text-[#14171A] sm:text-5xl"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    There&apos;s a bill
                    <br />
                    you&apos;re not reading.
                  </h1>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-[#575D63]">
                    Most teams scaling on AWS overspend 20–40% — idle resources,
                    oversized instances, non-prod running around the clock, Savings
                    Plans nobody set up. I find it, in real dollars, and never touch
                    production without your sign-off.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#booking"
                      className="rounded-full bg-[#0B7A4B] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B7A4B] motion-reduce:transition-none"
                    >
                      Book a 15-min call →
                    </a>
                    <a
                      href="/audit-sample.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full px-5 py-3 text-sm font-medium text-[#14171A] underline decoration-[#CBD3CE] underline-offset-4 transition hover:decoration-[#0B7A4B]"
                    >
                      See a sample report
                    </a>
                  </div>
                  <div
                    className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#8A8F8B]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <span>AWS Certified</span>
                    <span aria-hidden>·</span>
                    <span>Cost Explorer</span>
                    <span aria-hidden>·</span>
                    <span>Lambda · IAM</span>
                  </div>
                </div>

                {/* Signature: the itemized statement */}
                <div className="fade-up">
                  <div className="overflow-hidden rounded-2xl border border-[#E6E4DD] bg-white shadow-[0_1px_0_#E6E4DD,0_20px_50px_-30px_rgba(20,23,26,0.35)]">
                    <div
                      className="flex items-center justify-between border-b border-dashed border-[#E6E4DD] bg-[#FBFBF8] px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-[#8A8F8B]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      <span>Monthly statement</span>
                      <span>example</span>
                    </div>
                    <div className="px-5 py-4" style={{ fontFamily: 'var(--font-mono)' }}>
                      <div className="flex items-baseline justify-between py-1.5 text-sm">
                        <span className="text-[#575D63]">Current spend</span>
                        <span className="font-medium tabular-nums text-[#14171A]">{usd(CURRENT)}</span>
                      </div>
                      <div className="my-2 border-t border-[#EFEDE6]" />
                      {CUTS.map((c) => (
                        <div key={c.label} className="flex items-baseline justify-between py-1.5 text-sm">
                          <span className="text-[#B4433A] line-through decoration-[#B4433A]/50">{c.label}</span>
                          <span className="tabular-nums text-[#B4433A]">−{usd(c.amount)}</span>
                        </div>
                      ))}
                      <div className="my-2 border-t border-[#EFEDE6]" />
                      <div className="flex items-baseline justify-between py-1.5 text-sm">
                        <span className="text-[#575D63]">Optimized spend</span>
                        <span className="font-medium tabular-nums text-[#14171A]">{usd(OPTIMIZED)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#0B7A4B] px-5 py-4 text-white">
                      <span
                        className="text-[11px] uppercase tracking-[0.16em] text-[#BDE8D3]"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        You keep
                      </span>
                      <span className="text-xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
                        {usd(SAVED)}/mo
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-center text-xs text-[#9A9C99]">
                    Illustrative figures for a typical unoptimized environment.
                  </p>
                </div>
              </section>

              {/* Why the waste is there — two-column, highlighted key phrase */}
              <section className="border-t border-[#E6E4DD] py-16 sm:py-20">
                <Eyebrow>Why the waste is there</Eyebrow>
                <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] md:items-start md:gap-12">
                  <p
                    className="text-2xl font-medium leading-snug tracking-tight text-[#14171A] sm:text-[1.9rem]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    It isn&apos;t a mistake. Cost optimization is just{' '}
                    <span className="relative inline-block whitespace-nowrap">
                      <span className="relative z-10">nobody&apos;s actual job.</span>
                      <span
                        aria-hidden
                        className="absolute -inset-x-1 bottom-1 z-0 h-3 -rotate-1 rounded-sm bg-[#F7C6D9]/70"
                      />
                    </span>
                  </p>
                  <p className="text-sm leading-relaxed text-[#575D63] md:pt-2">
                    Your engineers are shipping features, not tuning the bill and a
                    full-time FinOps hire costs more than the waste. So it sits there,
                    growing every month. That&apos;s the gap I fill: cheaper than a hire,
                    more focused than a distracted engineer.
                  </p>
                </div>
              </section>

              {/* What you get */}
              <section className="border-t border-[#E6E4DD] py-16 sm:py-20">
                <Eyebrow>The deliverable</Eyebrow>
                <H2>A report built to be acted on.</H2>
                <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[#E6E4DD] bg-[#E6E4DD] sm:grid-cols-2">
                  {[
                    ['Top cost drivers, in plain dollars', 'No raw tool dump — the money, ranked.'],
                    ['Every fix ranked by savings-per-effort', 'You know what to do first, and why.'],
                    ['“Safe to capture now” vs. needs sign-off', 'The risky changes are flagged, never buried.'],
                    ['Quick wins with zero reliability risk', 'Implementable the same week.'],
                  ].map(([t, d]) => (
                    <div key={t} className="bg-white p-6">
                      <div className="mb-2 flex items-start gap-3">
                        <span className="mt-0.5 text-[#0B7A4B]">✓</span>
                        <span className="font-medium text-[#14171A]">{t}</span>
                      </div>
                      <p className="pl-6 text-sm leading-relaxed text-[#575D63]">{d}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* How it works */}
              <section id="how" className="scroll-mt-20 border-t border-[#E6E4DD] py-16 sm:py-20">
                <Eyebrow>How it works</Eyebrow>
                <H2>Five steps, no surprises.</H2>
                <ol className="mt-10 space-y-0">
                  {[
                    ['Book a call — 5 quick questions first', 'When you book you\u2019ll answer 5 short questions about your setup: cloud, monthly spend, what you\u2019ve already optimized. A minute of your time, and I walk in already understanding your situation.'],
                    ['Quick call (15 min)', 'We walk through your top cost drivers and I tell you live what I\u2019d look at. No obligation. If it\u2019ll make the call more concrete, I may ask for a quick Cost Explorer screenshot first.'],
                    ['Read-only access', 'If we move forward, I need read-only billing access only — I can\u2019t change or touch anything. About 5 minutes to set up.'],
                    ['The audit', 'I work through your environment and deliver the prioritized report, usually within 1\u20132 weeks.'],
                    ['Implementation', 'Most clients have me capture the savings — priced as a share of what you save, so it effectively pays for itself. The report is yours to keep either way.'],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex gap-5 border-t border-[#EFEDE6] py-6 first:border-t-0">
                      <span className="shrink-0 text-sm text-[#0B7A4B]" style={{ fontFamily: 'var(--font-mono)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="font-medium text-[#14171A]">{t}</div>
                        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#575D63]">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Guarantee */}
              <section className="border-t border-[#E6E4DD] py-16 sm:py-20">
                <div className="rounded-2xl bg-[#14171A] p-8 text-white sm:p-12">
                  <div
                    className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[#7FD3AC]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    The guarantee
                  </div>
                  <p
                    className="text-2xl leading-snug tracking-tight sm:text-3xl"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    If I can&apos;t identify at least{' '}
                    <span className="text-[#7FD3AC]">3× the audit fee</span> in annual
                    savings, you don&apos;t pay for the audit.
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#B9BCBE]">
                    The math has to work for you before anything else happens. That&apos;s
                    why I only take on environments where I&apos;m confident it will.
                  </p>
                </div>
              </section>

              {/* Pricing */}
              <section id="pricing" className="scroll-mt-20 border-t border-[#E6E4DD] py-16 sm:py-20">
                <Eyebrow>Two ways to start</Eyebrow>
                <H2>Both begin with one call.</H2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#575D63]">
                  I&apos;ll recommend which one fits your setup on the 15-minute call —
                  you&apos;re not picking blind.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#E6E4DD] bg-white p-7">
                    <div className="text-xs uppercase tracking-[0.14em] text-[#8A8F8B]" style={{ fontFamily: 'var(--font-mono)' }}>
                      Cost Quick Look
                    </div>
                    <div className="mt-3 text-3xl font-bold tabular-nums text-[#14171A]" style={{ fontFamily: 'var(--font-mono)' }}>
                      $350–500
                    </div>
                    <div className="mt-1 text-sm text-[#8A8F8B]">3-day turnaround</div>
                    <ul className="mt-5 space-y-2.5 text-sm text-[#575D63]">
                      {['Top 3 findings, fast', 'A written summary, not a formal report', 'Confirms the waste is real before you commit'].map((x) => (
                        <li key={x} className="flex gap-2.5"><span className="text-[#0B7A4B]">✓</span>{x}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border-2 border-[#0B7A4B] bg-white p-7">
                    <div className="text-xs uppercase tracking-[0.14em] text-[#0B7A4B]" style={{ fontFamily: 'var(--font-mono)' }}>
                      Full Audit
                    </div>
                    <div className="mt-3 text-3xl font-bold tabular-nums text-[#14171A]" style={{ fontFamily: 'var(--font-mono)' }}>
                      $1,500–3,000
                    </div>
                    <div className="mt-1 text-sm text-[#8A8F8B]">1–2 week turnaround</div>
                    <ul className="mt-5 space-y-2.5 text-sm text-[#575D63]">
                      {['Full prioritized report', 'Backed by the 3× guarantee', 'Leads into implementation'].map((x) => (
                        <li key={x} className="flex gap-2.5"><span className="text-[#0B7A4B]">✓</span>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-[#F1F0EA] p-7">
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-[#0B7A4B]" style={{ fontFamily: 'var(--font-mono)' }}>
                    Then → Implementation
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#575D63]">
                    The audit finds the money; implementation captures it — priced as a{' '}
                    <strong className="font-semibold text-[#14171A]">share of what you save</strong>,
                    so it effectively pays for itself. Environments drift back over time,
                    so ongoing optimization is available as a retainer.
                  </p>
                </div>

                <p className="mt-5 text-xs text-[#9A9C99]" style={{ fontFamily: 'var(--font-mono)' }}>
                  Fit: AWS environments spending ~$5k/month or more.
                </p>
              </section>

              {/* Who's doing this */}
              <section className="border-t border-[#E6E4DD] py-16 sm:py-20">
                <Eyebrow>Who&apos;s doing this</Eyebrow>
                <p className="max-w-2xl text-lg leading-relaxed text-[#14171A]">
                  AWS Certified, with cloud security experience from a Comcast
                  Cybersecurity co-op — hands-on with AWS, CI/CD, and infrastructure as
                  code. Currently studying for AWS Solutions Architect Associate.
                </p>
                {/* TODO: restore once Brian confirms — swap in his real words + title
                <blockquote className="mt-8 max-w-2xl border-l-2 border-[#0B7A4B] pl-6">
                  <p className="text-lg italic leading-relaxed text-[#14171A]">{RECOMMENDATION_QUOTE}</p>
                  <footer className="mt-3 text-sm text-[#8A8F8B]" style={{ fontFamily: 'var(--font-mono)' }}>
                    — {RECOMMENDATION_ATTRIBUTION}
                  </footer>
                </blockquote>
                */}
                <p className="mt-6 text-sm text-[#9A9C99]">References available on request.</p>
              </section>

              {/* FAQ accordion */}
              <section id="faq" className="scroll-mt-20 border-t border-[#E6E4DD] py-16 sm:py-20">
                <Eyebrow>Questions</Eyebrow>
                <H2>Good to know.</H2>
                <div className="mt-8">
                  {FAQ.map(({ q, a }) => (
                    <details key={q} className="group border-b border-[#E6E4DD] py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                        <span className="font-medium text-[#14171A]">{q}</span>
                        <svg
                          className="h-5 w-5 shrink-0 text-[#0B7A4B] transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          aria-hidden
                        >
                          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </summary>
                      <p className="mt-3 max-w-2xl pr-8 text-sm leading-relaxed text-[#575D63]">{a}</p>
                    </details>
                  ))}
                </div>
              </section>

              {/* Booking */}
              <section id="booking" className="scroll-mt-20 border-t border-[#E6E4DD] py-16 sm:py-20">
                <Eyebrow>See if it&apos;s worth doing</Eyebrow>
                <H2>Book the call.</H2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#575D63]">
                  You&apos;ll answer 5 quick questions as you book. If it&apos;s not a
                  fit, I&apos;ll tell you on the call — no pressure either way.
                </p>

                <div className="mt-8 overflow-hidden rounded-2xl border border-[#E6E4DD] bg-white p-2 shadow-sm">
                  <iframe
                    src="https://cal.com/awsshynice/15min?embed=true&theme=light&layout=month_view"
                    title="Book a 15-min AWS cost audit intro call"
                    className="h-[640px] w-full rounded-xl border-0"
                    loading="lazy"
                  />
                </div>

                <div className="mt-5 space-y-1.5 text-sm text-[#575D63]">
                  <p>
                    Trouble loading the calendar?{' '}
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#0B7A4B] underline underline-offset-4"
                    >
                      Open the booking page →
                    </a>
                  </p>
                  <p>
                    Prefer email? Reach me at{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="font-medium text-[#0B7A4B] underline underline-offset-4"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>
              </section>

              {/* Footer */}
              <footer className="border-t border-[#E6E4DD] py-10 text-center">
                <div className="text-xs text-[#9A9C99]" style={{ fontFamily: 'var(--font-mono)' }}>
                  © {new Date().getFullYear()} Shynice Youmans
                </div>
                <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-[#B4B6B2]">
                  AWS is a trademark of Amazon.com, Inc. This site is not affiliated
                  with, endorsed by, or sponsored by Amazon Web Services.
                </p>
              </footer>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Moving emerald -> pink gradient frame */
        .animated-frame {
          background: linear-gradient(120deg, #0B7A4B, #34d399, #6ee7b7, #f9a8d4, #f472b6, #34d399, #0B7A4B);
          background-size: 300% 300%;
          animation: gradientMove 12s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Cherry blossom photo, fading in from the top corners */
        .blossom {
          position: absolute;
          top: -55px;
          width: 280px;
          max-width: 40%;
          opacity: 0.7;
          mix-blend-mode: multiply;
          -webkit-mask-image: radial-gradient(120% 120% at 0% 0%, #000 22%, transparent 60%);
          mask-image: radial-gradient(120% 120% at 0% 0%, #000 22%, transparent 60%);
        }
        .blossom-left { left: -45px; }
        .blossom-right { right: -45px; transform: scaleX(-1); }
        @media (max-width: 640px) {
          .blossom { width: 190px; opacity: 0.55; top: -35px; }
        }

        /* Falling petals — only within the top band */
        .petal {
          position: absolute;
          top: -24px;
          background: linear-gradient(135deg, #FBD3E3, #F2A9C6);
          border-radius: 150% 0 150% 0;
          opacity: 0;
          animation-name: petalFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        @keyframes petalFall {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          8%   { opacity: 0.55; }
          80%  { opacity: 0.5; }
          100% { transform: translateY(900px) translateX(var(--x, 40px)) rotate(320deg); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none; }
          .animated-frame { animation: none; }
          .petal { display: none; }
        }
      `}</style>
    </main>
  )
}
