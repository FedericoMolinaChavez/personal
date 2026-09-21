import Link from "next/link";
import ScheduleCallButton from "@/components/ScheduleCallButton";
import HireMeButton from "@/components/HireMeButton";

/**
 * Depth piece on TH-04: standing up a small, measurable eval set without
 * turning evals into vanity dashboards or unmaintainable golden chats.
 * Companion to the cornerstone demo-vs-production article.
 */
export default function EvalsWithoutTheaterSetArticle() {
  return (
    <>
      <p>
        Clicking through the demo script and declaring the model &ldquo;good
        enough&rdquo; is not an evaluation practice. It is rehearsal. The script
        has known answers, a warm cache, and a narrator who steers away from
        the awkward prompt. Customers do not rehearse. They ask adjacent
        questions, paste adversarial junk, and notice when last week&apos;s
        citation habit quietly dies.
      </p>
      <p>
        This piece deepens{" "}
        <Link href="/blog/why-the-demo-passed-and-production-didnt">
          TH-04 from the demo-vs-production map
        </Link>
        : no frozen eval set, happy-path-only testing. The fix is not a
        research lab. It is a small, measurable set of cases that runs before
        merge — and a rule that a drop in pass rate blocks the change, even
        when the demo still looks fine.
      </p>

      <h2>Happy-path demos miss silent quality drift</h2>
      <p>
        Demo clicks cover the path you designed for. They do not cover the
        distribution you ship into. After a prompt tweak, a retrieval
        reweight, or a &ldquo;just make it more helpful&rdquo; system-message
        edit, the happy path often still works. What moves is everything next
        to it: citation precision, tool refusal on out-of-scope asks, answer
        length, and how often the model invents a source that was never
        retrieved.
      </p>
      <p>
        Silent drift looks like support tickets that are hard to reproduce.
        &ldquo;It used to name the policy section.&rdquo; &ldquo;It started
        calling tools it shouldn&apos;t.&rdquo; &ldquo;Answers feel fluffier.&rdquo;
        None of those show up in a five-minute click-through. They show up when
        you compare the same inputs week over week against expected constraints
        — and they are usually visible weeks before leadership notices the
        product got worse.
      </p>
      <p>
        The same failure mode shows up after &ldquo;harmless&rdquo;
        infrastructure changes: a chunker swap, a metadata filter, a new
        embedding model with the old index still half-migrated. The demo
        question still retrieves something plausible. The long-tail questions
        start citing the wrong tenant&apos;s FAQ or invent a section number
        that never existed. Without a frozen input set, you will debate
        whether the model &ldquo;got worse&rdquo; for a sprint instead of
        pointing at the commit that moved retrieval.
      </p>
      <p>
        If your only quality gate is a human watching a chat, you are measuring
        narration, not behaviour. Narration is a theater set: lighting, props,
        and a known ending. Production is the house with the lights on.
      </p>

      <h2>A minimum viable eval set (even ~50 beats zero)</h2>
      <p>
        You do not need a thousand-case benchmark or a vendor dashboard. You
        need a frozen list of inputs with expectations you can score without
        arguing every time. Start small enough that someone will maintain it.
        Fifty cases is already more signal than zero — if they are chosen on
        purpose.
      </p>
      <p className="text-on-background">Build three slices, not one giant golden chat dump:</p>
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        <li>
          <span className="text-on-background">Golden questions</span> —
          the queries you demo and the ones support already hears. For each:
          required facts, allowed tone bounds, and whether a citation or tool
          call is required. Score pass/fail against those constraints, not
          &ldquo;sounds good.&rdquo;
        </li>
        <li>
          <span className="text-on-background">
            Expected citations and tool constraints
          </span>{" "}
          — cases where the right answer is &ldquo;refuse,&rdquo;
          &ldquo;ask a clarifying question,&rdquo; or &ldquo;cite document X,
          not Y.&rdquo; If retrieval or tools are in the path, assert that the
          cited chunk was actually in top-k and that disallowed tools were not
          invoked.
        </li>
        <li>
          <span className="text-on-background">A few adversarial inputs</span>{" "}
          — prompt injection flavour, out-of-scope requests, empty or huge
          context, multilingual edge cases you already know hurt. You are not
          building a red-team paper. You are freezing the failure modes that
          already embarrassed you once.
        </li>
      </ol>
      <p>
        Store cases as data: id, input, expected assertions, tags (retrieval /
        tools / safety / happy-path). Do not paste fifty transcripts into a
        Notion page and call it an eval suite. Unmaintainable golden chats are
        how evals become theater — lots of text, no runnable gate, and nobody
        updates them after the second sprint.
      </p>
      <p>
        Prefer cheap automatic checks where you can: string contains, JSON
        schema, tool-name allowlists, citation ID match, max tokens. Use an LLM
        judge only for the slice that truly needs semantic grading, and keep
        that judge&apos;s prompt versioned like product code. If every case
        needs a human rater, you do not have a CI gate — you have a ritual.
      </p>

      <h2>Wire it into CI so vibes cannot merge</h2>
      <p>
        An eval set that only runs on someone&apos;s laptop is a suggestion.
        Wire the suite into the same path that already blocks broken builds:
        pull request checks. Any change to prompts, system messages, retrieval
        config, tool schemas, or model IDs should run the suite before merge.
      </p>
      <p>
        Practical shape that teams actually keep:
      </p>
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        <li>
          Deterministic harness: same model ID (or pinned shadow), same
          temperature policy you use in prod for that route, fixed seeds if the
          provider allows, recorded fixtures for upstream tools when you are
          testing the planner not the vendor.
        </li>
        <li>
          Fail the job when pass rate drops below the baseline on{" "}
          <span className="text-on-background">main</span>, or when any
          critical-tagged case flips from pass to fail. Soft warnings for known
          flaky tags are fine; silent green is not.
        </li>
        <li>
          Surface the failing case IDs in the PR. Engineers should not need a
          separate dashboard login to see that case{" "}
          <span className="font-data text-[0.8125rem]">gold-014</span> lost its
          citation after a packing change.
        </li>
      </ol>
      <p>
        Cost concern is real. Run the full set on changes that touch the AI
        path; run a smoke subset (ten to fifteen cases) on unrelated PRs if you
        must. Do not skip the gate because tokens are expensive — that is how
        you pay later in support and trust. Cap concurrency, cache embeddings
        for retrieval fixtures, and keep the suite small enough that a full run
        finishes inside a normal CI budget.
      </p>
      <p>
        Ownership matters as much as the YAML. Name a person who can add a case
        when support finds a new failure mode, and who can delete or rewrite a
        case when the product intent changes on purpose. An orphan suite bitrots
        into false confidence: green CI, stale expectations, and a team that
        stopped believing the numbers.
      </p>

      <h2>What to measure (and what to ignore)</h2>
      <p>
        Measure three numbers and put them where merges already happen:
      </p>
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        <li>
          <span className="text-on-background">Pass rate on main</span> — the
          baseline after each green merge. Treat it like a test suite health
          metric, not a marketing KPI.
        </li>
        <li>
          <span className="text-on-background">Blocked merges on drop</span> —
          count how often the gate actually stopped a change. If that count
          stays zero for months, either quality never moves (unlikely) or the
          gate is theater.
        </li>
        <li>
          <span className="text-on-background">Critical-case failures</span> —
          a short list that must never regress (billing explanations, auth
          refusals, &ldquo;I don&apos;t know&rdquo; when retrieval is empty).
          One red critical case is enough to fail the build.
        </li>
      </ol>
      <p>
        Ignore vanity dashboards that chart &ldquo;helpfulness&rdquo; with no
        tie to merge policy. Ignore leaderboards that compare your app to
        public academic sets your customers never ask. Ignore golden chats that
        nobody can re-run. If a metric cannot block a bad prompt change, it is
        decoration.
      </p>
      <p>
        When a case flakes, fix the assertion or quarantine it with an owner —
        do not lower the threshold until green returns. Threshold theater
        (&ldquo;we moved the bar to 70% so CI stays green&rdquo;) is the same
        disease as demo-only testing, wearing a lab coat.
      </p>

      <h2>How this sits with the rest of the thermocline</h2>
      <p>
        Evals will not fix retry loops, unbound token spend, or missing authz.
        They will tell you when a retrieval packing change quietly emptied the
        window, or when a friendlier system prompt started calling tools it
        should refuse. Pair this gate with the rest of the{" "}
        <Link href="/blog/why-the-demo-passed-and-production-didnt">
          production failure map
        </Link>
        . TH-04 is the condition that makes every other condition harder to see
        until a customer files it.
      </p>

      <h2>Next step</h2>
      <p>
        If you do not know whether you even have the other five conditions,
        start with the ungated{" "}
        <Link href="/scorecard">30-check production scorecard</Link>
        , or print the{" "}
        <Link href="/scorecard/checklist">offline checklist</Link> and tick the
        eval and retrieval rows first. No email required to see a score — same
        dimensions I run inside a paid audit.
      </p>
      <p>
        If the scorecard confirms a missing gate, book a free{" "}
        <Link href="/#booking">15-minute intake</Link> and we will decide
        whether this is work I should be doing. Published rates if you already
        know the shape of the engagement:{" "}
        <Link href="/#offer">$300 strategy session</Link>,{" "}
        <Link href="/#offer">$2,500 architecture audit</Link>, or{" "}
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
          Pricing for all three engagements is published on the{" "}
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
