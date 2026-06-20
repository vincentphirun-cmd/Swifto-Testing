'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'

export default function SafetyPage() {
  return (
    <>
      <SiteNav />
      <main className="bg-canvas">
        <PageHero
          title="Safety"
          subtitle="Your safety matters. Here's how to stay safe on Swifto and what to do if something goes wrong."
          centered
        />

        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
            {/* On this page navigation */}
            <div className="mb-12 pb-8 border-b border-ink/10">
              <h2 className="text-sm font-semibold text-ink mb-4">On this page</h2>
              <nav className="flex flex-wrap gap-4 md:gap-6">
                <a href="#for-everyone" className="text-sm text-ink/80 hover:text-accent transition-colors">For everyone</a>
                <a href="#for-students" className="text-sm text-ink/80 hover:text-accent transition-colors">For students</a>
                <a href="#for-listers" className="text-sm text-ink/80 hover:text-accent transition-colors">For listers</a>
                <a href="#how-swifto-helps" className="text-sm text-ink/80 hover:text-accent transition-colors">How Swifto helps</a>
                <a href="#report-an-issue" className="text-sm text-ink/80 hover:text-accent transition-colors">Report an issue</a>
              </nav>
            </div>

            {/* For Everyone */}
            <div id="for-everyone" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">For everyone</h2>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <p>Whether you&apos;re posting a job or doing the work, these tips help keep everyone safe.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-ink">Meet in a public or safe place</strong> when possible. For tasks at a private address, let someone know where you&apos;re going and when you expect to be back.</li>
                  <li><strong className="text-ink">Communicate through Swifto</strong> so there&apos;s a record. Avoid moving conversations off the platform before you&apos;ve met.</li>
                  <li><strong className="text-ink">Trust your instincts.</strong> If something feels off, it&apos;s okay to cancel or walk away.</li>
                  <li><strong className="text-ink">Verify the person</strong> before starting. A quick introduction at the meet-up helps confirm you&apos;re meeting the right person.</li>
                </ul>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* For Students */}
            <div id="for-students" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">For students</h2>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <p>When you&apos;re going to do a job, a few extra steps can make a big difference.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Check the job details and location before you accept. If the address or task seems unclear, ask questions first.</li>
                  <li>Tell a friend or flatmate where you&apos;re going and when you&apos;ll be back.</li>
                  <li>Don&apos;t share personal details like your full address or bank account outside the app. Swifto handles payments securely.</li>
                  <li>If the job changes or you feel uncomfortable, you can stop and report it. Your safety comes first.</li>
                </ul>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* For Listers */}
            <div id="for-listers" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">For listers</h2>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <p>When you&apos;re bringing someone to your home or property, these practices help keep things safe.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be clear about the job in your posting. Include the task, location, and what you expect.</li>
                  <li>Be present or have someone trustworthy around when the student arrives, especially for first-time jobs.</li>
                  <li>Pay through Swifto. Keeping payments on the platform protects both you and the student.</li>
                  <li>If something goes wrong or you have concerns, report it. We take all reports seriously.</li>
                </ul>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* How Swifto Helps */}
            <div id="how-swifto-helps" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">How Swifto helps</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-canvas/50 rounded-2xl p-6 border border-ink/15">
                  <h3 className="text-lg font-semibold text-ink mb-2">Verified accounts</h3>
                  <p className="text-base leading-7 text-ink/80">Users sign up with email, so there&apos;s a traceable account for every job and application.</p>
                </div>
                <div className="bg-canvas/50 rounded-2xl p-6 border border-ink/15">
                  <h3 className="text-lg font-semibold text-ink mb-2">Secure payments</h3>
                  <p className="text-base leading-7 text-ink/80">Payments are held securely and released when both parties confirm the job is done.</p>
                </div>
                <div className="bg-canvas/50 rounded-2xl p-6 border border-ink/15">
                  <h3 className="text-lg font-semibold text-ink mb-2">Ratings & completions</h3>
                  <p className="text-base leading-7 text-ink/80">Completed jobs and feedback help build trust in the community.</p>
                </div>
                <div className="bg-canvas/50 rounded-2xl p-6 border border-ink/15">
                  <h3 className="text-lg font-semibold text-ink mb-2">Reporting</h3>
                  <p className="text-base leading-7 text-ink/80">You can report unsafe behaviour or issues at any time. We review all reports.</p>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* Report an Issue */}
            <div id="report-an-issue" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">Report an issue</h2>
              <div className="space-y-6">
                <p className="text-base leading-7 text-ink/80">
                  If something feels unsafe, inappropriate, or wrong, please tell us. We take every report seriously and will follow up as soon as we can.
                </p>
                <div className="bg-canvas/50 rounded-2xl p-8 border border-ink/15">
                  <h3 className="text-xl font-semibold text-ink mb-4">Contact our safety team</h3>
                  <div className="space-y-2 text-base leading-7 text-ink/80 mb-6">
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      <a href="mailto:safety@swifto.co.nz" className="text-primary hover:text-accent transition-colors">safety@swifto.co.nz</a>
                    </p>
                    <p>
                      <span className="font-medium">Suggested subject line:</span> Safety report
                    </p>
                  </div>
                  <a
                    href="mailto:safety@swifto.co.nz?subject=Safety%20report&body=Name:%0A%0AWhat%20happened:%0A%0AWhen%20it%20happened:%0A%0AWhere%20it%20happened%20(optional):%0A%0AAny%20screenshots%20or%20details%20you%20can%20share:%0A%0A"
                    className="inline-block h-12 px-8 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center"
                  >
                    Report a safety issue
                  </a>
                </div>
                <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-base leading-7 text-ink font-medium">
                    If someone is in immediate danger, contact local emergency services (e.g. 111 in New Zealand) right away.
                  </p>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* CTA */}
            <div className="mb-16">
              <div className="bg-canvas/30 rounded-2xl p-8 md:p-12 text-center space-y-6">
                <p className="text-lg text-ink/80">
                  Have a general question? We&apos;re here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/contact"
                    className="h-12 px-8 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center"
                  >
                    Contact us
                  </Link>
                  <Link
                    href="/signup"
                    className="text-base text-primary hover:text-accent font-medium transition-colors"
                  >
                    Join Swifto
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
