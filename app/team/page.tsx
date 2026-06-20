'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'

export default function TeamPage() {
  return (
    <>
      <SiteNav />
      <main className="bg-canvas">
        <PageHero title="The team behind Swifto" />

        <section className="py-48 md:py-64">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            {/* Space for content */}
          </div>
        </section>
      </main>
    </>
  )
}
