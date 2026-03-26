import React from 'react';

const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
    <div className="space-y-3 leading-7 text-slate-700">{children}</div>
  </section>
);

export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-12">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Terms & Conditions</h1>
      <p className="mt-3 text-sm text-slate-500">Last updated: March 24, 2026</p>

      <div className="mt-8 space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
        <Section title="Agreement to Terms">
          <p>
            These Terms of Use constitute a legally binding agreement between you and T-REX concerning your
            access to and use of the Site. By accessing the Site, you agree to be bound by these Terms.
            If you do not agree, you must discontinue use immediately.
          </p>
          <p>
            Supplemental terms, policies, or documents posted on the Site are incorporated herein by reference.
            We reserve the right to modify these Terms at any time without prior notice. Continued use of the
            Site after updates constitutes acceptance of those updates.
          </p>
          <p>
            The Site is intended for users who are at least 18 years old. Persons under 18 are not permitted
            to use or register on the Site.
          </p>
        </Section>

        <Section title="User Representations">
          <ol className="list-decimal space-y-2 pl-6">
            <li>All registration information submitted by you is true, accurate, current, and complete.</li>
            <li>You will maintain and promptly update registration information as required.</li>
            <li>You have legal capacity and agree to comply with these Terms of Use.</li>
            <li>You are not under 18 years of age.</li>
            <li>You will not access the Site through automated or non-human means.</li>
            <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            <li>Your use of the Site will not violate any applicable law or regulation.</li>
          </ol>
          <p>
            If any information is untrue, inaccurate, not current, or incomplete, we may suspend or terminate
            your account and refuse current or future use of the Site.
          </p>
        </Section>

        <Section title="Products">
          <p>
            We make every effort to display product colors, features, specifications, and details as accurately
            as possible. However, we do not guarantee that your electronic display reflects exact colors or
            details.
          </p>
          <p>
            All products are subject to availability. We reserve the right to discontinue products at any time
            and update pricing without prior notice.
          </p>
        </Section>

        <Section title="Return, Refund & Cancellation">
          <p>Please review our policy before making purchases.</p>
          <p>
            For order-related issues, write to
            {' '}
            <a className="text-[#5f8f57] underline" href="mailto:customercare@trexstore.in">
              customercare@trexstore.in
            </a>
            {' '}
            or call +91-00000-00000.
          </p>
        </Section>

        <Section title="Prohibited Activities">
          <p>
            You may not use the Site for any purpose other than that for which we make it available.
            The Site may not be used in connection with commercial endeavors unless approved by us.
          </p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>No unauthorized scraping, automated data collection, or database creation.</li>
            <li>No fake account creation, unsolicited communication, or impersonation.</li>
            <li>No attempts to bypass security controls or restricted parts of the Site.</li>
            <li>No malware, viruses, harmful payloads, or disruptive scripts.</li>
            <li>No reverse engineering, decompiling, or tampering with platform code.</li>
            <li>No unlawful, abusive, fraudulent, or misleading conduct on the Site.</li>
          </ol>
        </Section>

        <Section title="Term and Termination">
          <p>
            These Terms remain in effect while you use the Site. We reserve the right to deny access,
            suspend accounts, or terminate usage at our discretion and without prior notice, including
            for breaches of these Terms or applicable laws.
          </p>
        </Section>

        <Section title="Modifications and Interruptions">
          <p>
            We reserve the right to modify, suspend, or discontinue the Site at any time without notice.
            We are not liable for downtime, delays, interruptions, or unavailability of the Site.
          </p>
        </Section>

        <Section title="Governing Law">
          <p>
            These Terms and your use of the Site are governed by and construed in accordance with the
            laws of India.
          </p>
        </Section>

        <Section title="Indemnification">
          <p>
            You agree to defend, indemnify, and hold harmless T-REX and its affiliates, employees, and agents
            against any claims, liabilities, losses, damages, or expenses arising from your use of the Site,
            breach of these Terms, or violation of any third-party rights.
          </p>
        </Section>

        <Section title="Miscellaneous">
          <p>
            These Terms and any policies posted on the Site constitute the full agreement between you and T-REX.
            If any provision is found unenforceable, remaining provisions continue in full force.
          </p>
          <p>
            We may assign rights and obligations at any time. No joint venture, partnership, employment, or
            agency relationship is created by use of the Site.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>For complaints or more information regarding use of the Site, contact:</p>
          <p>
            T-REX
            <br />
            B3+4, Navswarajya Housing Society
            <br />
            Paud Road, Kothrud, Pune – 411 038
            <br />
            Email:
            {' '}
            <a className="text-[#5f8f57] underline" href="mailto:customercare@trexstore.in">
              customercare@trexstore.in
            </a>
          </p>
        </Section>
      </div>
    </section>
  );
}
