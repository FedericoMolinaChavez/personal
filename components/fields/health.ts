import type { Health } from "@/lib/fields/schema";

/** Hex colors for the map polygons (Leaflet pathOptions need strings). */
export const HEALTH_HEX: Record<Health, string> = {
  green: "#2e7d32",
  orange: "#ed8a19",
  red: "#c62828",
  unknown: "#9e9e9e",
};

export const HEALTH_LABEL: Record<Health, string> = {
  green: "Healthy",
  orange: "Watch",
  red: "Declining",
  unknown: "No data",
};

/** Static Tailwind class strings per health state (JIT-safe, no interpolation). */
export const HEALTH_BADGE: Record<Health, string> = {
  green: "border border-cmd-accent/30 bg-cmd-accent/10 text-cmd-accent",
  orange: "border border-cmd-amber/30 bg-cmd-amber/10 text-cmd-amber",
  red: "border border-cmd-danger/30 bg-cmd-danger/10 text-cmd-danger",
  unknown: "border border-cmd-line bg-cmd-surface2 text-cmd-muted",
};
