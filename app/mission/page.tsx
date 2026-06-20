'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { HeroBand } from '@/components/hero-band'
import { DesignBadge } from '@/components/design/design-badge'
import { IconDisc } from '@/components/design/icon-disc'
import { PostJobLink } from '@/components/post-job-link'

const BELIEFS = [
  'People should be able to ask for help without feeling awkward or unsafe.',
  'Students deserve a way to earn that doesn\'t punish them for being busy.',
  'Small jobs can create real stability and breathing room.',
  'Trust and dignity matter for everyone involved.',
]

export default function MissionPage() {
  return (
    <>
      <SiteNav />
      <main className="bg-canvas">
        <HeroBand>
          <div className="swifto-content text-center py-4 md:py-8">
            <DesignBadge tone="white" className="mb-4">Our mission</DesignBadge>
            <h1 className="text-white text-[clamp(2.125rem,5vw,3.5rem)] leading-[1.05]">
              Make the week feel
              <br />
              a little lighter.
            </h1>
            <p className="text-white/88 text-lg md:text-[19px] max-w-xl mx-auto mt-5 leading-relaxed">
              To reduce financial stress for students by making it simple and safe to earn through flexible local jobs — while giving everyday people a trusted way to get support when they need it.
            </p>
          </div>
        </HeroBand>

        <section className="swifto-content py-14 md:py-16 max-w-3xl">
          <h2 className="text-[30px] mb-2.5">Why we exist</h2>
          <p className="text-[17px] text-ink-2 leading-relaxed">
            Being a student can feel like carrying two lives at once — study on one side, bills on the other. Swifto exists so students have a way to earn that fits around life, not the other way around. And for the people who need a hand, it makes asking for help feel safe, respectful, and simple.
          </p>

          <div className="grid md:grid-cols-2 gap-4 md:gap-[18px] mt-10">
            <div className="swifto-card p-6 bg-brand-soft border-brand-soft">
              <IconDisc tone="brand">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </IconDisc>
              <h3 className="text-[22px] mt-4">For students</h3>
              <p className="text-[15px] text-ink-2 mt-2 leading-relaxed">
                Earn quickly, flexibly and safely — so you can focus on your future with a bit more breathing room.
              </p>
            </div>
            <div className="swifto-card p-6 bg-primary-soft border-primary/20">
              <IconDisc tone="accent">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </IconDisc>
              <h3 className="text-[22px] mt-4">For job posters</h3>
              <p className="text-[15px] text-ink-2 mt-2 leading-relaxed">
                Find trusted help for everyday tasks, while knowing you&apos;re supporting students in your community.
              </p>
            </div>
          </div>

          <h2 className="text-[30px] mt-14 mb-4">What we believe</h2>
          <div className="flex flex-col gap-3">
            {BELIEFS.map((b) => (
              <div key={b} className="flex gap-3 items-start">
                <span className="text-success shrink-0 mt-0.5">
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <p className="text-[16.5px] text-ink-2 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>

          <div className="swifto-card bg-ink text-center p-10 md:p-11 mt-12">
            <h2 className="text-white text-[30px]">Ready to lighten the load?</h2>
            <div className="flex flex-wrap gap-3 justify-center mt-5">
              <PostJobLink className="swifto-btn-primary h-[58px] px-8">Join Swifto</PostJobLink>
              <Link href="/browse" className="swifto-btn-outline-white h-[58px] px-8">Find work</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
