'use client'

import Link from 'next/link'
import { LegalPlaceholderPage } from '@/components/legal-placeholder-page'

export default function TermsPage() {
  return (
    <LegalPlaceholderPage
      title="Terms of Service"
      subtitle="Terms and conditions for using the Swifto platform"
      showPlaceholderNotice={false}
    >
      <p className="text-sm text-ink/60">
        <strong>Last updated:</strong> 5 August 2026
        <br />
        <strong>Version:</strong> 1.0
      </p>

      <p className="text-sm text-ink/70">
        These Terms should be read with our{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Statement
        </Link>
        ,{' '}
        <Link href="/payment-terms" className="text-primary hover:underline">
          Payment &amp; Payout Terms
        </Link>
        , and{' '}
        <Link href="/community-guidelines" className="text-primary hover:underline">
          Community Guidelines
        </Link>
        .
      </p>

      <div className="rounded-2xl border border-ink/10 bg-canvas px-5 py-4">
        <p className="text-sm font-semibold text-ink mb-2">Quick links</p>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <a href="#introduction" className="text-primary hover:underline">1. Introduction</a>
          <a href="#platform-description" className="text-primary hover:underline">2. Description of the Platform</a>
          <a href="#eligibility" className="text-primary hover:underline">3. Eligibility</a>
          <a href="#accounts" className="text-primary hover:underline">4. Account Registration</a>
          <a href="#verification" className="text-primary hover:underline">5. Identity Verification</a>
          <a href="#jobs" className="text-primary hover:underline">6. Job Listings and Applications</a>
          <a href="#payments" className="text-primary hover:underline">7. Payments</a>
          <a href="#fees" className="text-primary hover:underline">8. Fees and Pricing</a>
          <a href="#cancellations" className="text-primary hover:underline">9. Cancellations and No-Shows</a>
          <a href="#ratings" className="text-primary hover:underline">10. Ratings and Reviews</a>
          <a href="#prohibited" className="text-primary hover:underline">11. Prohibited Activities</a>
          <a href="#disputes" className="text-primary hover:underline">12. Disputes</a>
          <a href="#liability" className="text-primary hover:underline">13. Limitation of Liability</a>
          <a href="#indemnity" className="text-primary hover:underline">14. Indemnity</a>
          <a href="#insurance" className="text-primary hover:underline">15. Insurance</a>
          <a href="#termination" className="text-primary hover:underline">16. Suspension and Termination</a>
          <a href="#consumer-law" className="text-primary hover:underline">17. Consumer Law</a>
          <a href="#changes" className="text-primary hover:underline">18. Changes to Terms</a>
          <a href="#governing-law" className="text-primary hover:underline">19. Governing Law</a>
          <a href="#contact" className="text-primary hover:underline">20. Contact</a>
        </div>
      </div>

      <h2 id="introduction" className="text-xl font-semibold text-ink">1. Introduction</h2>
      <p>Welcome to Swifto.</p>
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Swifto
        platform, website, and services (collectively, the &ldquo;Platform&rdquo;).
      </p>
      <p>
        The Platform is operated by Swifto Limited, trading as Swifto, a company registered in New
        Zealand (company number 9450926).
      </p>
      <p>
        By creating an account or using the Platform, you agree to be bound by these Terms. If you
        do not agree to these Terms, you must not use the Platform.
      </p>

      <h2 id="platform-description" className="text-xl font-semibold text-ink">2. Description of the Platform</h2>
      <p>
        Swifto is an online marketplace that connects individuals seeking help with tasks
        (&ldquo;Listers&rdquo;) with individuals willing to perform those tasks
        (&ldquo;Students&rdquo;).
      </p>
      <p>
        Swifto provides the technology platform that facilitates job postings, applications,
        communication, and payments between users. Swifto is a platform and intermediary only. It
        does not employ Students, contract for task performance on behalf of Listers, or provide the
        underlying task services itself.
      </p>
      <p>
        Swifto does not guarantee the quality, safety, legality, or completion of any task. Task
        arrangements are made directly between users, subject to these Terms and applicable law.
      </p>
      <p>
        Verification badges or status labels indicate that certain checks have been completed. They
        do not guarantee user behaviour, task quality, safety outcomes, or suitability for a
        particular job.
      </p>

      <h2 id="eligibility" className="text-xl font-semibold text-ink">3. Eligibility</h2>
      <p>To use the Platform you must:</p>
      <ul>
        <li>be at least 18 years old</li>
        <li>be legally able to enter into binding agreements</li>
        <li>provide accurate and truthful information when creating an account</li>
        <li>use the Platform in compliance with applicable New Zealand law</li>
      </ul>
      <p>
        Swifto may refuse, restrict, or suspend accounts that do not meet these requirements. Swifto
        may limit access by region or user type where reasonably necessary to operate the Platform
        safely and lawfully.
      </p>

      <h2 id="accounts" className="text-xl font-semibold text-ink">4. Account Registration</h2>
      <p>To access certain features of the Platform you must create an account.</p>
      <p>You agree to:</p>
      <ul>
        <li>provide accurate information and keep it up to date</li>
        <li>keep your login credentials secure</li>
        <li>be responsible for activity under your account</li>
        <li>maintain only one account per person unless Swifto expressly permits otherwise</li>
      </ul>
      <p>
        Swifto reserves the right to suspend or terminate accounts suspected of fraudulent activity,
        misuse, impersonation, or breach of these Terms.
      </p>

      <h2 id="verification" className="text-xl font-semibold text-ink">5. Identity Verification</h2>
      <p>Swifto may require users to verify their identity or eligibility before using certain features.</p>
      <p>Users may be asked to provide:</p>
      <ul>
        <li>government-issued identification or equivalent verification information</li>
        <li>student or lister eligibility information</li>
        <li>other information reasonably required for fraud prevention, safety, or compliance</li>
      </ul>
      <p>
        Verification may be carried out by Swifto or a third-party provider. Failure to complete
        verification may result in restricted access to the Platform. Providing false or fraudulent
        information may result in permanent suspension.
      </p>
      <p>
        Swifto may re-check verification information from time to time and may suspend access while
        a review is underway.
      </p>

      <h2 id="jobs" className="text-xl font-semibold text-ink">6. Job Listings and Applications</h2>
      <p>
        Listers may create task listings describing work they wish to have completed. Students may
        apply to these listings.
      </p>
      <p>Listers are responsible for:</p>
      <ul>
        <li>providing accurate descriptions of the task, location, timing, and requirements</li>
        <li>ensuring tasks comply with applicable laws and platform rules</li>
        <li>communicating honestly and respectfully with applicants and selected Students</li>
      </ul>
      <p>Students are responsible for:</p>
      <ul>
        <li>determining whether they are capable of safely and lawfully completing the task</li>
        <li>providing accurate application information</li>
        <li>performing accepted tasks with reasonable care and in good faith</li>
      </ul>
      <p>
        Swifto does not guarantee that any job will be completed, that any Student will be selected,
        or that any listing will receive applications.
      </p>
      <p>
        Prohibited jobs may include illegal work, dangerous work without appropriate safeguards,
        discriminatory requirements, sexual services, or other tasks Swifto reasonably determines are
        unsuitable for the Platform.
      </p>

      <h2 id="payments" className="text-xl font-semibold text-ink">7. Payments</h2>
      <p>
        Payments for tasks are processed through Swifto&apos;s integrated payment system. Payments
        may be held securely until the task is completed and confirmed, subject to our{' '}
        <Link href="/payment-terms" className="text-primary hover:underline">
          Payment &amp; Payout Terms
        </Link>
        .
      </p>
      <p>
        Users must not attempt to bypass the Platform for payments. Detailed rules on deposits,
        holds, releases, refunds, chargebacks, and payouts are set out in the Payment &amp; Payout
        Terms.
      </p>

      <h2 id="fees" className="text-xl font-semibold text-ink">8. Fees and Pricing</h2>
      <p>
        Swifto may charge platform fees for facilitating transactions. Applicable fees, including
        listing fees, service fees, and payment processing costs, will be shown or explained before
        you confirm a relevant transaction.
      </p>
      <p>
        Swifto aims to present pricing clearly and avoid misleading representations about costs or
        the Platform&apos;s role, in line with the Fair Trading Act 1986.
      </p>
      <p>
        Users are responsible for their own tax obligations. GST treatment and payout differences
        may apply depending on user status and are explained in the Payment &amp; Payout Terms where
        relevant.
      </p>

      <h2 id="cancellations" className="text-xl font-semibold text-ink">9. Cancellations and No-Shows</h2>
      <p>
        Cancellation and no-show rules may apply depending on who cancels, when cancellation occurs,
        and the reason provided. Consequences may include refunds, partial refunds, reliability
        impacts, fees, or other platform actions shown at the time of cancellation.
      </p>
      <p>
        Detailed payment outcomes for cancellations and no-shows are addressed in the Payment
        &amp; Payout Terms. Users should follow in-app cancellation flows and retain relevant
        communications where a dispute may arise.
      </p>

      <h2 id="ratings" className="text-xl font-semibold text-ink">10. Ratings and Reviews</h2>
      <p>After a task is completed, users may leave ratings and reviews.</p>
      <p>Reviews must be:</p>
      <ul>
        <li>honest</li>
        <li>respectful</li>
        <li>based on genuine experiences</li>
      </ul>
      <p>
        Swifto reserves the right to remove or moderate reviews, listings, photos, messages, or other
        content that violates these Terms, the Community Guidelines, or applicable law.
      </p>

      <h2 id="prohibited" className="text-xl font-semibold text-ink">11. Prohibited Activities</h2>
      <p>Users must not:</p>
      <ul>
        <li>provide false or misleading information</li>
        <li>engage in harassment, bullying, discrimination, or abusive behaviour</li>
        <li>attempt to bypass the Platform for payments or fees</li>
        <li>engage in illegal activities or post unlawful job listings</li>
        <li>use the Platform for fraudulent, deceptive, or harmful purposes</li>
        <li>misuse another user&apos;s personal information, contact details, or job location</li>
        <li>interfere with Platform security, integrity, or other users&apos; access</li>
      </ul>
      <p>
        Further behavioural expectations are set out in our{' '}
        <Link href="/community-guidelines" className="text-primary hover:underline">
          Community Guidelines
        </Link>
        . Violation of these rules may result in account suspension or termination.
      </p>

      <h2 id="disputes" className="text-xl font-semibold text-ink">12. Disputes</h2>
      <p>
        If a dispute arises between users regarding a task, users should submit the dispute through
        the Platform or contact Swifto support.
      </p>
      <p>
        Swifto may review disputes based on available platform records, messages, timestamps, photos,
        payment records, and other evidence provided by the parties. Swifto may determine an outcome
        within a reasonable timeframe but does not guarantee any particular result.
      </p>
      <p>
        Swifto&apos;s role is limited to facilitating dispute resolution on the Platform. Payment
        outcomes, chargebacks, and refund rules are also governed by the Payment &amp; Payout Terms.
      </p>

      <h2 id="liability" className="text-xl font-semibold text-ink">13. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Swifto is not liable for the actions, omissions,
        conduct, or performance of users, or for the quality, safety, legality, or completion of
        tasks arranged through the Platform.
      </p>
      <p>
        Users agree that task arrangements involve inherent risks and are entered into at their own
        responsibility. Users should take reasonable safety precautions when meeting, communicating,
        or performing tasks.
      </p>
      <p>
        Nothing in these Terms excludes or limits rights or remedies that cannot be excluded or
        limited under New Zealand law, including under the Consumer Guarantees Act 1993 where it
        applies.
      </p>
      <p>
        Swifto is not responsible for delays or failures caused by events outside its reasonable
        control, including internet outages, third-party processor downtime, or force majeure events.
      </p>

      <h2 id="indemnity" className="text-xl font-semibold text-ink">14. Indemnity</h2>
      <p>
        Users agree to indemnify and hold harmless Swifto from claims, losses, liabilities, and
        expenses arising from their use of the Platform, breach of these Terms, violation of law,
        or harm caused to another user or third party through their conduct.
      </p>

      <h2 id="insurance" className="text-xl font-semibold text-ink">15. Insurance</h2>
      <p>
        Swifto does not provide insurance for users, tasks, property damage, personal injury, or
        third-party loss arising from tasks arranged through the Platform unless expressly stated
        otherwise in writing.
      </p>
      <p>
        Users are responsible for obtaining any insurance they consider appropriate for their own
        activities.
      </p>

      <h2 id="termination" className="text-xl font-semibold text-ink">16. Suspension and Termination</h2>
      <p>Swifto may suspend or terminate accounts that:</p>
      <ul>
        <li>violate these Terms or related policies</li>
        <li>engage in fraudulent or misleading activity</li>
        <li>pose safety risks to other users or the Platform</li>
        <li>attempt to circumvent platform payments or enforcement</li>
      </ul>
      <p>
        Users may request account deletion by contacting support. Deletion or suspension does not
        necessarily eliminate outstanding payment, dispute, tax, or record-keeping obligations, as
        described in our Privacy Statement and Payment &amp; Payout Terms.
      </p>
      <p>
        Where appropriate, users may contact Swifto to request review of an enforcement decision,
        but Swifto retains final discretion over account access and platform safety.
      </p>

      <h2 id="consumer-law" className="text-xl font-semibold text-ink">17. Consumer Law</h2>
      <p>
        Swifto provides access to a marketplace platform, matching tools, payment facilitation, and
        support services. Where you are a consumer under New Zealand law, you may have rights under
        the Consumer Guarantees Act 1993 in relation to the services Swifto itself supplies.
      </p>
      <p>
        Swifto will use reasonable care and skill in providing the Platform. If the Platform service
        fails to meet a guarantee that applies and cannot be excluded, you may be entitled to a
        remedy under applicable law.
      </p>
      <p>
        These Terms do not replace or limit consumer rights that cannot be contracted out of under
        New Zealand law. Swifto does not misrepresent its role as a platform intermediary rather than
        the direct provider of user-performed tasks.
      </p>

      <h2 id="changes" className="text-xl font-semibold text-ink">18. Changes to Terms</h2>
      <p>Swifto may update these Terms from time to time.</p>
      <p>
        Updated Terms will be posted on the Platform with a revised &ldquo;Last updated&rdquo; date.
        Material changes may also be communicated by email or another reasonable method.
      </p>
      <p>
        Continued use of the Platform after updated Terms are posted constitutes acceptance of the
        updated Terms, except where separate acceptance is required by law or by the Platform.
      </p>

      <h2 id="governing-law" className="text-xl font-semibold text-ink">19. Governing Law</h2>
      <p>
        These Terms are governed by the laws of New Zealand. Users submit to the non-exclusive
        jurisdiction of the courts of New Zealand for disputes relating to these Terms, subject to
        any rights that cannot be excluded under applicable law.
      </p>

      <h2 id="contact" className="text-xl font-semibold text-ink">20. Contact</h2>
      <p>For questions, complaints, or support regarding these Terms, contact:</p>
      <p>
        Swifto Support
        <br />
        Email:{' '}
        <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline font-medium">
          hello@swifto.co.nz
        </a>
      </p>
    </LegalPlaceholderPage>
  )
}
