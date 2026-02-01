'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'

export default function CancellationPolicyPage() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="py-16 md:py-24 bg-primary">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                Student cancellation policy
              </h1>
              <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
                Cancellation rules for students
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto w-full max-w-4xl px-4 md:px-8 space-y-8">
            <div className="prose prose-lg max-w-none text-ink/90">
              <h2 className="text-2xl font-semibold text-ink mb-4">Policy</h2>
              <ul className="space-y-3 list-disc pl-6">
                <li><strong>More than 24 hours before start:</strong> Full refund to lister, no penalty</li>
                <li><strong>24 hours to 2 hours before start:</strong> Full refund, reliability score decreases</li>
                <li><strong>Less than 2 hours or no-show:</strong> Refund minus late-cancel fee, student gets strike + restrictions</li>
                <li><strong>Safety-related cancellation:</strong> No penalty, flagged for review</li>
              </ul>

              <h2 className="text-2xl font-semibold text-ink mt-12 mb-4">What happens when you cancel</h2>
              <p className="text-ink/80">
                When you cancel an accepted job, the task returns to open and the lister can select another student. 
                Other students who previously applied will be notified that the spot has reopened. 
                The job may be boosted in the feed for 2 hours as an &quot;Urgent rebook&quot;.
              </p>

              <h2 className="text-2xl font-semibold text-ink mt-12 mb-4">Contact the lister first</h2>
              <p className="text-ink/80">
                Before cancelling, try contacting the lister. Many scheduling issues can be resolved without cancelling.
              </p>
            </div>

            <div className="pt-8 border-t border-ink/20">
              <Link
                href="/dashboard/student/jobs-applied"
                className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Jobs Applied
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
