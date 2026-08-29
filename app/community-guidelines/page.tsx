'use client'

import { LegalPlaceholderPage } from '@/components/legal-placeholder-page'

export default function CommunityGuidelinesPage() {
  return (
    <LegalPlaceholderPage
      title="Community Guidelines"
      subtitle="How members are expected to behave on Swifto"
      showPlaceholderNotice={false}
    >
      <h2 className="text-xl font-semibold text-ink">1. Respectful Conduct</h2>
      <p>
        Users must interact respectfully with others on the Platform. Harassment or
        discrimination is not tolerated.
      </p>

      <h2 className="text-xl font-semibold text-ink">2. Accurate Listings</h2>
      <p>
        Job listings must be accurate and lawful. Misleading listings may be removed.
      </p>

      <h2 className="text-xl font-semibold text-ink">3. Safe Tasks</h2>
      <p>
        Tasks must not involve illegal activity or unreasonable safety risks.
      </p>

      <h2 className="text-xl font-semibold text-ink">4. Platform Integrity</h2>
      <p>
        Users must not attempt to bypass Swifto&apos;s payment system or engage in fraudulent
        behaviour.
      </p>

      <h2 className="text-xl font-semibold text-ink">5. Reporting Issues</h2>
      <p>
        Users may report misconduct or safety concerns to:{' '}
        <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline font-medium">
          hello@swifto.co.nz
        </a>
      </p>
    </LegalPlaceholderPage>
  )
}

