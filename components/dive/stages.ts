/**
 * The dive profile. Every section of the landing page is a stage of one
 * descent, and every claim on the page is pinned to the depth it happens at.
 *
 * `id` doubles as the section anchor. The legacy anchors (#work, #expertise,
 * #offer, #pitch, #contact, #booking, #scorecard) are preserved here because
 * the nav, the sibling routes and ScheduleCallButton all link to them.
 */
export type Stage = {
  /** Section anchor id. */
  id: string;
  /** Depth in metres — the rail's ordinate and the page's ordering. */
  depth: number;
  /** Stage name, as a dive plan writes it. */
  name: string;
  /** What happens here. */
  note: string;
  /** Descending or ascending half of the dive. */
  leg: "down" | "up";
};

export const stages: Stage[] = [
  {
    id: "top",
    depth: 0,
    name: "Surface",
    note: "Enter water, check systems",
    leg: "down",
  },
  {
    id: "break",
    depth: 18,
    name: "Thermocline",
    note: "Where the demo stops holding",
    leg: "down",
  },
  {
    id: "expertise",
    depth: 30,
    name: "Reef ledge",
    note: "Structure, surge, life",
    leg: "down",
  },
  {
    id: "work",
    depth: 45,
    name: "Mesophotic wall",
    note: "Shipped, and one killed",
    leg: "down",
  },
  {
    id: "offer",
    depth: 60,
    name: "Turnaround",
    note: "Maximum depth — decide",
    leg: "down",
  },
  {
    id: "scorecard",
    depth: 36,
    name: "Ascent stop 1",
    note: "Score your own app",
    leg: "up",
  },
  {
    id: "pitch",
    depth: 6,
    name: "Ascent stop 2",
    note: "Name your own price",
    leg: "up",
  },
  {
    id: "contact",
    depth: 0,
    name: "Surface & log",
    note: "Book the call",
    leg: "up",
  },
];

export const MAX_DEPTH = 60;

/** Formats a depth the way a dive computer does: 040.0. */
export function formatDepth(m: number): string {
  return m.toFixed(1).padStart(5, "0");
}
