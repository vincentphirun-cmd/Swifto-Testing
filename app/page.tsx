'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { PostJobLink } from '@/components/post-job-link'
import { HeroBand } from '@/components/hero-band'
import { DesignPhoto } from '@/components/design/design-photo'
import { DesignBadge } from '@/components/design/design-badge'
import { IconDisc } from '@/components/design/icon-disc'
import { StarRating } from '@/components/design/star-rating'
import { DESIGN_PHOTOS, LANDING_FEATURED_JOBS } from '@/lib/design-photos'

const TRUST = [
  {
    title: 'Verified students',
    body: 'Every student is ID-checked before they can apply.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Money held safely',
    body: 'We hold payment and release it only when you confirm.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'Real accountability',
    body: 'Honest ratings and reviews on both sides, every time.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
]

const STEPS = [
  { n: '01', title: 'Post your task', body: 'Tell us what you need and what it pays. Takes about a minute.' },
  { n: '02', title: 'Pick a student', body: 'Browse verified students nearby and choose who feels right.' },
  { n: '03', title: 'Confirm & pay', body: 'Approve the finished work and payment releases automatically.' },
]

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="bg-canvas">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="swifto-content grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center py-16 md:py-[72px] md:pb-[84px]">
            <div>
              <DesignBadge tone="accent" className="mb-5 md:mb-[22px]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Made for students in Aotearoa
              </DesignBadge>
              <h1 className="text-[clamp(2.5rem,5.4vw,4.125rem)] leading-[1.02]">
                A little help today,
                <br />
                a lot less stress
                <br />
                <span className="text-primary">this week.</span>
              </h1>
              <p className="text-lg md:text-[19px] text-ink-2 max-w-[460px] mt-5 md:mt-[22px] leading-relaxed">
                Swifto connects everyday tasks with verified local students. Post a job in minutes, pay securely, and confirm when it&apos;s done.
              </p>
              <div className="flex flex-wrap gap-3 mt-7 md:mt-[30px]">
                <PostJobLink className="swifto-btn-primary h-[58px] px-8 text-[17px]">
                  Post a job
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </PostJobLink>
                <Link href="/browse" className="swifto-btn-outline-brand h-[58px] px-8 text-[17px]">
                  Find work
                </Link>
              </div>
              <div className="flex items-center gap-3.5 mt-8 md:mt-[34px]">
                <div className="flex">
                  {[DESIGN_PHOTOS.avatar1, DESIGN_PHOTOS.avatar2, DESIGN_PHOTOS.avatar3, DESIGN_PHOTOS.avatar4].map((src, i) => (
                    <span
                      key={src}
                      className="w-10 h-10 rounded-full overflow-hidden border-[2.5px] border-canvas bg-brand-soft -ml-3 first:ml-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </span>
                  ))}
                </div>
                <div>
                  <StarRating size={15} />
                  <p className="text-[13.5px] text-ink-2 mt-0.5">
                    <strong className="text-ink font-semibold">2,400+ jobs</strong> done across Auckland
                  </p>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <DesignPhoto src={DESIGN_PHOTOS.hero} height={460} className="shadow-pop" priority tint />
              <div className="swifto-card absolute -left-6 bottom-10 w-[246px] p-4 shadow-pop">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-[15px] text-ink">Lawn mowing</p>
                    <p className="text-xs text-ink-3 mt-0.5">Ponsonby · 2 hrs</p>
                  </div>
                  <span className="font-display font-extrabold text-primary text-xl">$45</span>
                </div>
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-line-card">
                  <span className="w-[26px] h-[26px] rounded-full overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={DESIGN_PHOTOS.avatar2} alt="" className="w-full h-full object-cover" />
                  </span>
                  <span className="text-xs text-ink-2">
                    Mia applied · <strong className="text-success font-semibold">verified</strong>
                  </span>
                </div>
              </div>
              <div className="swifto-card absolute -right-4 top-8 flex items-center gap-3 p-3.5 shadow-pop">
                <IconDisc tone="success" size={40}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </IconDisc>
                <div>
                  <p className="text-[11.5px] text-ink-3 font-semibold">Paid out this week</p>
                  <p className="font-display font-extrabold text-lg text-ink">$184.50</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="swifto-content pb-6">
          <div className="grid md:grid-cols-3 gap-4 md:gap-[18px]">
            {TRUST.map((t) => (
              <div key={t.title} className="swifto-card swifto-card-hover p-6 flex gap-4 items-start">
                <IconDisc tone="brand">{t.icon}</IconDisc>
                <div>
                  <h3 className="text-[17px] font-bold">{t.title}</h3>
                  <p className="text-sm text-ink-2 mt-1 leading-relaxed">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="swifto-content py-16 md:py-[72px]">
          <div className="text-center mb-10 md:mb-11">
            <DesignBadge tone="brand" className="mb-3.5">How it works</DesignBadge>
            <h2 className="text-[clamp(1.875rem,4vw,2.75rem)]">Sorted in three simple steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <div key={s.n} className="swifto-card p-7 relative overflow-hidden">
                <span className="absolute top-4 right-5 font-display text-[52px] font-extrabold text-brand/[0.09] leading-none">{s.n}</span>
                <IconDisc tone={i === 2 ? 'success' : 'accent'} size={56}>
                  <span className="text-primary font-bold text-lg">{s.n.slice(1)}</span>
                </IconDisc>
                <h3 className="text-xl font-bold mt-[18px]">{s.title}</h3>
                <p className="text-[15px] text-ink-2 mt-2 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission band */}
        <HeroBand className="!py-16 md:!py-[72px]">
          <div className="swifto-content grid md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-14 items-center">
            <DesignPhoto src={DESIGN_PHOTOS.community} height={380} className="shadow-pop hidden md:block" tint />
            <div>
              <DesignBadge tone="white" className="mb-4 md:mb-[18px]">Why we built Swifto</DesignBadge>
              <h2 className="text-white text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1.1]">
                We know what carrying money stress feels like.
              </h2>
              <p className="text-white/88 text-[17px] mt-[18px] leading-relaxed max-w-lg">
                Swifto was built from lived experience — so students can earn in a way that fits around study, and people who need a hand can find trusted, friendly help nearby. A way to make the week feel a little lighter.
              </p>
              <Link href="/mission" className="swifto-btn-white h-[58px] px-7 mt-6 md:mt-[26px] inline-flex">
                Read our mission
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </HeroBand>

        {/* Featured jobs */}
        <section className="swifto-content py-16 md:py-[72px]">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-7">
            <div>
              <DesignBadge tone="accent" className="mb-3">Open now</DesignBadge>
              <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)]">Jobs near you today</h2>
            </div>
            <Link href="/browse" className="swifto-btn-ghost h-11 px-4 text-sm">
              See all jobs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-[18px]">
            {LANDING_FEATURED_JOBS.map((job) => (
              <Link key={job.name} href="/browse" className="swifto-card swifto-card-hover overflow-hidden block">
                <DesignPhoto src={job.photo} height={150} radius="rounded-none" tint={false} />
                <div className="p-[18px]">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-[17px] font-bold">{job.name}</h3>
                    <span className="font-display font-extrabold text-primary text-[19px]">${job.pay}</span>
                  </div>
                  <p className="text-[13.5px] text-ink-3 mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {job.area} · {job.dur}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="swifto-content pb-16 md:pb-[84px]">
          <div className="swifto-card bg-ink overflow-hidden relative p-0">
            <div className="relative z-10 text-center px-8 md:px-12 py-12 md:py-14">
              <h2 className="text-white text-[clamp(1.75rem,3.6vw,2.625rem)]">Get something off your plate today.</h2>
              <p className="text-white text-[17px] mt-3.5 max-w-md mx-auto">
                Join thousands of locals and students already helping each other out.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-7 md:mt-[30px]">
                <PostJobLink className="swifto-btn-primary h-[58px] px-8">Post a job</PostJobLink>
                <Link href="/browse" className="swifto-btn-outline-white h-[58px] px-8">Find work</Link>
              </div>
            </div>
            <span className="absolute w-80 h-80 rounded-full bg-primary/40 blur-[40px] -right-20 -top-28 pointer-events-none" aria-hidden />
            <span className="absolute w-72 h-72 rounded-full bg-brand/55 blur-[50px] -left-24 -bottom-32 pointer-events-none" aria-hidden />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-line">
          <div className="swifto-content py-9 flex flex-wrap justify-between items-center gap-4">
            <SwiftoWordmarkInline />
            <div className="flex flex-wrap gap-5 text-sm text-ink-2">
              <Link href="/safety" className="hover:text-brand">Safety</Link>
              <Link href="/mission" className="hover:text-brand">Mission</Link>
              <Link href="/contact" className="hover:text-brand">Contact</Link>
              <Link href="/terms" className="hover:text-brand">Terms</Link>
              <Link href="/privacy" className="hover:text-brand">Privacy</Link>
              <Link href="/payment-terms" className="hover:text-brand">Payment Terms</Link>
            </div>
            <p className="text-[13.5px] text-ink-3">© Swifto · Auckland, NZ</p>
          </div>
        </footer>
      </main>
    </>
  )
}

function SwiftoWordmarkInline() {
  return (
    <span className="inline-flex items-baseline">
      <span className="font-display text-[22px] font-extrabold tracking-tight text-ink">Swifto</span>
      <span className="w-[7px] h-[7px] rounded-full bg-primary ml-0.5 mb-0.5" aria-hidden />
    </span>
  )
}
