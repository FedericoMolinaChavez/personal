/**
 * Authored icon set for the dive world. One stroke weight (1.5), one cap and
 * join, one 24-unit grid — drawn rather than borrowed, because the marketing
 * surface no longer loads an icon font.
 */

type IconProps = {
  className?: string;
  size?: number;
};

function Svg({
  className = "",
  size = 20,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Continue — the dive world's forward motion. */
export function ArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </Svg>
  );
}

/** Leaves the dive — an external observation. */
export function ArrowOut(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 16L18 6" />
      <path d="M9 6h9v9" />
    </Svg>
  );
}

/** Descend. */
export function ArrowDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4v15" />
      <path d="M6 13l6 6 6-6" />
    </Svg>
  );
}

/** Logged / verified. */
export function Check(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12.5l5 5L20 6.5" />
    </Svg>
  );
}

/** The dive lamp. */
export function Lamp(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="9" width="6" height="6" />
      <path d="M9 10.5l12-5.5v14L9 13.5" />
    </Svg>
  );
}

/** Gas supply. */
export function Cylinder(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="8" y="6" width="8" height="14" />
      <path d="M11 6V3h2v3" />
      <path d="M8 11h8" />
    </Svg>
  );
}

/** Pressure / depth gauge. */
export function Gauge(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12l4-3" />
      <path d="M12 4v2M20 12h-2M12 20v-2M4 12h2" />
    </Svg>
  );
}

/** Sounding — the depth axis. */
export function Sounding(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3v14" />
      <path d="M8 17h8l-4 4z" />
      <path d="M9 7h6M9 11h6" />
    </Svg>
  );
}

/** Transmission — orchestration between agents. */
export function Relay(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M5 5l3.5 3.5M19 5l-3.5 3.5M5 19l3.5-3.5M19 19l-3.5-3.5" />
      <circle cx="4" cy="4" r="1.5" />
      <circle cx="20" cy="4" r="1.5" />
      <circle cx="4" cy="20" r="1.5" />
      <circle cx="20" cy="20" r="1.5" />
    </Svg>
  );
}

/** Hull integrity — the app around the model. */
export function Hull(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 10V7l8-3 8 3v3c0 5.5-3.4 8.8-8 10-4.6-1.2-8-4.5-8-10z" />
      <path d="M9.5 12l2 2 3.5-4" />
    </Svg>
  );
}
