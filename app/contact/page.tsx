'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'

export default function ContactPage() {
  return (
    <>
      <SiteNav />
      <main className="bg-canvas">
        <PageHero title="Contact us" centered />

        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
            {/* Intro */}
            <div className="mb-12">
              <p className="text-lg leading-7 text-ink/80 mb-4">
                Got a question, feedback, or need a hand? We would love to hear from you.
              </p>
              <p className="text-base leading-7 text-ink/80">
                Swifto is still being built, so the fastest way to reach us is by email. Every message helps us improve what we are creating.
              </p>
            </div>

            {/* Contact Options */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* General Questions Card */}
              <div className="bg-canvas/50 rounded-2xl p-8 border border-ink/15">
                <h2 className="text-xl md:text-2xl font-semibold text-ink mb-4">General questions and feedback</h2>
                <div className="space-y-2 text-base leading-7 text-ink/80">
                  <p>
                    <span className="font-medium">Email:</span> <a href="mailto:hello@swifto.co.nz" className="text-primary hover:text-accent transition-colors">hello@swifto.co.nz</a>
                  </p>
                  <p>
                    <span className="font-medium">Suggested subject line:</span> Swifto enquiry
                  </p>
                </div>
              </div>

              {/* Safety and Reporting Card */}
              <div className="bg-canvas/50 rounded-2xl p-8 border border-ink/15">
                <h2 className="text-xl md:text-2xl font-semibold text-ink mb-4">Safety and reporting</h2>
                <div className="space-y-2 text-base leading-7 text-ink/80">
                  <p className="mb-3">
                    If something feels unsafe, inappropriate, or you need to report an issue, please contact us directly.
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> <a href="mailto:safety@swifto.co.nz" className="text-primary hover:text-accent transition-colors">safety@swifto.co.nz</a>
                  </p>
                  <p>
                    <span className="font-medium">Suggested subject line:</span> Safety report
                  </p>
                </div>
              </div>
            </div>

            {/* Send a Message Buttons */}
            <div className="mb-12 flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:hello@swifto.co.nz?subject=Swifto%20enquiry&body=Name:%0A%0AI%20am%20a:%20(Student%20or%20Job%20poster)%0A%0AWhat%20I%20need%20help%20with:%0A%0ADetails:%0A%0ADevice%20or%20browser%20(optional):%0A%0A"
                className="h-12 px-8 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center text-center"
              >
                Email us
              </a>
              <a 
                href="mailto:safety@swifto.co.nz?subject=Safety%20report&body=Name:%0A%0AWhat%20happened:%0A%0AWhen%20it%20happened:%0A%0AWhere%20it%20happened%20(optional):%0A%0AAny%20screenshots%20or%20details%20you%20can%20share:%0A%0A"
                className="h-12 px-8 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors flex items-center justify-center text-center"
              >
                Report a safety issue
              </a>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-12"></div>

            {/* Expectations */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-ink mb-4">Response times</h2>
              <div className="space-y-3 text-base leading-7 text-ink/80">
                <p>We will do our best to get back to you as soon as we can. Thanks for your patience while we build.</p>
                <p className="font-medium text-ink">If someone is in immediate danger, contact local emergency services.</p>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="mb-12 p-6 bg-canvas/30 rounded-xl border border-ink/15">
              <h2 className="text-lg font-semibold text-ink mb-2">Privacy</h2>
              <p className="text-sm leading-6 text-ink/80">
                We only use your message to respond to your enquiry. We do not sell your information.
              </p>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-12"></div>

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
