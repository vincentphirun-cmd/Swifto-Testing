'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'

export default function TeamPage() {
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
                  The Team Behind Swifto
                </h1>
              </div>

              {/* Right Column - Space for content */}
              <div className="space-y-4">
                {/* Space for content objects */}
              </div>
            </div>
          </div>
        </section>

        {/* White Hero Section */}
        <section className="py-48 md:py-64 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            {/* Space for content */}
          </div>
        </section>
      </main>
    </>
  )
}
