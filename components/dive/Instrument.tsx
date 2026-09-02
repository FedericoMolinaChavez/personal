import { ArrowRight } from "./Icon";

/* ---------------------------------------------------------------------------
   The dive world's shared instrument vocabulary. Every control on the
   marketing surface is built from these, so nothing arrives as a stock shape.
   ------------------------------------------------------------------------- */

/** Tracked-out uppercase label — the engraving on a panel. */
export function RuleLabel({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "div" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-data text-label rule-label text-thermocline ${className}`}
    >
      {children}
    </Tag>
  );
}

/** A dive-computer readout: big mono value, small unit. */
export function Readout({
  value,
  unit,
  label,
  size = "lg",
  tone = "thermocline",
}: {
  value: string;
  unit?: string;
  label: string;
  size?: "lg" | "sm";
  tone?: "thermocline" | "snow" | "coral";
}) {
  const toneClass =
    tone === "coral"
      ? "text-coral"
      : tone === "snow"
        ? "text-snow"
        : "text-thermocline";
  return (
    <div className="flex flex-col gap-2">
      <span className="font-data text-label rule-label text-snow-faint">
        {label}
      </span>
      <span
        className={`font-data tabular ${toneClass} ${
          size === "lg" ? "text-readout" : "text-readout-sm"
        }`}
      >
        {value}
        {unit && (
          <span className="ml-1.5 align-baseline text-[0.34em] tracking-[0.1em] text-snow-faint">
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}

/** Hairline-boxed module — this world's only container. Never nested. */
export function Module({
  children,
  className = "",
  lit = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  lit?: boolean;
  as?: "div" | "li" | "article" | "section";
}) {
  return (
    <Tag className={`module ${lit ? "module-lit" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

/** The header strip every module carries, as on the panel. */
export function ModuleHeader({
  label,
  right,
}: {
  label: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3">
      <span className="font-data text-label rule-label text-snow-faint">
        {label}
      </span>
      {right && (
        <span className="font-data text-label rule-label tabular text-thermocline">
          {right}
        </span>
      )}
    </div>
  );
}

/**
 * A strip of measured values along the foot of a module — the panel's data row.
 */
export function DataStrip({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl className="grid grid-cols-3 border-t border-hairline">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`px-4 py-3 ${i > 0 ? "border-l border-hairline" : ""}`}
        >
          <dt className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
            {item.label}
          </dt>
          <dd className="mt-1.5 font-data tabular text-[0.8125rem] text-snow">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const baseControl =
  "group inline-flex items-center justify-between gap-6 px-6 py-3.5 font-data text-label rule-label transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed";

/** Filled thermocline — the lamp is always on the primary action. */
export const primaryControl = `${baseControl} bg-thermocline text-abyss hover:bg-[#5AE6F2] cursor-pointer`;

/** Hairline box — everything secondary. */
export const secondaryControl = `${baseControl} border border-hairline-lit text-snow hover:bg-sea-cold hover:border-thermocline cursor-pointer`;

/** The arrow that rides in every control, nudging on hover. */
export function ControlArrow() {
  return (
    <ArrowRight
      size={16}
      className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
    />
  );
}
