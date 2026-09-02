"use client";

import { useEffect, useRef, useState } from "react";
import { stages, formatDepth } from "./stages";

/** Open/closed mark for the mobile dive-profile sheet. */
function ChevronMark({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={14}
      height={14}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden="true"
      className={`text-thermocline transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="M5 15l7-7 7 7" />
    </svg>
  );
}

/**
 * The depth axis. It rules every line of copy on the page and is the only
 * navigation: sections are dive stages, and scroll position is depth.
 *
 * One synchronized scrub drives all of it — active stage, live depth, and
 * which stages you have already passed (they stay lit behind you rather than
 * resetting). Rendered as a fixed rail on desktop and a compact readout strip
 * on narrow screens.
 */
export default function DepthRail() {
  const [depth, setDepth] = useState(0);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const read = () => {
      frame.current = 0;
      const mid = window.innerHeight * 0.42;

      const boxes = stages.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, height: r.height };
      });

      let idx = 0;
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        if (b && b.top <= mid) idx = i;
      }

      // The readout must agree with the stage the rail is lighting. Hold the
      // current stage's own depth across the middle of its section and only
      // travel in the outer quarters, so a lit "60 TURNAROUND" never sits
      // beside a reading of 052.8 — the page's central instrument contradicting
      // its own label.
      const b = boxes[idx];
      let d = stages[idx].depth;
      if (b && b.height > 0) {
        const t = Math.min(1, Math.max(0, (mid - b.top) / b.height));
        const here = stages[idx].depth;
        const prev = stages[idx - 1];
        const next = stages[idx + 1];
        if (t < 0.25 && prev) {
          d = prev.depth + (here - prev.depth) * (t / 0.25);
        } else if (t > 0.75 && next) {
          d = here + (next.depth - here) * ((t - 0.75) / 0.25);
        }
      }

      setActive(idx);
      setDepth(d);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const descending = active < 5;

  return (
    <>
      {/* ---- Desktop: the full profile, fixed to the left margin ---------- */}
      <nav
        aria-label="Dive profile"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-screen w-rail flex-col justify-center pl-margin-mobile xl:flex"
      >
        <div className="pointer-events-auto flex flex-col gap-0 border-l border-hairline pl-4">
          <div className="mb-5 flex flex-col gap-1.5">
            <span className="font-data text-[0.5625rem] uppercase tracking-[0.16em] text-snow-faint">
              Depth
            </span>
            <span className="font-data tabular text-[1.375rem] leading-none text-thermocline">
              {formatDepth(depth)}
              <span className="ml-1 text-[0.5rem] tracking-[0.1em] text-snow-faint">
                M
              </span>
            </span>
          </div>

          <ol className="flex flex-col">
            {stages.map((s, i) => {
              const isActive = i === active;
              // Index alone. Interpolated depth never lands exactly on a
              // stage's value, so testing it against the deepest depth seen
              // left the deepest stage permanently unlit.
              const passed = i < active;
              return (
                <li
                  key={s.id}
                  data-passed={passed || isActive}
                  className="rail-stage relative flex items-center gap-3 py-[7px]"
                >
                  <span
                    className="rail-stage-line absolute left-[-17px] top-0 h-full w-px"
                    style={{
                      backgroundColor:
                        passed || isActive ? undefined : "transparent",
                    }}
                  />
                  <a
                    href={`#${s.id}`}
                    className="group flex items-center gap-3 focus-visible:outline-offset-4"
                  >
                    <span
                      aria-hidden="true"
                      className={`rail-tick block h-px transition-all duration-300 ${
                        isActive
                          ? "w-6 bg-thermocline"
                          : passed
                            ? "w-3.5 bg-thermocline-dim"
                            : "w-2.5 bg-hairline-lit group-hover:w-4 group-hover:bg-snow-faint"
                      }`}
                    />
                    <span
                      className={`font-data tabular text-[0.5625rem] tracking-[0.12em] transition-colors duration-200 ${
                        isActive
                          ? "text-thermocline"
                          : passed
                            ? "text-snow-dim"
                            : "text-snow-faint group-hover:text-snow-dim"
                      }`}
                    >
                      {String(s.depth).padStart(2, "0")}
                    </span>
                    <span
                      className={`whitespace-nowrap font-data text-[0.5625rem] uppercase tracking-[0.14em] transition-colors duration-200 ${
                        isActive
                          ? "text-snow"
                          : "text-snow-faint group-hover:text-snow-dim"
                      }`}
                    >
                      {s.name}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 flex items-center gap-2 border-t border-hairline pt-3">
            <span
              aria-hidden="true"
              className={`block h-1.5 w-1.5 ${
                descending ? "bg-thermocline" : "bg-kelp"
              }`}
            />
            <span className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
              {descending ? "Descending" : "Ascending"}
            </span>
          </div>
        </div>
      </nav>

      {/* ---- Narrow screens: the readout, and the only navigation ----------
          Below lg the nav links are hidden, so without this the whole dive
          profile is unreachable on a phone. Tapping opens the stage list. */}
      <div className="fixed bottom-0 left-0 z-40 w-full border-t border-hairline bg-abyss/90 backdrop-blur-sm xl:hidden">
        {open && (
          <ol
            id="dive-profile-sheet"
            className="mx-auto max-h-[55vh] max-w-container-max overflow-y-auto border-b border-hairline px-margin-mobile py-2"
          >
            {stages.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 border-b border-hairline/60 py-3 last:border-b-0"
                >
                  <span
                    className={`font-data tabular text-[0.625rem] tracking-[0.12em] ${
                      i === active ? "text-thermocline" : "text-snow-faint"
                    }`}
                  >
                    {String(s.depth).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-data text-[0.625rem] uppercase tracking-[0.14em] ${
                      i === active ? "text-snow" : "text-snow-dim"
                    }`}
                  >
                    {s.name}
                  </span>
                  <span className="ml-auto font-body text-[0.75rem] text-snow-faint">
                    {s.note}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="dive-profile-sheet"
          className="mx-auto flex w-full max-w-container-max items-center justify-between gap-4 px-margin-mobile py-3 text-left"
        >
          <span className="flex items-center gap-2.5">
            <ChevronMark open={open} />
            <span className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
              {open ? "Close dive profile" : stages[active].name}
            </span>
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-data tabular text-[0.9375rem] leading-none text-thermocline">
              {formatDepth(depth)}
            </span>
            <span className="font-data text-[0.5rem] tracking-[0.1em] text-snow-faint">
              M
            </span>
          </span>
        </button>

        <div
          aria-hidden="true"
          className="h-px w-full"
          style={{
            background: `linear-gradient(to right, var(--thermocline) ${(depth / 60) * 100}%, var(--hairline) ${(depth / 60) * 100}%)`,
          }}
        />
      </div>
    </>
  );
}
