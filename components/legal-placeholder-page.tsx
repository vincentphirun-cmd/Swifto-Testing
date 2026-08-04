'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'

type Props = {
  title: string
  subtitle: string
}

/** Shared layout for legal docs — body is placeholder until real copy is added. */
export function LegalPlaceholderPage({ title, subtitle }: Props) {
  return (
    <>
      <SiteNav />
      <main className="bg-canvas min-h-screen">
        <PageHero title={title} subtitle={subtitle} centered />
        <section className="py-12 md:py-16">
          <div className="mx-auto w-full max-w-3xl px-4 md:px-8 space-y-8">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
              <p className="font-semibold">Placeholder content</p>
              <p className="mt-1 text-amber-900/90">
                Replace this page with your final legal text before launch. This copy is temporary
                and not legal advice.
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-ink/85 space-y-4">
              <h2 className="text-xl font-semibold text-ink">1. Overview</h2>
              <p>
                [Placeholder] Describe what this document covers and who it applies to (students,
                listers, and Swifto).
              </p>

              <h2 className="text-xl font-semibold text-ink">2. Key terms</h2>
              <p>
                [Placeholder] Add definitions, user obligations, platform rules, and limitations of
                liability as appropriate for this document.
              </p>

              <h2 className="text-xl font-semibold text-ink">3. Contact</h2>
              <p>
                [Placeholder] For questions about these terms, contact{' '}
                <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline">
                  hello@swifto.co.nz
                </a>
                .
              </p>
            </div>

            <p className="text-sm text-ink/60">
              Related:{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              {' · '}
              <Link href="/community-guidelines" className="text-primary hover:underline">
                Community Guidelines
              </Link>
              {' · '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Statement
              </Link>
              {' · '}
              <Link href="/payment-terms" className="text-primary hover:underline">
                Payment &amp; Payout Terms
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
