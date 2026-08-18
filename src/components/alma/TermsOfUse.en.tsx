import { EMAIL_SUPPORT, GMAIL_COMPOSE_URL } from "@/components/constants/mail";

export const TermsOfUseEn = () => (
  <div className="max-w-xl mx-auto px-6 py-4 sm:px-12">
    <strong className="block font-bold">Terms of Use</strong>
    <p className="mt-1 leading-snug text-sm">
      These Terms of Use ("Terms") govern your use of the Alma mobile
      application ("Application"), provided by Serhii Kushnir ("Service
      Provider"). By downloading, installing or using the Application, you
      agree to these Terms. If you do not agree, do not use the
      Application.
    </p>

    <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
      <strong className="block font-bold">Health Disclaimer</strong>
      <p className="mt-1 leading-snug text-sm">
        Alma provides sound, music and meditation audio for relaxation and
        focus. It is <em>not</em> a medical device and does not provide
        medical, psychological or therapeutic advice, diagnosis or
        treatment, and is not a substitute for professional care.
      </p>
      <p className="mt-1 leading-snug text-sm">
        Do not use Alma in any situation that requires your full attention,
        such as driving or operating machinery — sessions are designed to
        reduce alertness and may induce drowsiness or sleep. Listen at a
        moderate volume to protect your hearing, particularly with
        headphones. If you have a condition that can be affected by
        sustained or rhythmic audio, such as photosensitive or audiogenic
        epilepsy, tinnitus, or a psychiatric condition, consult a qualified
        healthcare professional before use. Stop immediately if you feel
        unwell.
      </p>
    </div>

    <strong className="block font-bold mt-4">Licence</strong>
    <p className="mt-1 leading-snug text-sm">
      The Service Provider grants you a personal, non-exclusive,
      non-transferable, revocable licence to use the Application on devices
      that you own or control, for your own non-commercial use, in
      accordance with these Terms and the Google Play Terms of Service.
    </p>

    <strong className="block font-bold mt-4">Your Account</strong>
    <p className="mt-1 leading-snug text-sm">
      Some features require an account. You agree to provide accurate
      information, to keep your credentials confidential, and to be
      responsible for all activity under your account. You must be at least
      13 years old to create an account. The Service Provider may suspend or
      terminate accounts that violate these Terms.
    </p>

    <strong className="block font-bold mt-4">Subscriptions and Payment</strong>
    <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
      <li>The Application is free to download and offers optional paid subscriptions ("Alma Premium") that unlock additional features and content.</li>
      <li>All purchases are processed by Google Play. The Service Provider does not receive or store your payment card details.</li>
      <li>Subscriptions renew automatically at the end of each billing period unless cancelled at least 24 hours before the renewal date. The price shown at purchase applies for each renewal period until changed, with notice, in accordance with Google Play rules.</li>
      <li>You can manage or cancel a subscription at any time in Google Play → Subscriptions. Cancelling stops future renewals; access continues until the end of the paid period.</li>
      <li>Refunds are handled by Google Play under its refund policy. Deleting your account does <em>not</em> cancel or refund an active subscription — cancel it in Google Play separately.</li>
      <li>Any free trial converts to a paid subscription unless cancelled before the trial ends.</li>
    </ul>

    <strong className="block font-bold mt-4">Content and Intellectual Property</strong>
    <p className="mt-1 leading-snug text-sm">
      All audio, artwork, text, software and other materials provided in the
      Application are owned by the Service Provider or its licensors and are
      protected by copyright and other laws. You may not copy, extract,
      redistribute, sell, publicly perform, or create derivative works from
      the Application's content, or use it as a component of another
      product or service, without prior written permission.
    </p>

    <strong className="block font-bold mt-4">Audio You Import</strong>
    <p className="mt-1 leading-snug text-sm">
      The Application lets you import audio files from your own device. You
      are solely responsible for ensuring you have the right to use any
      file you import. Imported files remain on your device and are not
      uploaded to the Service Provider's servers. You may only use imported
      content for personal, private listening.
    </p>

    <strong className="block font-bold mt-4">Acceptable Use</strong>
    <p className="mt-1 leading-snug text-sm">You agree not to:</p>
    <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
      <li>reverse engineer, decompile, or attempt to extract the source code or audio assets of the Application, except to the extent permitted by applicable law;</li>
      <li>interfere with, overload, or attempt to gain unauthorized access to the Application or its servers;</li>
      <li>use the Application for any unlawful purpose or in breach of any applicable law;</li>
      <li>circumvent, disable or tamper with subscription, licensing or security mechanisms.</li>
    </ul>

    <strong className="block font-bold mt-4">Availability and Changes</strong>
    <p className="mt-1 leading-snug text-sm">
      The Service Provider may modify, suspend, or discontinue the
      Application or any of its features at any time. Some features require
      an internet connection, and the Service Provider is not responsible
      for problems arising from your device, network availability, or data
      charges from your mobile provider. The Application may be updated
      from time to time; you should accept updates to continue receiving
      support.
    </p>

    <strong className="block font-bold mt-4">Disclaimer of Warranties</strong>
    <p className="mt-1 leading-snug text-sm">
      The Application is provided "AS IS" and "AS AVAILABLE", without
      warranties of any kind, whether express or implied, including but not
      limited to merchantability, fitness for a particular purpose, and
      non-infringement. The Service Provider does not warrant that the
      Application will be uninterrupted, error-free, or free of harmful
      components.
    </p>

    <strong className="block font-bold mt-4">Limitation of Liability</strong>
    <p className="mt-1 leading-snug text-sm">
      To the maximum extent permitted by applicable law, the Service
      Provider shall not be liable for any indirect, incidental, special,
      consequential or punitive damages, or for any loss of data, profits,
      or goodwill, arising out of or in connection with your use of the
      Application. Nothing in these Terms excludes or limits liability that
      cannot be excluded or limited under applicable law, including your
      statutory consumer rights.
    </p>

    <strong className="block font-bold mt-4">Termination</strong>
    <p className="mt-1 leading-snug text-sm">
      You may stop using the Application at any time and delete your
      account as described at{" "}
      <a href="https://calmisu.com/alma/en/delete-account/" className="text-blue-600 underline">
        calmisu.com/alma/en/delete-account
      </a>
      . The Service Provider may terminate or restrict your access if you
      breach these Terms. Provisions relating to intellectual property,
      disclaimers, and limitation of liability survive termination.
    </p>

    <strong className="block font-bold mt-4">Privacy</strong>
    <p className="mt-1 leading-snug text-sm">
      Your use of the Application is also governed by the{" "}
      <a href="/alma/en/privacy-policy/" className="text-blue-600 underline">
        Privacy Policy
      </a>
      , which forms part of these Terms.
    </p>

    <strong className="block font-bold mt-4">Changes to These Terms</strong>
    <p className="mt-1 leading-snug text-sm">
      These Terms may be updated from time to time. The Service Provider
      will post the revised Terms on this page and update the date below.
      Continued use of the Application after changes take effect
      constitutes acceptance of the revised Terms.
    </p>

    <strong className="block font-bold mt-4">Governing Law</strong>
    <p className="mt-1 leading-snug text-sm">
      These Terms are governed by the laws of the country in which the
      Service Provider is established, without regard to conflict-of-law
      rules. If you are a consumer, you also benefit from any mandatory
      protections of the law of your country of residence.
    </p>

    <strong className="block font-bold mt-4">Contact</strong>
    <p className="mt-1 leading-snug text-sm">
      Questions about these Terms can be sent to{" "}
      <a href={`${GMAIL_COMPOSE_URL}${EMAIL_SUPPORT}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{EMAIL_SUPPORT}</a>.
    </p>

    <p className="mt-4 leading-snug text-sm text-muted-foreground">Effective date: 28 July 2026</p>
  </div>
);
