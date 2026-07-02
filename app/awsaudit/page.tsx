import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AWS Cost Audit — Cut Your Bill 20-40% Without Touching Reliability',
  description: 'A read-only AWS cost audit that shows exactly where you\'re overspending, in real dollars. No reliability risk. If I can\'t identify at least 3x the audit fee in savings, you don\'t pay.',
  robots: { index: false, follow: false },
}

// ============================================================
// SWAP BEFORE PUBLIC LAUNCH:
//   - RECOMMENDATION_QUOTE + RECOMMENDATION_ATTRIBUTION: replace John Doe
//     placeholder with Brian Jopling's real quote once permission granted
// ============================================================
const BOOKING_URL = 'https://cal.com/awsshynice/15min'
const RECOMMENDATION_QUOTE =
  '"Took ownership quickly and delivered work the team still relies on. Strong technical skills and a professional mindset."'
const RECOMMENDATION_ATTRIBUTION = 'John Doe, Senior Engineer'

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`px-6 py-16 sm:px-10 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-3xl">{children}</div>
    </section>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{children}</h2>
  )
}

export default function AwsAuditPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-[34px] bg-gradient-to-br from-emerald-500 via-emerald-400 to-pink-400 p-[3px] shadow-lg">
          <div className="rounded-[32px] bg-white/95">

            <Section className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-200">
                AWS Cost Audit
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Cut your AWS bill 20–40% — without touching reliability.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-700">
                An AWS-certified engineer audits your environment, shows you exactly where the waste is in real dollars, and (if you want) implements the safe fixes. Read-only. Nothing gets broken.
              </p>
              <div className="mt-8">
                <a
                  href="#booking"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 text-base font-semibold text-white shadow transition hover:brightness-105"
                >
                  See if it&apos;s worth doing →
                </a>
                <p className="mt-3 text-sm text-neutral-500">
                  5 quick questions. If it&apos;s a fit, book a 15-min call.
                </p>
              </div>
            </Section>

            <Section className="border-t border-neutral-200">
              <SectionHeading>The problem</SectionHeading>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-neutral-700">
                <p>
                  Most teams scaling on AWS are quietly overspending 20–40% — idle resources, oversized instances, non-prod environments running 24/7, and Savings Plans nobody ever set up.
                </p>
                <p>
                  It&apos;s not a mistake. It&apos;s just that cost optimization is nobody&apos;s actual job. Your engineers are shipping features, not tuning the bill — and a full-time FinOps hire costs more than the waste. So it sits there, growing every month.
                </p>
              </div>
            </Section>

            <Section className="border-t border-neutral-200">
              <SectionHeading>What the audit gives you</SectionHeading>
              <p className="mt-4 text-neutral-700">
                A clear, prioritized report — not a raw tool dump:
              </p>
              <ul className="mt-4 space-y-3 text-neutral-700">
                <li className="flex gap-3">
                  <span className="mt-1 text-emerald-700">✓</span>
                  <span>Your top cost drivers, in plain dollars</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-emerald-700">✓</span>
                  <span>Every fix ranked by savings-per-effort</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-emerald-700">✓</span>
                  <span>A &quot;safe to capture now&quot; number vs. changes that need your sign-off</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-emerald-700">✓</span>
                  <span>No reliability risk on the quick wins — implementable the same week</span>
                </li>
              </ul>
              <div className="mt-6">
                <a
                  href="/audit-sample.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                >
                  See a sample report →
                </a>
              </div>
            </Section>

            <Section className="border-t border-neutral-200">
              <SectionHeading>How it works</SectionHeading>
              <ol className="mt-6 space-y-6">
                <li className="rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-200">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Quick call (15 min)</div>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                        You show me your top cost drivers; I tell you live what I&apos;d look at. No obligation.
                      </p>
                      <div className="mt-4 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                          Bring one screenshot to the call
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                          If you only bring one thing, make it your <strong>Cost Explorer view grouped by service</strong> (last 30 days). If you can bring two, add your <strong>Savings Plan / Reserved Instance coverage report</strong>. Those two alone let me point at real numbers on the call, not talk in generalities.
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-200">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      2
                    </div>
                    <div>
                      <div className="font-semibold">Read-only access</div>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                        I only need read-only billing access — I can&apos;t change or touch anything. ~5 minutes to set up.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-200">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      3
                    </div>
                    <div>
                      <div className="font-semibold">The audit</div>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                        I work through your environment and deliver the report, usually within 1–2 weeks.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-200">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      4
                    </div>
                    <div>
                      <div className="font-semibold">You decide</div>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                        Implement the quick wins yourself, or I handle the whole thing.
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
            </Section>

            <Section className="border-t border-neutral-200">
              <SectionHeading>I can&apos;t break anything</SectionHeading>
              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                The audit uses read-only access — I can see your bill and usage, and nothing else. No write permissions, no ability to change or delete a single resource. And I never touch anything in production without your explicit written sign-off. The safe, mechanical fixes are separated from the ones that need a conversation, so you&apos;re always in control.
              </p>
            </Section>

            <Section className="border-t border-neutral-200">
              <SectionHeading>Who&apos;s doing this</SectionHeading>
              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                AWS Certified, with cloud security experience from a Comcast Cybersecurity co-op. Studying for AWS Solutions Architect Associate.
              </p>
              <blockquote className="mt-6 rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
                <p className="text-base italic leading-relaxed text-neutral-800">
                  {RECOMMENDATION_QUOTE}
                </p>
                <footer className="mt-3 text-sm font-medium text-neutral-600">
                  — {RECOMMENDATION_ATTRIBUTION}
                </footer>
              </blockquote>
              <p className="mt-4 text-sm text-neutral-500">
                Full references available on request.
              </p>
            </Section>

            <Section className="border-t border-neutral-200">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white p-8 ring-1 ring-emerald-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Guarantee
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  No savings, no fee.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-neutral-700">
                  If I can&apos;t identify at least <strong>3× the audit fee in annual savings</strong>, you don&apos;t pay for the audit. The math has to work for you before anything else happens.
                </p>
              </div>
            </Section>

            <Section className="border-t border-neutral-200">
              <SectionHeading>Two ways to start</SectionHeading>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Cost Quick Look
                  </div>
                  <div className="mt-2 text-2xl font-bold">$250 – $500</div>
                  <div className="mt-1 text-sm text-neutral-600">3-day turnaround</div>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                    <li className="flex gap-2">
                      <span className="text-emerald-700">✓</span>
                      Top 3 findings only
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-700">✓</span>
                      No formal report — a written summary
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-700">✓</span>
                      Best for testing the waters
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white p-6 ring-1 ring-emerald-300">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    Full Audit
                  </div>
                  <div className="mt-2 text-2xl font-bold">$1,500 – $3,000</div>
                  <div className="mt-1 text-sm text-neutral-600">1–2 week turnaround</div>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                    <li className="flex gap-2">
                      <span className="text-emerald-700">✓</span>
                      Full prioritized report
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-700">✓</span>
                      Backed by the 3× guarantee
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-700">✓</span>
                      Optional implementation, priced against savings
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-neutral-500">
                Note: engagements are a fit for AWS environments spending ~$5k/month or more.
              </p>
            </Section>

            <Section className="border-t border-neutral-200">
              <SectionHeading>Short FAQ</SectionHeading>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="font-semibold">Do you need admin access?</div>
                  <p className="mt-1 text-sm text-neutral-700">
                    No. Read-only billing access only. I can&apos;t change anything.
                  </p>
                </div>
                <div>
                  <div className="font-semibold">How long does it take?</div>
                  <p className="mt-1 text-sm text-neutral-700">
                    Cost Quick Look: 3 days. Full Audit: 1–2 weeks from access to report.
                  </p>
                </div>
                <div>
                  <div className="font-semibold">Will this cause downtime?</div>
                  <p className="mt-1 text-sm text-neutral-700">
                    No. The quick wins carry no reliability risk, and nothing in production is touched without your written approval.
                  </p>
                </div>
                <div>
                  <div className="font-semibold">What if we&apos;ve already optimized?</div>
                  <p className="mt-1 text-sm text-neutral-700">
                    Then I&apos;ll tell you that on the call and we won&apos;t waste each other&apos;s time — that&apos;s what the qualifying questions are for.
                  </p>
                </div>
                <div>
                  <div className="font-semibold">What does it cost?</div>
                  <p className="mt-1 text-sm text-neutral-700">
                    A fixed fee for the audit ($1,500–$3,000, floor for smaller environments). Cost Quick Look is $250–$500. Optional implementation is priced against what it saves you.
                  </p>
                </div>
              </div>
            </Section>

            <Section id="booking" className="border-t border-neutral-200">
              <SectionHeading>See if it&apos;s worth doing</SectionHeading>
              <p className="mt-4 text-base leading-relaxed text-neutral-700">
                Answer 5 quick questions so I can tell you whether an audit makes sense for your setup. If it&apos;s a fit, you&apos;ll get my calendar to book a 15-minute call.
              </p>
              <div className="mt-6">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 text-base font-semibold text-white shadow transition hover:brightness-105"
                >
                  Book a 15-min call →
                </a>
                <p className="mt-4 text-sm text-neutral-600">
                  Or reach me directly at{' '}
                  <a href="mailto:aws@shynice.com" className="font-semibold text-emerald-800 underline">
                    aws@shynice.com
                  </a>
                </p>
              </div>
              <p className="mt-6 text-xs text-neutral-500">
                Fit: AWS environments spending roughly $5k/month or more.
              </p>
            </Section>

            <div className="border-t border-neutral-200 px-6 py-8 text-center text-xs text-neutral-500 sm:px-10">
              © {new Date().getFullYear()} Shynice Youmans
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}