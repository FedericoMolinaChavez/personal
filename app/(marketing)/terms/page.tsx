import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for consulting engagements with ${company.legalName}, trading as ${company.tradingName}.`,
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "28 July 2026";

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-headline-md text-on-background">
        {heading}
      </h2>
      <div className="flex flex-col gap-4 font-body-md text-body-md text-on-surface-variant">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <span id="top" />
      <Nav />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <article className="py-24 max-w-3xl flex flex-col gap-12">
          <header className="flex flex-col gap-4">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
              Legal
            </span>
            <h1 className="font-display text-headline-lg md:text-[48px] text-on-background">
              Terms of Service
            </h1>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              Last updated {LAST_UPDATED}
            </p>
          </header>

          <Section heading="1. Who you are contracting with">
            <p>
              These terms govern consulting services sold through{" "}
              {company.tradingName}.
            </p>
            <p>
              {company.tradingName} is a trading name of{" "}
              <strong className="text-on-background">
                {company.legalName}
              </strong>
              , a corporation registered in {company.registrationState}, with
              its registered address at {company.address}. Where these terms say
              &ldquo;I&rdquo;, &ldquo;me&rdquo; or &ldquo;we&rdquo;, that means{" "}
              {company.legalName}. Where they say &ldquo;you&rdquo;, that means
              the individual or organisation purchasing the services.
            </p>
            <p>
              {company.legalName} is the merchant of record for every payment
              made through this site. Charges may appear on your card or bank
              statement under {company.legalName} rather than{" "}
              {company.tradingName}. If you do not recognise a charge, email{" "}
              <a
                href={`mailto:${company.supportEmail}`}
                className="text-primary hover:underline underline-offset-4"
              >
                {company.supportEmail}
              </a>{" "}
              before disputing it — it is faster to resolve directly.
            </p>
          </Section>

          <Section heading="2. Services">
            <p>Three services are offered, each with a published fixed price:</p>
            <ul className="flex flex-col gap-3 list-disc pl-5">
              <li>
                <strong className="text-on-background">
                  Technical Strategy Session
                </strong>{" "}
                — a 90-minute working session on one technical decision, plus a
                written summary delivered within 48 hours of the session.
              </li>
              <li>
                <strong className="text-on-background">
                  AI Systems Architecture Audit
                </strong>{" "}
                — a fixed-scope review of an existing AI or agent system,
                delivered as a written report with a prioritised 90-day roadmap
                and a walkthrough call. Scope is agreed in writing before work
                starts.
              </li>
              <li>
                <strong className="text-on-background">
                  Fractional CTO retainer
                </strong>{" "}
                — ongoing technical leadership at approximately 20 hours per
                calendar month, billed monthly in advance.
              </li>
            </ul>
            <p>
              Anything outside an agreed scope is a separate engagement, quoted
              separately. Unused retainer hours do not roll over into the
              following month.
            </p>
          </Section>

          <Section heading="3. Fees and payment">
            <p>
              All prices are quoted and charged in US dollars and exclude any
              applicable taxes, which are added at checkout or on the invoice
              where required.
            </p>
            <p>
              Card payments are processed by Stripe. Card details are handled by
              Stripe and are never received or stored by {company.legalName}.
              The Technical Strategy Session is paid up front through the
              checkout on this site. The audit and the retainer are scoped on a
              call and invoiced afterwards, payable within 14 days of the
              invoice date unless agreed otherwise in writing.
            </p>
            <p>
              The Technical Strategy Session fee is credited in full against any
              larger engagement booked within 30 days of the session.
            </p>
          </Section>

          <Section heading="4. Cancellation and refunds">
            <p>
              <strong className="text-on-background">
                Technical Strategy Session.
              </strong>{" "}
              Reschedule or cancel at no cost with at least 24 hours&rsquo;
              notice, and the fee is refunded in full on request. Cancellations
              inside 24 hours, or a no-show, are not refundable — the time was
              held for you.
            </p>
            <p>
              <strong className="text-on-background">Audit.</strong>{" "}
              Cancel before work begins for a full refund. Once work has started the
              fee is non-refundable, since the deliverable is the work itself.
              There is no obligation to buy anything after an audit.
            </p>
            <p>
              <strong className="text-on-background">Retainer.</strong>{" "}
              Either side may cancel with 30 days&rsquo; written notice. The
              current
              month is not refunded; no further months are charged.
            </p>
          </Section>

          <Section heading="5. What I need from you">
            <p>
              Engagements depend on timely access to the relevant people,
              systems, repositories and documentation. If access is delayed,
              timelines move accordingly. You confirm that you have the right to
              grant any access you provide, and that doing so does not breach an
              obligation you owe to someone else.
            </p>
          </Section>

          <Section heading="6. Deliverables and intellectual property">
            <p>
              On full payment, you own the deliverables produced specifically
              for you — reports, roadmaps, written summaries and any code
              written for your project.
            </p>
            <p>
              I keep ownership of everything I bring with me: pre-existing
              tools, templates, methods and general know-how, including anything
              of that kind embedded in a deliverable. You get a perpetual,
              non-exclusive licence to use those embedded components as part of
              the deliverable. Nothing here stops me from using the skills and
              general knowledge gained during an engagement elsewhere.
            </p>
          </Section>

          <Section heading="7. Confidentiality">
            <p>
              Non-public information you share is kept confidential and used
              only to carry out the engagement. This does not cover information
              that is already public, that I already had, or that I am legally
              required to disclose. A separate NDA, where you have one, takes
              precedence over this section.
            </p>
            <p>
              I will not name you publicly as a client without your permission.
            </p>
          </Section>

          <Section heading="8. Warranties and liability">
            <p>
              Services are provided with reasonable skill and care. They are
              advisory: recommendations are made on the information available at
              the time, and decisions about your business, your systems and your
              compliance obligations remain yours. No specific commercial,
              technical or performance outcome is guaranteed.
            </p>
            <p>
              To the fullest extent permitted by law, total liability arising
              out of or connected with an engagement is limited to the fees you
              paid for that engagement, and neither side is liable for indirect
              or consequential loss, loss of profit, revenue or data. Nothing in
              these terms limits liability that cannot lawfully be limited,
              including for fraud.
            </p>
          </Section>

          <Section heading="9. Governing law">
            <p>
              These terms are governed by the laws of{" "}
              {company.registrationState}, and the courts of{" "}
              {company.registrationState} have exclusive jurisdiction over any
              dispute arising from them.
            </p>
          </Section>

          <Section heading="10. Changes to these terms">
            <p>
              These terms may be updated from time to time. The version in force
              for your engagement is the one published on the date you paid or
              signed off the scope. Material changes are reflected in the
              &ldquo;last updated&rdquo; date above.
            </p>
          </Section>

          <Section heading="11. Contact">
            <p>
              {company.legalName}
              <br />
              {company.address}
              <br />
              <a
                href={`mailto:${company.supportEmail}`}
                className="text-primary hover:underline underline-offset-4"
              >
                {company.supportEmail}
              </a>
            </p>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}
