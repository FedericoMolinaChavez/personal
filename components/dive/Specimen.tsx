/**
 * Specimens of the mesophotic wall, drawn rather than photographed.
 *
 * Geometry is generated once at module load from a fixed seed, so the server
 * and the client render byte-identical paths and hydration stays quiet.
 */

/** Deterministic PRNG — same sequence everywhere, every build. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Branch = { d: string; w: number };

/**
 * Antipatharia — black coral. A fan of thinning branches, the wall's signature
 * organism and the reason anyone descends this far.
 */
function growCoral(seed: number, spread: number): Branch[] {
  const rand = rng(seed);
  const out: Branch[] = [];

  function grow(
    x: number,
    y: number,
    angle: number,
    len: number,
    depth: number,
  ) {
    if (depth === 0 || len < 3) return;
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    // Slight bow, so branches read as grown rather than plotted.
    const cx = x + Math.cos(angle - 0.28) * len * 0.55;
    const cy = y + Math.sin(angle - 0.28) * len * 0.55;
    out.push({
      d: `M${x.toFixed(1)},${y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`,
      w: Math.max(0.35, depth * 0.34),
    });

    const forks = depth > 3 ? 2 : rand() > 0.35 ? 2 : 1;
    for (let i = 0; i < forks; i++) {
      const dir = i === 0 ? -1 : 1;
      const jitter = (rand() - 0.5) * 0.3;
      grow(
        x2,
        y2,
        angle + dir * spread * (0.55 + rand() * 0.6) + jitter,
        len * (0.66 + rand() * 0.14),
        depth - 1,
      );
    }
  }

  // Depth 5 keeps a coral at ~31 paths. Depth 6 doubles that, and these are
  // rendered several times per page (twice more again inside the lamp).
  grow(60, 118, -Math.PI / 2, 34, 5);
  return out;
}

const CORAL_A = growCoral(9137, 0.52);
const CORAL_B = growCoral(4421, 0.62);

export function BlackCoral({
  className = "",
  variant = "a",
}: {
  className?: string;
  variant?: "a" | "b";
}) {
  const branches = variant === "a" ? CORAL_A : CORAL_B;
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {branches.map((b, i) => (
        <path key={i} d={b.d} strokeWidth={b.w} />
      ))}
    </svg>
  );
}

/**
 * Hexactinellida — glass sponge. A silica lattice: rigid, porous, and the
 * thing that keeps standing when everything soft has been stripped off.
 */
const SPONGE_CELLS = (() => {
  const rand = rng(2287);
  const cells: { cx: number; cy: number; r: number }[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 5; col++) {
      const inset = Math.abs(row - 4) * 1.4;
      const cx = 34 + col * 13 + (row % 2 ? 6.5 : 0) + inset * 0.4;
      const cy = 22 + row * 11;
      if (cx < 30 + inset || cx > 92 - inset) continue;
      cells.push({ cx, cy, r: 3.1 + rand() * 1.5 });
    }
  }
  return cells;
})();

export function GlassSponge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M40 116 C34 82 33 46 44 16 L76 16 C87 46 86 82 80 116 Z"
        strokeWidth={1.5}
      />
      <path d="M44 16 C52 11 68 11 76 16" strokeWidth={1.5} />
      {SPONGE_CELLS.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} strokeWidth={0.9} />
      ))}
    </svg>
  );
}
