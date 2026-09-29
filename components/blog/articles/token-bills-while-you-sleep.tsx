import Link from "next/link";
import ScheduleCallButton from "@/components/ScheduleCallButton";
import HireMeButton from "@/components/HireMeButton";

/**
 * Depth piece on TH-03: overnight / unattended LLM spend — missing caps,
 * retry and agent loops, and invoices with no route-level attribution.
 * Companion to the cornerstone demo-vs-production article.
 */
export default function TokenBillsWhileYouSleepArticle() {
  return (
    <>
      <p>
        The demo ran clean. Staging looked fine. Then an overnight cron, a
        stuck agent loop, or a retry storm kept calling the model while nobody
        was watching — and the invoice showed up in the morning. Founders do
        not wake up wanting more agents. They wake up wanting to know why the
        bill moved without a matching rise in users.
      </p>
      <p>
        This piece deepens{" "}
        <Link href="/blog/why-the-demo-passed-and-production-didnt">
          TH-03 from the demo-vs-production map
        </Link>
        : unattributed token spend. The discipline is not &ldquo;build more
        agents.&rdquo; It is surviving production without spending while you
        sleep — caps, attribution, and fail-closed budgets before you blame
        the model.
      </p>

      <h2>The overnight loop nobody owned</h2>
      <p className="text-on-background">
        &ldquo;Nothing changed in the product. The bill still doubled.&rdquo;
      </p>
      <p>
        Symptom: a job, webhook, or agent path that can call the model without
        a human in the loop. One upstream timeout becomes a retry. The retry
        re-enters the planner. The planner calls tools again. By dawn you have
        paid for the same lineage hundreds of times. Logs show the same route
        and roughly the same arguments repeating. Support sees hung runs, not
        a clean edge error.
      </p>
      <p>
        Demo traffic is attended. Someone stops the chat when it looks wrong.
        Production traffic is not. If the only stop condition is &ldquo;the
        human got bored,&rdquo; overnight spend is a design choice you already
        made — you just have not priced it yet.
      </p>

      <h2>Missing caps turn retries into a meter</h2>
      <p>
        Retries are fine when they are bounded. They are a token amplifier when
        they are not. The same is true for agent iteration caps, per-request
        ceilings, and per-tenant budgets. Without them, every failure mode
        becomes a spend mode.
      </p>
      <p className="text-on-background">Common gaps that show up in code reviews:</p>
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        <li>
          <span className="text-on-background">No per-request wall</span> —
          the route can keep completing until the provider rate-limits you or
          the card declines.
        </li>
        <li>
          <span className="text-on-background">No per-tenant ceiling</span> —
          one noisy customer or one bad integration burns the shared key for
          everyone.
        </li>
        <li>
          <span className="text-on-background">Retries without idempotency</span>{" "}
          — timeouts re-enter the same tool path, so you pay for duplicate
          work and sometimes duplicate side effects.
        </li>
        <li>
          <span className="text-on-background">
            Agent loops without a hard stop
          </span>{" "}
          — no max turns, no wall-clock kill, no fail-closed budget when the
          planner cannot converge.
        </li>
      </ol>
      <p>
        If you cannot answer &ldquo;what stops this after N attempts or $X?&rdquo;
        from the code, production will invent the answer on your invoice.
      </p>

      <h2>The invoice is a mystery without attribution</h2>
      <p className="text-on-background">
        &ldquo;We only have one API key and a monthly total.&rdquo;
      </p>
      <p>
        Symptom: provider invoices rise without a matching rise in users.
        Prompt text grew every sprint because appending was cheaper than
        redesigning. There is no per-route, per-feature, or per-tenant
        accounting — only a surprise. Finance asks which product line caused
        it. Engineering shrugs. Leadership debates model vendors while the
        expensive route keeps running.
      </p>
      <p>
        Attribution is not a nice dashboard. It is the difference between
        &ldquo;the model got expensive&rdquo; and &ldquo;the overnight digest
        job is 60% of spend, and its prompt doubled last month.&rdquo; Without
        that line item, every cost conversation stays theatrical.
      </p>

      <h2>What to measure before you blame the model</h2>
      <p>
        Before swapping providers or rewriting prompts, pull these from logs
        and code — not from vibes:
      </p>
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        <li>
          <span className="text-on-background">Caps that fail closed</span> —
          max retries, max agent turns, wall-clock kill, and a hard token or
          dollar ceiling per request and per tenant. Soft warnings that never
          stop the run do not count.
        </li>
        <li>
          <span className="text-on-background">Key and environment hygiene</span>{" "}
          — separate keys for prod vs staging vs evals where you can; no shared
          prod key on a laptop cron; revoke anything that can spend without
          ownership.
        </li>
        <li>
          <span className="text-on-background">Spend by route</span> — tokens
          in / tokens out by endpoint and feature flag for the last seven days.
          Name the top three. If you cannot, attribution is the first fix.
        </li>
        <li>
          <span className="text-on-background">Loop and retry lineages</span> —
          same request ID (or parent ID) repeating tool calls; p95 prompt size
          over time on the hot routes.
        </li>
      </ol>
      <p>
        Cost control and quality gates are cousins, not substitutes. A cheap
        wrong answer is still wrong — and an unbound right answer still wakes
        you up. Pair spend ceilings with the{" "}
        <Link href="/blog/evals-without-a-theater-set">
          small eval set that blocks merge on regressions
        </Link>
        so you do not &ldquo;save money&rdquo; by shipping silent quality drift.
      </p>

      <h2>When to scorecard, strategy, audit, or sprint</h2>
      <p>
        If you only know the bill hurt and not which condition you are in,
        start with the ungated{" "}
        <Link href="/scorecard">30-check production scorecard</Link>
        . It is the same dimensions I run inside a paid audit — no email
        required to see a score.
      </p>
      <p>
        If the scorecard already points at one decision (where to put the
        ceiling, which route to instrument first, whether the overnight job
        should call the model at all), a{" "}
        <Link href="/#offer">$300 strategy session</Link> is the right width:
        one written recommendation, not a rewrite of the stack.
      </p>
      <p>
        If spend, retries, and attribution are tangled across the real
        codebase — not one route — the{" "}
        <Link href="/#offer">$2,500 architecture audit</Link> is the fixed-scope
        pass: cost breakdown, failure modes, and a 90-day roadmap your team can
        execute without me.
      </p>
      <p>
        If the pain is a specific agent or classification path that needs a
        frozen eval set and a CI gate so merges cannot quietly reopen the burn,
        that is the{" "}
        <Link href="/#offer">$5,000 agent reliability sprint</Link>
        — time-boxed, defined end, between audit and retainer. Ongoing ownership
        of cost ceilings, kill switches, and the rest of the scorecard gaps is{" "}
        <Link href="/#offer">$4,000/mo fractional CTO</Link>.
      </p>

      <h2>Next step</h2>
      <p>
        Run the{" "}
        <Link href="/scorecard">30-check production scorecard</Link>
        , or print the{" "}
        <Link href="/scorecard/checklist">offline checklist</Link> and tick the
        token-spend and retry rows first. No email required to see a score.
      </p>
      <p>
        If the scorecard confirms an unbound path, book a free{" "}
        <Link href="/#booking">15-minute intake</Link> and we will decide
        whether this is work I should be doing. Published rates if you already
        know the shape of the engagement:{" "}
        <Link href="/#offer">$300 strategy session</Link>,{" "}
        <Link href="/#offer">$2,500 architecture audit</Link>,{" "}
        <Link href="/#offer">$5,000 agent reliability sprint</Link>, or{" "}
        <Link href="/#offer">$4,000/mo fractional CTO</Link>.
      </p>

      <div className="mt-4 flex flex-col gap-4 border-t border-outline-variant/40 pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Link
            href="/scorecard"
            className="inline-block bg-primary px-8 py-3.5 text-center font-label-md text-label-md text-on-primary transition-transform hover:scale-95"
          >
            Run the scorecard
          </Link>
          <ScheduleCallButton
            label="Book a 15-minute intake"
            href="/#booking"
            className="inline-block border border-outline-variant px-8 py-3.5 text-center font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
          />
          <HireMeButton
            label="Buy the $300 session"
            disclosure={false}
            className="inline-block border border-outline-variant px-8 py-3.5 text-center font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-70"
          />
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Pricing for all four engagements is published on the{" "}
          <Link
            href="/#offer"
            className="text-primary hover:underline hover:underline-offset-4"
          >
            home page
          </Link>
          . More writing lives in the <Link href="/blog">blog index</Link>.
        </p>
      </div>
    </>
  );
}
