'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="bg-canvas">
        <PageHero title="About us" />

        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
            {/* On this page navigation */}
            <div className="mb-12 pb-8 border-b border-ink/10">
              <h2 className="text-sm font-semibold text-ink mb-4">On this page</h2>
              <nav className="flex flex-wrap gap-4 md:gap-6">
                <a href="#about-swifto" className="text-sm text-ink/80 hover:text-accent transition-colors">About Swifto</a>
                <a href="#our-mission" className="text-sm text-ink/80 hover:text-accent transition-colors">Our mission</a>
                <a href="#why-swifto-exists" className="text-sm text-ink/80 hover:text-accent transition-colors">Why Swifto exists</a>
                <a href="#what-makes-swifto-different" className="text-sm text-ink/80 hover:text-accent transition-colors">What makes Swifto different</a>
                <a href="#who-swifto-is-for" className="text-sm text-ink/80 hover:text-accent transition-colors">Who Swifto is for</a>
                <a href="#how-it-works" className="text-sm text-ink/80 hover:text-accent transition-colors">How it works</a>
                <a href="#the-bigger-picture" className="text-sm text-ink/80 hover:text-accent transition-colors">The bigger picture</a>
              </nav>
            </div>

            {/* About Swifto */}
            <div id="about-swifto" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">About Swifto</h2>
              <h3 className="text-xl md:text-2xl font-semibold text-ink mb-4">We built Swifto for the moments money gets tight</h3>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <p>Being a student is already a full-time job. Then rent goes up. Groceries jump. Textbooks hit. Something breaks. And suddenly you're doing mental maths just to make it to next week.</p>
                <p>Swifto exists for that exact feeling.</p>
                <p>Swifto helps university students earn extra money through quick, flexible jobs in their local area, without the long hiring process, awkward meetups, or unreliable messages. Just real work, real people, and a system designed to feel safe.</p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* Our Mission */}
            <div id="our-mission" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">Our mission</h2>
              <h3 className="text-xl md:text-2xl font-semibold text-ink mb-4">Reduce financial stress, without adding more stress</h3>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <p>Our mission is simple: help students earn in a way that protects their time, their privacy, and their safety.</p>
                <p>We want students to feel like they can breathe again. Like there's an option when things get expensive. Like they don't have to choose between study and survival.</p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* Why Swifto exists */}
            <div id="why-swifto-exists" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">Why Swifto exists</h2>
              <h3 className="text-xl md:text-2xl font-semibold text-ink mb-4">Because "just get a part-time job" isn't always realistic</h3>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <p>Not everyone can commit to fixed shifts. Not everyone has a car. Not everyone has a network. And not everyone has the energy to apply for ten jobs just to hear nothing back.</p>
                <p>Swifto is built for real life.<br />A platform where students can pick up quick jobs that fit around class, exams, and everything else going on.</p>
                <p>And for customers, Swifto is built for convenience you can actually trust. When you need something done, you don't want to gamble on random DMs, strangers, or no-shows. You want it handled properly.</p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* What makes Swifto different */}
            <div id="what-makes-swifto-different" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">What makes Swifto different</h2>
              <h3 className="text-xl md:text-2xl font-semibold text-ink mb-4">Trust, clarity, and peace of mind</h3>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <p>Swifto is designed to feel safer than the alternatives.</p>
                <div className="space-y-4 mt-6">
                  <div>
                    <h4 className="font-semibold text-ink mb-2">Verified community</h4>
                    <p>Students are verified through their university email, so you're not guessing who you're dealing with.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink mb-2">Protected payments</h4>
                    <p>Payments are handled through the platform and held securely until the work is confirmed complete. That means fewer awkward conversations, less risk, and a smoother experience for everyone.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink mb-2">Private by default</h4>
                    <p>We keep job and user information private because safety starts with boundaries.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink mb-2">Simple, quick work</h4>
                    <p>These are the kinds of tasks that help in real life. Lawn mowing. Vacuuming. Moving boxes. Small jobs that make a big difference.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* Who Swifto is for */}
            <div id="who-swifto-is-for" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">Who Swifto is for</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-ink mb-4">For Students</h3>
                  <div className="space-y-3 text-base leading-7 text-ink/80">
                    <p>Swifto is for students who want to earn money without sacrificing their future.<br />It's for the ones balancing study with bills, pressure, and deadlines.<br />It's for anyone who wants to feel more independent and less stuck.</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-ink mb-4">For Customers</h3>
                  <div className="space-y-4 text-base leading-7 text-ink/80">
                    <p>Swifto is for people who want help and want to feel good about who they're bringing into their world.<br />It's for anyone who would rather have someone lend a hand with the everyday things, carrying groceries, mowing the lawn, hanging laundry, moving boxes, or tidying up.</p>
                    <p>Sometimes that's convenience. Sometimes it's time. Sometimes it's a bad back, an injury, a disability, or simply not having the energy after a long week. Whatever the reason, Swifto makes it easier to ask for help without feeling awkward or unsafe.</p>
                    <p>And it's also for people who genuinely don't mind helping students in their community. Because a small job to you can be groceries, rent, or breathing room for someone else.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* How it works */}
            <div id="how-it-works" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">How it works</h2>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Post a job in minutes</li>
                  <li>Match with a verified student</li>
                  <li>Payment is handled securely through Swifto</li>
                  <li>Once the job is confirmed complete, the student gets paid</li>
                </ol>
                <p className="mt-6">No chasing. No awkwardness. No uncertainty.</p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* The bigger picture */}
            <div id="the-bigger-picture" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6">The bigger picture</h2>
              <h3 className="text-xl md:text-2xl font-semibold text-ink mb-4">Small jobs can change someone's week</h3>
              <div className="space-y-4 text-base leading-7 text-ink/80">
                <p>One job might be groceries.<br />One job might be rent.<br />One job might be the difference between stress and stability.</p>
                <p>Swifto is built on a simple idea: if we make earning safer and easier, students get more freedom to focus on what actually matters.</p>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* Note from the Founder */}
            <div className="mb-16">
              <div className="bg-canvas/50 rounded-2xl p-8 md:p-10 border border-ink/15">
                <h2 className="text-2xl md:text-3xl font-semibold text-ink mb-6">Note from the Founder</h2>
                <div className="space-y-4 text-base leading-7 text-ink/80">
                  <p>I created Swifto because I know what it feels like to carry money stress everywhere you go. You can be sitting in a lecture, smiling with friends, trying to stay focused, but in the back of your mind it's always there. Rent. Groceries. Power. Petrol. That quiet panic of wondering how you're going to make it through the week.</p>
                  <p>I have been in that place, and it can feel isolating. Like everyone else is moving forward while you are just trying to stay afloat. And the hardest part is that you still have to perform. You still have assignments due. Exams coming. Group work. Expectations. Life does not pause just because you are struggling.</p>
                  <p>People say "just get a job" like it's simple. But when you are studying full-time, a job is not just extra income. It is late shifts when you should be studying. Missing class because you cannot afford not to work. Coming home exhausted and trying to read, write, remember, and keep up. It is the constant trade-off between protecting your future and paying for your present. That pressure does not only drain your bank account. It can drain your mental health, your confidence, your sleep, and your hope.</p>
                  <p>Swifto is my attempt to make that weight lighter. A way for students to earn in a flexible, realistic way, without locking their lives into fixed shifts or spending weeks applying for jobs that never reply. And for the people who use Swifto to get help, it is a chance to receive support in a safe, respectful way, while knowing you might be helping someone's rent, groceries, or breathing room.</p>
                  <p>Swifto was built from lived experience, from a place of understanding, not judgement. My hope is that when students open Swifto, they feel something they do not feel enough. Relief. Like there is an option. Like they are not alone. And like things can get better.</p>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-ink/20 my-16"></div>

            {/* Closing CTA */}
            <div className="mb-16">
              <div className="text-center space-y-6 py-12">
                <p className="text-lg text-ink/80">Ready to get something done, or earn extra cash this week?<br /><span className="font-semibold text-ink">Join Swifto and be part of a verified community built on trust.</span></p>
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
