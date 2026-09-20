import Link from "next/link";
import ScheduleCallButton from "@/components/ScheduleCallButton";
import HireMeButton from "@/components/HireMeButton";

/**
 * Cornerstone article: demo vs production for vibe-coded / Cursor-built
 * AI apps. Maps 1:1 to homepage thermocline conditions TH-01…TH-06.
 */
export default function WhyDemoPassedArticle() {
  return (
    <>
      <p>
        A demo is one request, in daylight, with a warm cache and somebody
        narrating the happy path. Production is concurrent traffic, cold
        context, a retry storm at 3am, and a token bill nobody has read since
        launch. The gap is not mysterious. It is six conditions, and they
        usually show up in the same order.
      </p>
      <p>
        If you shipped with Cursor, v0, Replit, Lovable, Bolt, or a weekend of
        vibe coding, the demo was the design target. That is fine. It is also
        why the system looks finished until the first real week of traffic.
        Below is what actually breaks — concrete symptoms, not a strategy
        essay — and what to measure before you blame the model.
      </p>

      <h2>TH-01 · Retry and idempotency loops</h2>
      <p className="text-on-background">
        &ldquo;It worked all week, then fell over on Tuesday.&rdquo;
      </p>
      <p>
        Symptom: one upstream timeout becomes a retry, the retry re-enters the
        same tool call, and the loop pays for it hundreds of times before anyone
        notices. Logs show the same tool name and roughly the same arguments
        repeating. Spend charts spike on a single request ID lineage. Support
        sees &ldquo;duplicate charge,&rdquo; &ldquo;double email,&rdquo; or
        &ldquo;agent hung&rdquo; without a clean error at the edge.
      </p>
      <p>
        What to measure: max retries per request, whether tool side effects are
        idempotent (or guarded by a request key), and a hard wall-clock /
        iteration cap on every agent loop. If you cannot answer &ldquo;what
        stops this after N attempts?&rdquo; from the code, production will
        invent the answer for you.
      </p>
      <p>
        In practice this shows up as a Tuesday incident after a quiet demo week:
        one flaky dependency, exponential backoff without a budget, and a tool
        that creates a row or fires a webhook on every attempt. The model did not
        get worse. The loop lost its floor.
      </p>

      <h2>TH-02 · Context and RAG packing drift</h2>
      <p className="text-on-background">
        &ldquo;The model got worse and we didn&apos;t change anything.&rdquo;
      </p>
      <p>
        Symptom: answers that used to cite the right section now paraphrase
        boilerplate. Latency creeps up as prompts get longer. Relevant chunks
        still exist in the index; they simply never make the final window
        because a retriever nobody has re-evaluated since week one is packing
        noise first.
      </p>
      <p>
        What to measure: retrieval hit rate against a fixed question set,
        average tokens of retrieved vs. unused context, and how often the cited
        source was actually in the top-k. If quality is only checked by reading
        a few chats, you will not see silent degradation until customers do.
      </p>
      <p>
        Drift is slow. A chunking change, a new boilerplate system prompt, or a
        denser corpus can push the same &ldquo;working&rdquo; pipeline into a
        worse packing order without a single model upgrade. Treat the retriever
        as a product surface with its own regression suite.
      </p>

      <h2>TH-03 · Unattributed token spend</h2>
      <p className="text-on-background">
        &ldquo;The bill tripled and we can&apos;t see why.&rdquo;
      </p>
      <p>
        Symptom: provider invoices rise without a matching rise in users.
        Prompt text grew every sprint because appending was cheaper than
        redesigning. There is no per-route, per-feature, or per-tenant
        accounting — only a monthly surprise.
      </p>
      <p>
        What to measure: tokens in / tokens out by endpoint and by feature flag,
        p95 prompt size over time, and a ceiling that fails closed when a single
        request or tenant exceeds budget. Without attribution, &ldquo;the
        model got expensive&rdquo; is a story you tell yourself instead of a
        line item you can cut.
      </p>
      <p>
        Teams that fix this usually find one chat route or one agent tool path
        owning most of the invoice. Until you can name that route, every
        cost conversation stays abstract — and abstract cost conversations do
        not get fixed.
      </p>

      <h2>TH-04 · No eval set — happy-path-only testing</h2>
      <p className="text-on-background">
        &ldquo;It&apos;s fine — we tested it.&rdquo;
      </p>
      <p>
        Symptom: every deploy is a guess. Regressions surface as poorly worded
        support tickets. The team tested the demo script by hand, maybe with a
        staging key, and shipped. There is no frozen set of inputs with expected
        outputs, so you cannot tell whether last Thursday&apos;s change made
        anything worse.
      </p>
      <p>
        What to measure: size of the eval set (even fifty cases beats zero),
        pass rate on main before merge, and whether prompt or retrieval changes
        are blocked when that rate drops. Manual happy-path clicks are not an
        eval suite. They are a demo rehearsal.
      </p>
      <p>
        Start small: golden questions with expected citations, forbidden tool
        calls, and a few adversarial inputs. Wire the suite into CI so a prompt
        edit that breaks three cases cannot merge because &ldquo;it looked fine
        in chat.&rdquo;
      </p>

      <h2>TH-05 · Multi-agent non-convergence</h2>
      <p className="text-on-background">
        &ldquo;Two agents got into an argument and burned an hour.&rdquo;
      </p>
      <p>
        Symptom: individually reasonable agents, no shared state discipline, no
        termination rule about who decides. Traces show A proposing, B
        rejecting, A restating, B restating — until budget or patience runs
        out. Wall time and token burn both climb without a final artefact.
      </p>
      <p>
        What to measure: max turns per orchestration, whether there is a single
        writer for shared state, and a forced resolve path (human, rule, or
        designated agent) when agents disagree. If the system has no definition
        of &ldquo;done,&rdquo; it will not converge under load.
      </p>
      <p>
        Multi-agent demos hide this because the operator stops the run when it
        gets boring. Production has no operator with a finger on the stop
        button — only a budget and a timeout you forgot to set.
      </p>

      <h2>TH-06 · An &ldquo;AI problem&rdquo; that is ordinary app security</h2>
      <p className="text-on-background">
        &ldquo;It&apos;s an AI problem, so it&apos;s the model&apos;s
        fault.&rdquo;
      </p>
      <p>
        Symptom: unauthenticated tool routes, API keys in the client bundle,
        prompts that will cheerfully read a record belonging to somebody else.
        The incident write-up starts with model behaviour and ends with a
        missing authz check. Most AI incidents I see are ordinary application
        security, shipped fast.
      </p>
      <p>
        What to measure: every tool and data path behind authn/authz, secrets
        only on the server, and whether the model can request a resource ID it
        was never granted. If the app around the model would fail a basic
        review without an LLM in the picture, the model is not the bug.
      </p>

      <h2>What to measure before you blame the model</h2>
      <p>
        Before swapping providers or rewriting prompts, answer these from logs
        and code — not from vibes:
      </p>
      <ol className="flex list-decimal flex-col gap-3 pl-5">
        <li>
          Cap and identity: does every agent loop have a hard stop, and are side
          effects keyed so retries do not double-apply?
        </li>
        <li>
          Retrieval honesty: on a fixed question set, do the right chunks still
          enter the window after last week&apos;s packing changes?
        </li>
        <li>
          Spend attribution: can you name the top three routes by token cost in
          the last seven days?
        </li>
        <li>
          Eval gate: is there a pass/fail set that runs before merge, however
          small?
        </li>
        <li>
          Orchestration done-ness: who decides when agents disagree, and what
          kills the run?
        </li>
        <li>
          App security: would this system still be unsafe if every completion
          returned a constant string?
        </li>
      </ol>
      <p>
        If two or more of the thermocline conditions describe your system, the
        diagnosis is usually not the hard part. The hard part is deciding
        whether you want a checklist you can run yourself, a focused working
        session on one decision, or a written audit of the real codebase.
      </p>

      <h2>Next step</h2>
      <p>
        Start with the ungated{" "}
        <Link href="/scorecard">
          {`30-check production scorecard`}
        </Link>
        . No email required to see a score — same dimensions I run inside a paid
        audit.
      </p>
      <p>
        If the scorecard confirms what you already suspected, book a free{" "}
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
          .
        </p>
      </div>
    </>
  );
}
