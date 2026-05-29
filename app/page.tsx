'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { PostJobLink } from '@/components/post-job-link'

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false)
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
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
                  Get trusted help fast — from verified students.
                </h1>
                <p className="text-base leading-7 text-white opacity-90 max-w-xl">
                  Post a task in minutes. Pay securely. Confirm when it's done.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <PostJobLink 
                    className="h-12 px-8 rounded-xl bg-white text-primary font-medium hover:bg-canvas transition-colors flex items-center justify-center"
                  >
                    Post a job
                  </PostJobLink>
                  <Link 
                    href="/browse" 
                    className="h-12 px-8 rounded-xl border-2 border-white bg-transparent text-white font-medium hover:bg-white hover:text-primary transition-colors flex items-center justify-center"
                  >
                    Find jobs
                  </Link>
                </div>
                <p className="text-sm opacity-90 text-white">
                  Verified users • Secure payments • Ratings
                </p>
              </div>

              {/* Right Column - Job Preview Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 space-y-3 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 cursor-pointer min-h-[120px] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-ink">Lawn mowing</h3>
                      <p className="text-sm text-ink/70 mt-1">Backyard, ~50 sq m</p>
                    </div>
                    <span className="text-base font-semibold text-primary">$45</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Ponsonby, Auckland</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 space-y-3 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 cursor-pointer min-h-[120px] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-ink">Moving boxes</h3>
                      <p className="text-sm text-ink/70 mt-1">2-bedroom flat</p>
                    </div>
                    <span className="text-base font-semibold text-primary">$120</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Newmarket, Auckland</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 space-y-3 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 cursor-pointer min-h-[120px] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-ink">Dog sitting</h3>
                      <p className="text-sm text-ink/70 mt-1">Weekend, 2 dogs</p>
                    </div>
                    <span className="text-base font-semibold text-primary">$80</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Grey Lynn, Auckland</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-white py-12">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Verified users</h3>
                  <p className="text-sm text-ink/70 mt-1">All students are verified</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Secure payments</h3>
                  <p className="text-sm text-ink/70 mt-1">Protected transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Ratings & accountability</h3>
                  <p className="text-sm text-ink/70 mt-1">Built-in reviews</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <h2 className="text-[3.28rem] md:text-[3.94rem] font-bold text-ink text-center mb-12 mt-8">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-white font-semibold text-lg flex items-center justify-center">
                  1
                </div>
                <h3 className="text-xl font-semibold text-ink">Post a job</h3>
                <p className="text-base leading-7 text-ink/80">
                  Describe your task, set a budget, and post it to the Swifto community.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-white font-semibold text-lg flex items-center justify-center">
                  2
                </div>
                <h3 className="text-xl font-semibold text-ink">Choose a student</h3>
                <p className="text-base leading-7 text-ink/80">
                  Review profiles and proposals from verified students in your area.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-ink/15 shadow-sm p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-white font-semibold text-lg flex items-center justify-center">
                  3
                </div>
                <h3 className="text-xl font-semibold text-ink">Confirm completion → payment released</h3>
                <p className="text-base leading-7 text-ink/80">
                  Once you confirm the work is done, payment is automatically released.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Note from the Founder */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="bg-canvas/50 rounded-3xl p-8 md:p-12 border border-ink/15 shadow-lg">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-[3.28rem] md:text-[3.94rem] font-bold text-ink mb-8">
                    Note from the Founder
                  </h2>
                </div>
                <div className="space-y-4 text-base leading-7 text-ink/80">
                  <p>I created Swifto because I know what it feels like to carry money stress everywhere you go. You can be sitting in a lecture, smiling with friends, trying to stay focused, but in the back of your mind it's always there. Rent. Groceries. Power. Petrol. That quiet panic of wondering how you're going to make it through the week.</p>
                  <p>I have been in that place, and it can feel isolating. Like everyone else is moving forward while you are just trying to stay afloat. And the hardest part is that you still have to perform. You still have assignments due. Exams coming. Group work. Expectations. Life does not pause just because you are struggling{!isExpanded && '...'}</p>
                  {isExpanded && (
                    <>
                      <p>People say "just get a job" like it's simple. But when you are studying full-time, a job is not just extra income. It is late shifts when you should be studying. Missing class because you cannot afford not to work. Coming home exhausted and trying to read, write, remember, and keep up. It is the constant trade-off between protecting your future and paying for your present. That pressure does not only drain your bank account. It can drain your mental health, your confidence, your sleep, and your hope.</p>
                      <p>Swifto is my attempt to make that weight lighter. A way for students to earn in a flexible, realistic way, without locking their lives into fixed shifts or spending weeks applying for jobs that never reply. And for the people who use Swifto to get help, it is a chance to receive support in a safe, respectful way, while knowing you might be helping someone's rent, groceries, or breathing room.</p>
                      <p>Swifto was built from lived experience, from a place of understanding, not judgement. My hope is that when students open Swifto, they feel something they do not feel enough. Relief. Like there is an option. Like they are not alone. And like things can get better.</p>
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="text-primary hover:text-secondary font-semibold transition-colors"
                      >
                        ...see less
                      </button>
                    </>
                  )}
                  {!isExpanded && (
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="text-primary hover:text-secondary font-semibold transition-colors"
                    >
                      ...see more
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Swifto */}
        <section className="py-4 md:py-6 bg-primary">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-[3.28rem] md:text-[3.94rem] font-bold text-white mb-8">
                  Why Swifto
                </h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Trust who you hire</h3>
                    <p className="text-base leading-7 text-white/90">
                    Every profile is verified, so you can book with confidence.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Get it sorted fast</h3>
                    <p className="text-base leading-7 text-white/90">
                    Post once, pick the right student, and confirm the job without back and forth.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Know the price upfront
                    </h3>
                    <p className="text-base leading-7 text-white/90">
                    Clear costs before you commit, with no surprises.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Protected payments</h3>
                    <p className="text-base leading-7 text-white/90">
                    Your payment is held securely and released only when the job is confirmed complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Preview */}
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink text-center mb-12">
              Featured jobs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Lawn mowing', time: '2 hours', payout: '$45', location: 'Ponsonby, Auckland' },
                { title: 'Moving boxes', time: '4 hours', payout: '$120', location: 'Newmarket, Auckland' },
                { title: 'Vacuuming', time: '1 hour', payout: '$30', location: 'Grey Lynn, Auckland' },
                { title: 'Dog sitting', time: 'Weekend', payout: '$80', location: 'Parnell, Auckland' },
                { title: 'Car wash', time: '1 hour', payout: '$25', location: 'Mt Eden, Auckland' },
                { title: 'Furniture moving', time: '3 hours', payout: '$95', location: 'Remuera, Auckland' },
              ].map((job, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl border border-ink/15 shadow-sm p-6 space-y-3 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-ink">{job.title}</h3>
                      <p className="text-sm text-ink/70 mt-1">{job.time}</p>
                    </div>
                    <span className="text-base font-semibold text-primary">{job.payout}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{job.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-ink text-white">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8">
              Ready to get something done today?
            </h2>
            <PostJobLink 
              className="inline-block h-12 px-8 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center"
            >
              Post a job
            </PostJobLink>
          </div>
        </section>

        {/* New Hero Section with Four Columns */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-ink">
                  Job Seekers
                </h3>
                <div className="space-y-2">
                  <Link href="/browse" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    Browse Jobs
                  </Link>
                  <Link href="/signup" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    Create an Account
                  </Link>
                  <Link href="/login" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    Sign In
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-ink">
                  Job Listers
                </h3>
                <div className="space-y-2">
                  <Link href="/signup" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    List a Job
                  </Link>
                  <a href="#how-it-works" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    How it Works
                  </a>
                  <Link href="/signup" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    Create Account
                  </Link>
                  <Link href="/login" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    Sign In
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-ink">
                  About Swifto
                </h3>
                <div className="space-y-2">
                  <Link href="/about" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    About Us
                  </Link>
                  <Link href="/mission" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    Our Mission
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-ink">
                  Contact Us
                </h3>
                <div className="space-y-2">
                  <Link href="/contact" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    Contact
                  </Link>
                  <Link href="/terms" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    Terms and Conditions
                  </Link>
                  <Link href="/privacy" className="block text-sm text-ink/80 hover:text-accent transition-colors">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-canvas py-12">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <Link href="/safety" className="text-sm text-ink hover:text-accent transition-colors">
                  Safety
                </Link>
                <Link href="/contact" className="text-sm text-ink hover:text-accent transition-colors">
                  Contact
                </Link>
              </div>
              <p className="text-sm text-ink/70">© Swifto</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}

