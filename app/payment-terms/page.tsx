'use client'

import { LegalPlaceholderPage } from '@/components/legal-placeholder-page'

export default function PaymentTermsPage() {
  return (
    <LegalPlaceholderPage
      title="Payment & Payout Terms"
      subtitle="How payments, fees, payouts, refunds, and disputes work on Swifto"
      showPlaceholderNotice={false}
    >
      <p className="text-sm text-ink/60">
        <strong>Last updated:</strong> 5 August 2026
        <br />
        <strong>Version:</strong> 1.0
      </p>

      <div className="rounded-2xl border border-ink/10 bg-canvas px-5 py-4">
        <p className="text-sm font-semibold text-ink mb-2">Quick links</p>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <a href="#overview" className="text-primary hover:underline">1. Overview</a>
          <a href="#payment-processing" className="text-primary hover:underline">2. Payment Processing</a>
          <a href="#escrow" className="text-primary hover:underline">3. Escrow and Fund Holding</a>
          <a href="#platform-fees" className="text-primary hover:underline">4. Platform Fees</a>
          <a href="#payment-authorization" className="text-primary hover:underline">5. Payment Authorization</a>
          <a href="#payment-flow" className="text-primary hover:underline">6. Payment Flow</a>
          <a href="#refunds" className="text-primary hover:underline">7. Refunds</a>
          <a href="#cancellations" className="text-primary hover:underline">8. Cancellations and No-Shows</a>
          <a href="#disputes" className="text-primary hover:underline">9. Disputes and Chargebacks</a>
          <a href="#payouts" className="text-primary hover:underline">10. Payouts</a>
          <a href="#off-platform" className="text-primary hover:underline">11. Off-Platform Payments</a>
          <a href="#third-party" className="text-primary hover:underline">12. Third-Party Processors</a>
          <a href="#taxes" className="text-primary hover:underline">13. Taxes</a>
          <a href="#changes" className="text-primary hover:underline">14. Changes to These Terms</a>
          <a href="#contact" className="text-primary hover:underline">15. Contact</a>
        </div>
      </div>

      <h2 id="overview" className="text-xl font-semibold text-ink">1. Overview</h2>
      <p>
        These Payment &amp; Payout Terms govern financial transactions conducted through Swifto.
        They should be read alongside our Terms of Service, Privacy Statement, and Community
        Guidelines.
      </p>
      <p>
        Swifto provides a platform that connects listers who need tasks completed with students who
        perform those tasks. Swifto facilitates payments and payouts but is not a bank, escrow
        agent, or payment institution.
      </p>

      <h2 id="payment-processing" className="text-xl font-semibold text-ink">2. Payment Processing</h2>
      <p>
        Payments are processed through third-party payment providers. Swifto does not directly store
        full payment card information.
      </p>
      <p>
        Listers may add funds to a Swifto balance to pay for jobs. Students may receive payouts for
        completed work through our payout provider. Card charges, refunds, and transfers are handled
        by the relevant payment processor on Swifto&apos;s behalf.
      </p>

      <h2 id="escrow" className="text-xl font-semibold text-ink">3. Escrow and Fund Holding</h2>
      <p>
        Payments for tasks may be held securely until the task is completed and confirmed. Funds may
        be released once both parties confirm completion, subject to these terms and any applicable
        dispute or review process.
      </p>
      <p>
        In practice, lister funds used for jobs are managed within the Swifto platform until job
        completion is verified. Student earnings are credited according to platform rules and may be
        withdrawn after payout eligibility requirements are met.
      </p>

      <h2 id="platform-fees" className="text-xl font-semibold text-ink">4. Platform Fees</h2>
      <p>
        Swifto may charge service fees for facilitating transactions. Details of applicable fees will
        be shown before payment is completed, in line with transparent pricing requirements under
        New Zealand consumer law, including the Fair Trading Act 1986.
      </p>
      <p>Fees may include, where applicable:</p>
      <ul>
        <li>a listing fee when a lister posts a job</li>
        <li>a platform service fee on completed job payments</li>
        <li>payment processing costs charged by third-party providers (for example Stripe)</li>
        <li>any optional add-ons or featured listing fees, if offered</li>
      </ul>
      <p>
        Fee amounts, who pays them (lister or student), and when they apply will be displayed or
        explained at the relevant step before you confirm a transaction. Swifto aims to present
        pricing clearly so users understand the total cost before proceeding.
      </p>

      <h2 id="payment-authorization" className="text-xl font-semibold text-ink">5. Payment Authorization</h2>
      <p>
        By submitting payment information or confirming a deposit, listers authorize Swifto&apos;s
        payment processor to charge the specified amount for the transaction shown at checkout or
        confirmation.
      </p>
      <p>
        You must only use payment methods you are authorised to use. Providing false or unauthorised
        payment information may result in account suspension and other enforcement action.
      </p>

      <h2 id="payment-flow" className="text-xl font-semibold text-ink">6. Payment Flow</h2>
      <p>The payment flow on Swifto works as follows in general terms:</p>
      <ul>
        <li>
          <strong>When charged:</strong> listers are charged when they deposit funds or pay applicable
          listing or job-related fees, as shown at checkout.
        </li>
        <li>
          <strong>When held:</strong> funds allocated to a job remain within the platform until the
          job is completed and confirmed, or until another outcome applies under these terms (for
          example cancellation or dispute).
        </li>
        <li>
          <strong>When released:</strong> after both parties confirm completion (or as otherwise
          determined under platform rules), earnings may be credited to the student and become
          available for withdrawal subject to payout requirements.
        </li>
        <li>
          <strong>What &ldquo;completion&rdquo; means:</strong> completion generally requires the
          relevant verification or confirmation steps within the Platform, such as lister and student
          completion confirmation, unless Swifto determines otherwise during a dispute or review.
        </li>
      </ul>
      <p>
        Release timing and payout method depend on verification status, bank account connection, and
        processor availability. Partial releases may apply only where the Platform explicitly
        supports them and the circumstances require it.
      </p>

      <h2 id="refunds" className="text-xl font-semibold text-ink">7. Refunds</h2>
      <p>Refunds may be issued in cases such as:</p>
      <ul>
        <li>task cancellation under applicable rules</li>
        <li>disputes resolved in favour of a refund</li>
        <li>platform errors or other circumstances Swifto determines warrant a refund</li>
        <li>unused lister balance refunded to card, where eligible under our refund process</li>
      </ul>
      <p>
        Refund eligibility may be reviewed on a case-by-case basis. Refunds are processed through our
        payment providers and may take several business days to appear, depending on the user&apos;s
        bank or card issuer.
      </p>

      <h2 id="cancellations" className="text-xl font-semibold text-ink">8. Cancellations and No-Shows</h2>
      <p>
        Cancellation and no-show rules may differ depending on who cancels, when cancellation
        occurs, and the reason provided. Outcomes may include full or partial refunds, reliability
        impacts, late fees, or other platform consequences as shown in the Platform at the time of
        cancellation.
      </p>
      <p>Examples of factors Swifto may consider include:</p>
      <ul>
        <li>whether the lister or student cancelled</li>
        <li>how much notice was given before the scheduled start time</li>
        <li>whether a no-show occurred and what evidence was provided</li>
        <li>whether safety-related reasons were reported</li>
      </ul>
      <p>
        Users should follow in-app cancellation flows and retain relevant communications or evidence
        where a dispute may arise.
      </p>

      <h2 id="disputes" className="text-xl font-semibold text-ink">9. Disputes and Chargebacks</h2>
      <p>
        If a dispute arises regarding payment, users should contact Swifto support. Swifto may
        investigate and determine an appropriate resolution based on platform records, communications,
        and evidence provided by the parties.
      </p>
      <p>
        Disputes should generally be raised within a reasonable time after a job is marked complete
        or after the issue occurred. Swifto may specify or update dispute windows in the Platform or
        in these terms from time to time.
      </p>
      <p>
        <strong>Chargebacks:</strong> if a user initiates a chargeback or payment reversal through
        their bank or card issuer, Swifto and/or our payment processor may investigate. Chargebacks
        may result in account restrictions, reversal of platform balances, recovery of amounts owed,
        or suspension where misuse or fraud is suspected. Users may be responsible for chargeback
        fees or losses where permitted by law and processor rules.
      </p>
      <p>
        Contact:{' '}
        <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline font-medium">
          hello@swifto.co.nz
        </a>
      </p>

      <h2 id="payouts" className="text-xl font-semibold text-ink">10. Payouts</h2>
      <p>
        Students may receive payouts after task completion, subject to verification, completion
        confirmation, and any hold or review period.
      </p>
      <p>
        Payouts are processed through{' '}
        <strong>Stripe Connect</strong> (or another payment provider Swifto designates). Students
        must complete any required onboarding, including identity and bank account verification, before
        withdrawals are enabled.
      </p>
      <p>
        Payout timing depends on Stripe, the student&apos;s bank, and compliance checks. Swifto does
        not guarantee instant payout availability.
      </p>

      <h2 id="off-platform" className="text-xl font-semibold text-ink">11. Off-Platform Payments</h2>
      <p>
        Users must not attempt to bypass Swifto&apos;s payment system by arranging payment outside
        the Platform for jobs initiated on Swifto. This includes cash, bank transfer, or other
        off-platform payment intended to avoid platform fees or oversight.
      </p>
      <p>
        Off-platform payment may result in account suspension, loss of platform protections, and
        enforcement under our Terms of Service and Community Guidelines.
      </p>

      <h2 id="third-party" className="text-xl font-semibold text-ink">12. Third-Party Processors</h2>
      <p>
        Payments and payouts are processed by third parties such as Stripe. By using payment or
        payout features, you agree to comply with applicable processor terms where required.
      </p>
      <p>
        Payments or payouts may be delayed, blocked, or frozen where a processor or Swifto conducts
        fraud, compliance, or security reviews. Swifto is not responsible for processor downtime or
        actions taken by a processor under its own policies.
      </p>

      <h2 id="taxes" className="text-xl font-semibold text-ink">13. Taxes</h2>
      <p>
        Users are responsible for complying with applicable tax obligations. Swifto does not provide
        tax advice.
      </p>
      <p>
        <strong>GST:</strong> GST may apply to certain Swifto fees or transactions as shown at
        checkout or on receipts. Users who are GST-registered may have different payout or reporting
        treatment as reflected in the Platform.
      </p>
      <p>
        Students and listers are responsible for their own income tax and GST registration
        obligations where applicable. Swifto may provide records or receipts to assist with
        record-keeping but does not determine your personal tax position.
      </p>

      <h2 id="changes" className="text-xl font-semibold text-ink">14. Changes to These Terms</h2>
      <p>
        Swifto may update these Payment &amp; Payout Terms from time to time. Material changes may be
        communicated by email, through the Platform, or by another reasonable method.
      </p>
      <p>
        Continued use of payment or payout features after updated terms are posted constitutes
        acceptance of the updated terms, except where separate acceptance is required (for example on
        first deposit or first withdrawal).
      </p>

      <h2 id="contact" className="text-xl font-semibold text-ink">15. Contact</h2>
      <p>For payment, refund, payout, or dispute questions, contact:</p>
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
