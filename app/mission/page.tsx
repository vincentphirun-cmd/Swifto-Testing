'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'

export default function MissionPage() {
  return (
    <>
      <SiteNav />
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                  Our Mission
                </h1>
              </div>

              {/* Right Column - Space for content */}
              <div className="space-y-4">
                {/* Space for content objects */}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
            {/* On this page navigation */}
            <div className="mb-12 pb-8 border-b border-ink/10">
              <h2 className="text-sm font-semibold text-ink mb-4">On this page</h2>
              <nav className="flex flex-wrap gap-4 md:gap-6">
                <a href="#hero" className="text-sm text-ink/80 hover:text-accent transition-colors">Hero</a>
                <a href="#mission" className="text-sm text-ink/80 hover:text-accent transition-colors">Mission</a>
                <a href="#why" className="text-sm text-ink/80 hover:text-accent transition-colors">Why we exist</a>
                <a href="#beliefs" className="text-sm text-ink/80 hover:text-accent transition-colors">What we believe</a>
                <a href="#for-students" className="text-sm text-ink/80 hover:text-accent transition-colors">For students</a>
                <a href="#for-job-posters" className="text-sm text-ink/80 hover:text-accent transition-colors">For job posters</a>
                <a href="#trust" className="text-sm text-ink/80 hover:text-accent transition-colors">How we build trust</a>
                <a href="#closing" className="text-sm text-ink/80 hover:text-accent transition-colors">Closing</a>
              </nav>
            </div>

            {/* Hero Intro */}
            <div id="hero" className="mb-16 scroll-mt-8">
              <p className="text-xl md:text-2xl leading-8 text-ink/80">
                Swifto is built for real life, when money feels tight, time feels short, and asking for help can feel harder than it should.
              </p>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* Mission Statement */}
            <div id="mission" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">Mission</h2>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <p className="text-lg font-medium">
                  Our mission is to reduce financial stress for students by making it simple and safe to earn through flexible local jobs, while giving everyday people a trusted way to get support when they need it.
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* Why We Exist */}
            <div id="why" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">Why we exist</h2>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <p>Being a student can feel like carrying two lives at once. Study on one side, bills on the other. Rent, food, transport, textbooks, and the pressure to keep up. Swifto exists so students have a way to earn that fits around life, not the other way around.</p>
                <p>And for job posters, Swifto exists to make it easier to ask for help. Carrying groceries. Mowing the lawn. Hanging laundry. Moving a few boxes. Tidying up. Sometimes it's convenience. Sometimes it's age, injury, disability, or simply not having the energy after a long week. Whatever the reason, people deserve support that feels safe, respectful, and simple.</p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* What We Believe */}
            <div id="beliefs" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">What we believe</h2>
              <ul className="space-y-3 text-base leading-7 text-ink/80 list-disc list-inside ml-4">
                <li>People should be able to ask for help without feeling awkward or unsafe.</li>
                <li>Students deserve a way to earn that doesn't punish them for being busy.</li>
                <li>Small jobs can create real stability and breathing room.</li>
                <li>Trust and dignity matter for everyone involved.</li>
                <li>Community works best when it's easy to support each other.</li>
              </ul>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* Who We're Here For */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-8">Who we're here for</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Students Card */}
                <div id="for-students" className="bg-canvas/50 rounded-2xl p-8 border border-ink/15 scroll-mt-8">
                  <h3 className="text-xl md:text-2xl font-semibold text-ink mb-4">Students</h3>
                  <p className="text-base leading-7 text-ink/80">
                    We're here for students who are trying their best and still feeling the pressure. Swifto gives you a way to earn quickly, flexibly, and safely, so you can focus on your future with a bit more breathing room.
                  </p>
                </div>

                {/* Job Posters Card */}
                <div id="for-job-posters" className="bg-canvas/50 rounded-2xl p-8 border border-ink/15 scroll-mt-8">
                  <h3 className="text-xl md:text-2xl font-semibold text-ink mb-4">Job posters</h3>
                  <p className="text-base leading-7 text-ink/80">
                    We're here for people who need a hand, and for people who simply prefer not to do everything alone. Swifto makes it easy to find trusted help for everyday tasks, while knowing you're also supporting students in your local community.
                  </p>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* How We Build Trust */}
            <div id="trust" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">How we build trust</h2>
              <p className="text-base leading-7 text-ink/80 mb-6">
                Swifto is built around safety and peace of mind.
              </p>
              <ul className="space-y-3 text-base leading-7 text-ink/80 list-disc list-inside ml-4">
                <li>Verified profiles so you know who you're dealing with.</li>
                <li>Privacy-first by default, because boundaries matter.</li>
                <li>Protected payments handled through the platform and released only when the job is confirmed complete.</li>
              </ul>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* Closing Section */}
            <div id="closing" className="mb-16 scroll-mt-8">
              <p className="text-xl leading-8 text-ink/80 mb-8">
                Swifto is not just about getting jobs done. It's about making life feel a little lighter. For students trying to stay afloat, and for people who need support, Swifto is a simple way to help each other.
              </p>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* CTA Section */}
            <div className="mb-16">
              <div className="bg-canvas/30 rounded-2xl p-8 md:p-12 text-center space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    href="/signup" 
                    className="h-12 px-8 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center"
                  >
                    Join Swifto
                  </Link>
                  <Link 
                    href="/signup" 
                    className="text-base text-primary hover:text-accent font-medium transition-colors"
                  >
                    Post a job
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
