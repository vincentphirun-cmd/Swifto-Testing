'use client'

import { LegalPlaceholderPage } from '@/components/legal-placeholder-page'

export default function PrivacyPage() {
  return (
    <LegalPlaceholderPage
      title="Privacy Statement"
      subtitle="How Swifto collects, uses, stores, protects, and shares personal information"
      showPlaceholderNotice={false}
    >
      <p className="text-sm text-ink/60">
        <strong>Last updated:</strong> 3 September 2026
        <br />
        <strong>Version:</strong> 1.1
      </p>

      <div className="rounded-2xl border border-ink/10 bg-canvas px-5 py-4">
        <p className="text-sm font-semibold text-ink mb-2">Quick links</p>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <a href="#introduction" className="text-primary hover:underline">1. Introduction</a>
          <a href="#who-we-are" className="text-primary hover:underline">2. Who We Are</a>
          <a href="#personal-information" className="text-primary hover:underline">3. Personal Information We Collect</a>
          <a href="#how-we-collect" className="text-primary hover:underline">4. How We Collect Information</a>
          <a href="#why-we-use" className="text-primary hover:underline">5. Why We Use Personal Information</a>
          <a href="#identity-verification" className="text-primary hover:underline">6. Identity Verification</a>
          <a href="#locations-safety" className="text-primary hover:underline">7. Job Locations and User Safety</a>
          <a href="#payments" className="text-primary hover:underline">8. Payments</a>
          <a href="#cookies-analytics" className="text-primary hover:underline">9. Cookies and Analytics</a>
          <a href="#artificial-intelligence" className="text-primary hover:underline">9A. Artificial Intelligence</a>
          <a href="#service-marketing" className="text-primary hover:underline">10. Service Messages and Marketing Communications</a>
          <a href="#sharing" className="text-primary hover:underline">11. How We Share Personal Information</a>
          <a href="#overseas-storage" className="text-primary hover:underline">12. Overseas Storage and Service Providers</a>
          <a href="#storage-security" className="text-primary hover:underline">13. Data Storage and Security</a>
          <a href="#retention" className="text-primary hover:underline">14. Data Retention</a>
          <a href="#access-correction" className="text-primary hover:underline">15. Access and Correction Rights</a>
          <a href="#account-deletion" className="text-primary hover:underline">16. Account Deletion Requests</a>
          <a href="#privacy-breaches" className="text-primary hover:underline">17. Privacy Breaches</a>
          <a href="#complaints" className="text-primary hover:underline">18. Complaints</a>
          <a href="#changes" className="text-primary hover:underline">19. Changes to This Privacy Policy</a>
          <a href="#contact-us" className="text-primary hover:underline">20. Contact Us</a>
        </div>
      </div>

      <h2 id="introduction" className="text-xl font-semibold text-ink">1. Introduction</h2>
      <p>
        This Privacy Policy explains how Swifto collects, uses, stores, protects, and shares
        personal information.
      </p>
      <p>
        Swifto is a platform that connects verified users who need tasks completed with verified
        students or workers who can apply for and complete those tasks.
      </p>
      <p>
        Swifto is committed to handling personal information in accordance with the Privacy Act 2020
        and applicable New Zealand privacy laws.
      </p>
      <p>
        This Privacy Policy should be read alongside our Terms of Service, Payment Terms, and
        Community Guidelines.
      </p>
      <p>
        By using Swifto, creating an account, posting a job, applying for a job, completing
        verification, or otherwise using the Platform, you acknowledge that Swifto may collect,
        use, store, and disclose your personal information as described in this Privacy Policy.
      </p>

      <h2 id="who-we-are" className="text-xl font-semibold text-ink">2. Who We Are</h2>
      <p>In this Privacy Policy, &ldquo;Swifto,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo; refers to:</p>
      <p>
        Swifto Limited, trading as Swifto
        <br />
        New Zealand company number 9450926
        <br />
        NZBN 9429053885234
        <br />
        Email:{' '}
        <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline font-medium">
          hello@swifto.co.nz
        </a>
        <br />
        Website:{' '}
        <a href="https://swifto.co.nz" className="text-primary hover:underline font-medium">
          https://swifto.co.nz
        </a>
      </p>
      <p>For privacy matters, you can contact our Privacy Officer at:</p>
      <p>
        Privacy Officer
        <br />
        Email:{' '}
        <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline font-medium">
          hello@swifto.co.nz
        </a>
      </p>
      <p>
        Every New Zealand organisation is required to have someone fulfilling the role of privacy
        officer, and this can be someone within the business.
      </p>

      <h2 id="personal-information" className="text-xl font-semibold text-ink">3. Personal Information We Collect</h2>
      <p>We may collect personal information from or about you when you use Swifto.</p>
      <p>This may include:</p>

      <h3 className="text-lg font-semibold text-ink">Account information</h3>
      <p>We may collect:</p>
      <ul>
        <li>full name</li>
        <li>email address</li>
        <li>phone number</li>
        <li>password or login credentials</li>
        <li>user type, such as student, worker, lister, or admin</li>
        <li>profile information</li>
        <li>account status</li>
        <li>verification status</li>
        <li>account preferences</li>
      </ul>

      <h3 className="text-lg font-semibold text-ink">Verification information</h3>
      <p>To help keep Swifto safe, we may collect information needed to verify users.</p>
      <p>This may include:</p>
      <ul>
        <li>identity verification information</li>
        <li>student status information</li>
        <li>verification documents or images, where required</li>
        <li>verification provider reference numbers</li>
        <li>verification result or status</li>
        <li>date and time of verification</li>
        <li>fraud prevention or safety checks</li>
      </ul>
      <p>
        Where possible, Swifto may use a third-party verification provider and may store only the
        verification result, status, or reference number rather than storing full identity
        documents ourselves.
      </p>

      <h3 className="text-lg font-semibold text-ink">Job and platform information</h3>
      <p>
        We may collect information connected to jobs listed, applied for, or completed through
        Swifto.
      </p>
      <p>This may include:</p>
      <ul>
        <li>job titles</li>
        <li>job descriptions</li>
        <li>job categories</li>
        <li>job location or address</li>
        <li>preferred times or deadlines</li>
        <li>job value or payment amount</li>
        <li>applications</li>
        <li>selected applicants</li>
        <li>job status</li>
        <li>completion status</li>
        <li>cancellations</li>
        <li>reviews or ratings</li>
        <li>reports, complaints, or dispute information</li>
        <li>admin notes relating to platform safety, support, or enforcement</li>
      </ul>
      <p>
        Where a job involves a physical location, Swifto may collect and use location information
        to allow the job to be completed safely and effectively.
      </p>

      <h3 className="text-lg font-semibold text-ink">Communications</h3>
      <p>We may collect communications connected to your use of Swifto, including:</p>
      <ul>
        <li>messages between users</li>
        <li>messages sent to or from Swifto support</li>
        <li>emails or notifications</li>
        <li>reports or complaints</li>
        <li>dispute evidence</li>
        <li>feedback or survey responses</li>
      </ul>

      <h3 className="text-lg font-semibold text-ink">Payment and transaction information</h3>
      <p>Swifto may collect payment-related information, including:</p>
      <ul>
        <li>transaction records</li>
        <li>job payment amount</li>
        <li>payment status</li>
        <li>refund status</li>
        <li>payout status</li>
        <li>payment processor reference numbers</li>
        <li>invoices, receipts, or payment records</li>
        <li>records needed for accounting, tax, fraud prevention, or dispute resolution</li>
      </ul>
      <p>
        Full card details are processed by our payment processor and are not intended to be stored
        directly by Swifto.
      </p>

      <h3 className="text-lg font-semibold text-ink">Device, usage, and analytics information</h3>
      <p>When you use Swifto, we may collect technical and usage information, including:</p>
      <ul>
        <li>IP address</li>
        <li>device type</li>
        <li>browser type</li>
        <li>operating system</li>
        <li>pages viewed</li>
        <li>features used</li>
        <li>buttons clicked</li>
        <li>session activity</li>
        <li>referral source</li>
        <li>approximate location based on device or browser information</li>
        <li>error logs</li>
        <li>performance data</li>
        <li>cookies or similar tracking technologies</li>
      </ul>
      <p>
        This information helps us understand how the Platform is used, improve user experience,
        detect issues, and protect the Platform from misuse.
      </p>

      <h3 className="text-lg font-semibold text-ink">Marketing information</h3>
      <p>
        If you sign up to receive updates, newsletters, promotions, or other marketing messages, we
        may collect:
      </p>
      <ul>
        <li>email address</li>
        <li>phone number, if SMS is used</li>
        <li>communication preferences</li>
        <li>marketing consent status</li>
        <li>unsubscribe status</li>
        <li>engagement with marketing messages</li>
      </ul>

      <h2 id="how-we-collect" className="text-xl font-semibold text-ink">4. How We Collect Information</h2>
      <p>We may collect personal information in several ways.</p>
      <h3 className="text-lg font-semibold text-ink">Information you provide directly</h3>
      <p>We collect information when you:</p>
      <ul>
        <li>create an account</li>
        <li>complete your profile</li>
        <li>post a job</li>
        <li>apply for a job</li>
        <li>complete verification</li>
        <li>make or receive payments</li>
        <li>send messages</li>
        <li>contact support</li>
        <li>submit a complaint or report</li>
        <li>provide feedback</li>
        <li>participate in surveys, promotions, or beta testing</li>
      </ul>
      <h3 className="text-lg font-semibold text-ink">Information collected automatically</h3>
      <p>
        We may automatically collect information when you use the Platform, including device, usage,
        analytics, log, cookie, and performance information.
      </p>
      <h3 className="text-lg font-semibold text-ink">Information collected from third parties or other users</h3>
      <p>
        We may collect personal information about you from other sources where reasonably necessary.
      </p>
      <p>This may include information from:</p>
      <ul>
        <li>identity verification providers</li>
        <li>payment processors</li>
        <li>fraud prevention or security providers</li>
        <li>analytics providers</li>
        <li>other Swifto users</li>
        <li>people who submit reports, complaints, reviews, or dispute evidence</li>
        <li>service providers supporting the Platform</li>
        <li>public or official sources where relevant and lawful</li>
      </ul>
      <p>
        From 1 May 2026, New Zealand&apos;s IPP3A creates notification obligations when an organisation
        collects personal information indirectly, meaning from someone other than the person
        themselves. Where required, Swifto will take reasonable steps to make sure you are aware of
        indirect collection of your personal information.
      </p>

      <h2 id="why-we-use" className="text-xl font-semibold text-ink">5. Why We Use Personal Information</h2>
      <p>Swifto may use personal information for the following purposes:</p>
      <ul>
        <li>to create and manage user accounts</li>
        <li>to operate and provide the Platform</li>
        <li>to allow users to post, apply for, accept, and complete jobs</li>
        <li>to verify users and support platform safety</li>
        <li>to facilitate payments, refunds, payouts, and transaction records</li>
        <li>to communicate with users about jobs, applications, payments, verification, safety, and account matters</li>
        <li>to provide customer support</li>
        <li>to manage complaints, reports, disputes, and enforcement action</li>
        <li>to detect, prevent, and investigate fraud, misuse, harmful behaviour, or unlawful activity</li>
        <li>to improve the Platform, user experience, features, and security</li>
        <li>to send service-related messages</li>
        <li>to send marketing messages where permitted by law</li>
        <li>to comply with legal, regulatory, accounting, tax, or reporting obligations</li>
        <li>to enforce our Terms of Service, Payment Terms, Community Guidelines, and other platform rules</li>
      </ul>

      <h2 id="identity-verification" className="text-xl font-semibold text-ink">6. Identity Verification</h2>
      <p>
        Swifto may require users to complete identity, student, or lister verification before they
        can access certain features.
      </p>
      <p>Verification helps Swifto:</p>
      <ul>
        <li>increase trust between users</li>
        <li>reduce fraud and fake accounts</li>
        <li>support user safety</li>
        <li>manage disputes</li>
        <li>protect the integrity of the Platform</li>
      </ul>
      <p>
        Verification may be carried out by Swifto or by a third-party verification provider.
      </p>
      <p>
        Where possible, Swifto will aim to limit the amount of verification information it stores
        directly. For example, we may store a verification status, verification date, or provider
        reference number instead of storing full identity documents.
      </p>
      <p>
        However, where identity documents or images are required, they will only be used for
        verification, fraud prevention, safety, dispute resolution, legal compliance, or platform
        enforcement purposes.
      </p>

      <h2 id="locations-safety" className="text-xl font-semibold text-ink">7. Job Locations and User Safety</h2>
      <p>
        Some jobs listed on Swifto may involve physical locations, such as homes, workplaces,
        campuses, or other addresses.
      </p>
      <p>Swifto may collect and use job location information to:</p>
      <ul>
        <li>allow a job to be completed</li>
        <li>show relevant job opportunities</li>
        <li>help users understand where a task is located</li>
        <li>support safety, disputes, and platform enforcement</li>
        <li>prevent fraud or misuse</li>
      </ul>
      <p>
        Exact job locations should only be shared where necessary for the job to be completed. For
        example, Swifto may limit detailed address information to users who are directly involved in
        a confirmed job.
      </p>
      <p>
        Users must not misuse another user&apos;s personal information, contact details, address, job
        location, or communications.
      </p>

      <h2 id="payments" className="text-xl font-semibold text-ink">8. Payments</h2>
      <p>
        Swifto uses payment service providers to process payments, payouts, refunds, and related
        transaction activity.
      </p>
      <p>
        Swifto may collect and store payment-related records, including transaction status, payment
        references, payout status, refund records, and accounting information.
      </p>
      <p>
        Swifto does not intend to store full credit card or debit card details directly. These are
        handled by our payment processor.
      </p>
      <p>Payment information may be used to:</p>
      <ul>
        <li>process job payments</li>
        <li>release or manage payouts</li>
        <li>manage refunds</li>
        <li>prevent fraud</li>
        <li>resolve disputes</li>
        <li>meet tax, accounting, and legal obligations</li>
        <li>enforce Swifto&apos;s Payment Terms</li>
      </ul>

      <h2 id="cookies-analytics" className="text-xl font-semibold text-ink">9. Cookies and Analytics</h2>
      <p>
        Swifto may use cookies, analytics tools, and similar technologies to understand how users
        interact with the Platform.
      </p>
      <p>These tools may collect information such as:</p>
      <ul>
        <li>IP address</li>
        <li>device type</li>
        <li>browser type</li>
        <li>operating system</li>
        <li>pages visited</li>
        <li>referral source</li>
        <li>time spent on the Platform</li>
        <li>buttons clicked</li>
        <li>user journey through the Platform</li>
        <li>error and performance data</li>
      </ul>
      <p>Swifto may use this information to:</p>
      <ul>
        <li>improve the Platform</li>
        <li>understand user behaviour</li>
        <li>measure performance</li>
        <li>fix bugs</li>
        <li>detect fraud or misuse</li>
        <li>improve safety and reliability</li>
        <li>assess marketing or referral effectiveness</li>
      </ul>
      <p>
        Users can usually control cookies through their browser settings. If you disable cookies,
        some parts of the Platform may not work properly.
      </p>
      <p>
        If Swifto uses analytics or tracking tools such as PostHog, we will use reasonable steps to
        avoid collecting unnecessary sensitive information through those tools.
      </p>
      <p>
        Essential cookies are needed to keep you signed in and to protect the Platform. Analytics
        cookies are optional. We show a consent banner on first visit and do not load PostHog until
        you accept analytics. You can change this later by clearing site data for swifto.co.nz or
        contacting us.
      </p>
      <p>
        New Zealand privacy law requires us to tell you when we collect personal information. This
        Privacy Statement, the signup acknowledgement, and the cookie banner are how we do that.
      </p>

      <h2 id="artificial-intelligence" className="text-xl font-semibold text-ink">9A. Artificial Intelligence</h2>
      <p>
        Swifto does not currently use generative AI chatbots, automated decision-making about users,
        or AI tools that read your messages or job content to make account decisions.
      </p>
      <p>
        If we add AI features later, we will update this Privacy Statement before those features go
        live, including what data is sent to any AI provider and whether it is processed outside New
        Zealand.
      </p>
      <p>
        If an AI feature is added that users can talk to, it will include safety responses for
        self-harm and suicide disclosures, including New Zealand help such as calling or texting 1737
        or calling 111 in an emergency. We will not provide instructions that help someone harm
        themselves.
      </p>

      <h2 id="service-marketing" className="text-xl font-semibold text-ink">10. Service Messages and Marketing Communications</h2>
      <p>Swifto may send users service-related messages. These may include messages about:</p>
      <ul>
        <li>account creation</li>
        <li>verification</li>
        <li>job applications</li>
        <li>job updates</li>
        <li>payment status</li>
        <li>safety notices</li>
        <li>disputes</li>
        <li>changes to policies</li>
        <li>important platform updates</li>
      </ul>
      <p>These messages are part of operating the Platform.</p>
      <p>
        Swifto may also send marketing or promotional messages, such as newsletters, promotional
        offers, referral campaigns, or updates about new features, where we have consent or are
        otherwise permitted by law.
      </p>
      <p>
        Commercial electronic messages in New Zealand generally need consent, accurate sender
        information, and a working unsubscribe option. The Department of Internal Affairs says
        commercial messages must include a functioning unsubscribe facility that is clearly
        presented and easy to use.
      </p>
      <p>
        You can unsubscribe from marketing messages at any time by using the unsubscribe link or
        instructions in the message, or by contacting us at{' '}
        <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline font-medium">
          hello@swifto.co.nz
        </a>
        .
      </p>
      <p>
        You may still receive service-related messages that are necessary for your account or use
        of the Platform.
      </p>

      <h2 id="sharing" className="text-xl font-semibold text-ink">11. How We Share Personal Information</h2>
      <p>
        Swifto may share personal information where reasonably necessary to operate the Platform,
        provide services, protect users, comply with law, or enforce our terms.
      </p>
      <p>We currently use these service providers (processors) to operate Swifto:</p>
      <ul>
        <li>Supabase (authentication, database, and file storage)</li>
        <li>Stripe (card payments, payouts, and related transaction processing)</li>
        <li>Vercel (website hosting)</li>
        <li>Resend (transactional email)</li>
        <li>PostHog (product analytics, only if you accept analytics cookies)</li>
      </ul>
      <p>
        These providers may store or process information in New Zealand or overseas. We do not sell
        personal information to advertisers.
      </p>
      <p>We may share information with:</p>
      <ul>
        <li>payment processors</li>
        <li>identity verification providers</li>
        <li>hosting and cloud service providers</li>
        <li>email and notification service providers</li>
        <li>analytics providers</li>
        <li>fraud prevention, security, or safety providers</li>
        <li>professional advisers, such as lawyers or accountants</li>
        <li>law enforcement, regulators, courts, government agencies, or authorities where required or permitted by law</li>
        <li>other users where necessary for jobs, applications, communications, payments, reviews, safety, or dispute resolution</li>
        <li>service providers who support Swifto&apos;s operations</li>
      </ul>
      <p>For example:</p>
      <ul>
        <li>a lister may see information about students who apply for their job</li>
        <li>a selected student may receive job details needed to complete the task</li>
        <li>a payment provider may receive transaction details needed to process payment</li>
        <li>a verification provider may receive information needed to complete identity or student verification</li>
        <li>Swifto support may review communications, reports, or job records when handling disputes or safety concerns</li>
      </ul>
      <p>Swifto does not sell users&apos; personal information.</p>

      <h2 id="overseas-storage" className="text-xl font-semibold text-ink">12. Overseas Storage and Service Providers</h2>
      <p>
        Some of Swifto&apos;s service providers may store or process personal information outside New
        Zealand.
      </p>
      <p>This may include providers used for:</p>
      <ul>
        <li>website hosting</li>
        <li>cloud databases</li>
        <li>payments</li>
        <li>identity verification</li>
        <li>analytics</li>
        <li>email notifications</li>
        <li>support tools</li>
        <li>security monitoring</li>
      </ul>
      <p>
        Privacy Principle 12 sets rules for disclosing personal information outside New Zealand.
        Organisations need to check that overseas recipients have comparable safeguards or otherwise
        take steps to ensure adequate protection.
      </p>
      <p>
        Where Swifto discloses personal information to an overseas service provider, we will take
        reasonable steps to ensure the provider protects personal information in a way that is
        comparable to the safeguards required under the Privacy Act 2020, or that another lawful
        basis for disclosure applies.
      </p>

      <h2 id="storage-security" className="text-xl font-semibold text-ink">13. Data Storage and Security</h2>
      <p>
        Swifto takes reasonable steps to protect personal information from loss, misuse,
        unauthorised access, disclosure, alteration, or destruction.
      </p>
      <p>These steps may include:</p>
      <ul>
        <li>secure hosting and database systems</li>
        <li>access controls</li>
        <li>password protection</li>
        <li>encryption where appropriate</li>
        <li>restricted admin access</li>
        <li>monitoring for suspicious activity</li>
        <li>secure payment processing through third-party providers</li>
        <li>limiting access to personal information to people who need it</li>
        <li>reviewing security settings and permissions</li>
      </ul>
      <p>
        However, no website, platform, or online system can guarantee absolute security. Users are
        responsible for keeping their login details secure and should contact Swifto immediately if
        they believe their account has been compromised.
      </p>

      <h2 id="retention" className="text-xl font-semibold text-ink">14. Data Retention</h2>
      <p>
        Swifto will keep personal information only for as long as reasonably necessary for the
        purposes described in this Privacy Policy.
      </p>
      <p>This may include keeping information for as long as needed to:</p>
      <ul>
        <li>operate the Platform</li>
        <li>manage user accounts</li>
        <li>complete jobs and transactions</li>
        <li>resolve disputes</li>
        <li>handle complaints or safety reports</li>
        <li>prevent fraud or misuse</li>
        <li>comply with tax, accounting, legal, or regulatory obligations</li>
        <li>enforce our Terms of Service, Payment Terms, and Community Guidelines</li>
      </ul>
      <p>
        Where personal information is no longer required, Swifto will take reasonable steps to
        delete, de-identify, or securely archive it.
      </p>
      <p>
        Privacy Principle 9 covers retention and provides that organisations should not keep
        personal information for longer than required for the lawful purpose for which it may be
        used.
      </p>

      <h2 id="access-correction" className="text-xl font-semibold text-ink">15. Access and Correction Rights</h2>
      <p>
        Under New Zealand privacy law, users have rights to request access to and correction of
        their personal information.
      </p>
      <p>You may ask Swifto to:</p>
      <ul>
        <li>confirm whether we hold personal information about you</li>
        <li>provide access to your personal information</li>
        <li>correct inaccurate, incomplete, or outdated personal information</li>
      </ul>
      <p>
        To make a request, contact us at:
        <br />
        <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline font-medium">
          hello@swifto.co.nz
        </a>
      </p>
      <p>
        We may need to verify your identity before responding to an access or correction request.
      </p>
      <p>
        If we cannot provide access or make a correction, we will explain why where required by
        law.
      </p>

      <h2 id="account-deletion" className="text-xl font-semibold text-ink">16. Account Deletion Requests</h2>
      <p>
        You may delete your Swifto account in the app at{' '}
        <a href="/settings/account" className="text-primary hover:underline font-medium">
          Account &amp; privacy
        </a>
        , or by contacting us at:
        <br />
        <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline font-medium">
          hello@swifto.co.nz
        </a>
      </p>
      <p>
        In-app deletion is intended to take a similar number of steps as creating an account. When
        you delete your account, Swifto will remove your login, profile, job posts, applications,
        messages we hold for you, profile photo, and identity documents stored in our buckets,
        except where we must retain limited records.
      </p>
      <p>
        If you request account deletion, Swifto will take reasonable steps to delete or de-identify
        personal information that is no longer needed.
      </p>
      <p>However, we may retain certain information where reasonably necessary for:</p>
      <ul>
        <li>completing transactions</li>
        <li>resolving disputes</li>
        <li>investigating fraud or safety issues</li>
        <li>complying with tax, accounting, legal, or regulatory obligations</li>
        <li>enforcing our terms</li>
        <li>maintaining business records</li>
      </ul>

      <h2 id="privacy-breaches" className="text-xl font-semibold text-ink">17. Privacy Breaches</h2>
      <p>
        If Swifto becomes aware of a privacy breach, we will take reasonable steps to:
      </p>
      <ul>
        <li>contain the breach</li>
        <li>assess what happened</li>
        <li>identify what information was affected</li>
        <li>assess the risk of harm</li>
        <li>notify affected users where appropriate</li>
        <li>notify the Office of the Privacy Commissioner where required by law</li>
        <li>take steps to reduce the risk of a similar breach happening again</li>
      </ul>
      <p>
        The Privacy Act 2020 requires agencies to report notifiable privacy breaches, and official
        guidance emphasises having a breach management system or incident response plan.
      </p>

      <h2 id="complaints" className="text-xl font-semibold text-ink">18. Complaints</h2>
      <p>
        If you have a privacy concern or complaint, please contact Swifto first so we can try to
        resolve it.
      </p>
      <p>
        Contact:
        <br />
        Privacy Officer
        <br />
        Email:{' '}
        <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline font-medium">
          hello@swifto.co.nz
        </a>
      </p>
      <p>We will consider your complaint and respond within a reasonable timeframe.</p>
      <p>
        If you are not satisfied with our response, you may contact the Office of the Privacy
        Commissioner.
      </p>

      <h2 id="changes" className="text-xl font-semibold text-ink">19. Changes to This Privacy Policy</h2>
      <p>Swifto may update this Privacy Policy from time to time.</p>
      <p>
        If we make material changes, we may notify users by email, through the Platform, or by
        another reasonable method.
      </p>
      <p>
        The updated Privacy Policy will apply from the date it is posted or from any later date
        stated in the updated policy.
      </p>

      <h2 id="contact-us" className="text-xl font-semibold text-ink">20. Contact Us</h2>
      <p>
        For privacy questions, access or correction requests, account deletion requests,
        complaints, or other privacy matters, contact:
      </p>
      <p>
        Swifto Privacy Officer
        <br />
        Email:{' '}
        <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline font-medium">
          hello@swifto.co.nz
        </a>
        <br />
        Website:{' '}
        <a href="https://swifto.co.nz" className="text-primary hover:underline font-medium">
          https://swifto.co.nz
        </a>
      </p>
    </LegalPlaceholderPage>
  )
}
