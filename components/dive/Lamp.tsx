"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True when this client has no lamp: coarse pointer, or reduced motion. The
 * hint and the lamp read the same test, so they can never disagree.
 */
function useHandheld() {
  const [handheld, setHandheld] = useState(true);
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setHandheld(!fine.matches || still.matches);
    decide();
    fine.addEventListener("change", decide);
    still.addEventListener("change", decide);
    return () => {
      fine.removeEventListener("change", decide);
      still.removeEventListener("change", decide);
    };
  }, []);
  return handheld;
}

/**
 * The instruction to move the lamp. Renders nothing where there is no lamp —
 * on touch and under reduced motion the wall is already at true colour, and
 * telling those readers to move a lamp describes a page they cannot see.
 */
export function LampHint({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const handheld = useHandheld();
  if (handheld) return null;
  return <p className={className}>{children}</p>;
}

/**
 * THE signature interaction, and the only authored motion moment on the page.
 *
 * At forty metres the warm end of the spectrum is gone: everything on the wall
 * reads blue-grey and, crucially, fine. Put a lamp on it and the true colour
 * comes back. That is the whole pitch — your system looks healthy until
 * somebody actually goes down and looks at it — so the page makes the visitor
 * do the looking.
 *
 * Mechanically: two stacked copies of the same children. The lower copy is
 * desaturated; the upper copy is true colour, revealed through a radial mask
 * that follows the pointer. Pointer writes CSS variables only, so nothing
 * re-renders per frame.
 *
 * Without a fine pointer (touch), and under reduced motion, the lamp opens
 * wide and stays put: the content is never gated behind a hover.
 */
export default function Lamp({
  children,
  className = "",
  radius = 300,
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const handheld = useHandheld();

  useEffect(() => {
    const el = host.current;
    if (!el || handheld) return;

    const apply = () => {
      frame.current = 0;
      const p = pending.current;
      if (!p) return;
      el.style.setProperty("--lamp-x", `${p.x}px`);
      el.style.setProperty("--lamp-y", `${p.y}px`);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pending.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!frame.current) frame.current = requestAnimationFrame(apply);
    };

    const onEnter = () => el.style.setProperty("--lamp-r", `${radius}px`);
    const onLeave = () => el.style.setProperty("--lamp-r", "0px");

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [handheld, radius]);

  // Touch and reduced-motion: no drained layer at all, everything true colour,
  // and no instruction to move a lamp that isn't there.
  if (handheld) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={host}
      className={`relative ${className}`}
      data-lamp="true"
      style={
        {
          "--lamp-r": "0px",
          "--lamp-x": "50%",
          "--lamp-y": "40%",
        } as React.CSSProperties
      }
    >
      {/* Drained: how the wall looks with no light on it. This copy is the
          real one — it carries the semantics, the focus order and every click,
          because a CSS mask makes its own transparent regions un-hittable and
          anything important must never sit behind one. */}
      <div className="lamp-drained">{children}</div>

      {/* True colour, revealed only inside the cone. Purely visual: hidden
          from assistive tech, removed from the focus order, click-through. */}
      <div
        className="lamp-true pointer-events-none absolute inset-0"
        aria-hidden="true"
        inert
      >
        {children}
      </div>

      {/* The light itself, so the beam is visible and not only its effect. */}
      <div
        aria-hidden="true"
        className="lamp-cone pointer-events-none absolute inset-0"
      />
    </div>
  );
}
