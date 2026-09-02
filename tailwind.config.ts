import type { Config } from "tailwindcss";

/**
 * The marketing site runs the "Mesophotic Descent" world: a technical dive down
 * a volcanic island wall. Ground colour deepens by dive stage, one thermocline
 * cyan marks the active depth, and warm colour is the thing that drains with
 * depth — restored only where the lamp falls.
 *
 * The `cmd` scale below belongs to the /tools app ("Command" theme) and is
 * deliberately untouched by this world; the two never share a surface.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Dive stages: the ground, deepening by depth -------------------
        "sea-lit": "#0E3247", //  0m  sunlit tip
        "sea-mid": "#081626", //  0–30m  midnight depth
        "sea-cold": "#10243A", // 30m–thermocline  cold depth
        "sea-meso": "#071A2E", // 40–200m  mesophotic blue
        "sea-deep": "#04121F", // turnaround depth
        abyss: "#02060D", // >200m  abyssal blue
        "abyss-ink": "#050A14", // base

        // ---- Signal ---------------------------------------------------------
        thermocline: "#23D6E6", // the active-depth band, and every primary action
        "thermocline-dim": "#16899A",
        coral: "#FF6B4A", // the warm that drains; error, and restored colour
        kelp: "#6FD79B", // ready / affirmative

        // ---- Ink ------------------------------------------------------------
        snow: "#F4F6FA", // marine snow — primary text and particles
        "snow-dim": "#9FB6C4", // secondary text (8.3:1 on sea-meso)
        "snow-faint": "#7994A6", // tertiary text (5.6:1 on sea-meso)
        hairline: "#17334A", // 1px structure
        "hairline-lit": "#26536F", // 1px structure, lit side

        // ---- Legacy Material-3 names -----------------------------------------
        // Still referenced by /scorecard, /terms, /success, /cancel and the
        // booking embed. Remapped onto the dive system so those routes stay
        // legible and on-world; the landing page uses the scale above.
        surface: "#071A2E",
        background: "#071A2E",
        "surface-container-lowest": "#02060D",
        "surface-container-low": "#04121F",
        "surface-container": "#081626",
        "surface-container-high": "#10243A",
        "surface-container-highest": "#173248",
        "on-surface": "#F4F6FA",
        "on-background": "#F4F6FA",
        "on-surface-variant": "#9FB6C4",
        primary: "#23D6E6",
        "on-primary": "#02060D",
        "primary-container": "#10243A",
        "on-primary-container": "#23D6E6",
        "secondary-container": "#0E2A3E",
        "on-secondary-container": "#F4F6FA",
        "outline-variant": "#17334A",
        error: "#FF6B4A",

        // ---- /tools "Command" theme — untouched ------------------------------
        cmd: {
          bg: "#0B0F0A",
          surface: "#121711",
          surface2: "#181F15",
          line: "#26301C",
          "line-strong": "#3A4A2A",
          text: "#E6EEDD",
          muted: "#8B9880",
          accent: "#A3E635",
          "accent-strong": "#BEF264",
          "accent-dim": "#65A30D",
          amber: "#F59E0B",
          info: "#7DD3FC",
          danger: "#F87171",
          "on-accent": "#0B0F0A",
        },
      },

      // Instruments are machined, not rounded. 2px is the whole radius system.
      borderRadius: {
        DEFAULT: "2px",
        lg: "2px",
        xl: "3px",
        full: "9999px",
      },

      spacing: {
        gutter: "24px",
        "margin-desktop": "40px",
        "margin-mobile": "20px",
        rail: "208px",
      },

      maxWidth: {
        "container-max": "1280px",
        measure: "68ch",
      },

      fontFamily: {
        // Display: expedition lettering, condensed and machined.
        display: ["var(--font-saira)", "ui-sans-serif", "system-ui", "sans-serif"],
        // Body: a quiet grotesk that stays out of the way.
        body: ["var(--font-archivo)", "ui-sans-serif", "system-ui", "sans-serif"],
        // Data: dive-computer readouts. Measurement only, never prose.
        data: ["var(--font-martian)", "ui-monospace", "SFMono-Regular", "monospace"],
        // Legacy aliases used by sibling marketing routes.
        "label-md": ["var(--font-martian)", "ui-monospace", "monospace"],
        "label-sm": ["var(--font-martian)", "ui-monospace", "monospace"],
        "body-md": ["var(--font-archivo)", "sans-serif"],
        "body-lg": ["var(--font-archivo)", "sans-serif"],
        "headline-md": ["var(--font-saira)", "sans-serif"],
        "headline-lg": ["var(--font-saira)", "sans-serif"],
        mono: ["var(--font-martian)", "ui-monospace", "monospace"],
      },

      fontSize: {
        // Dive-computer readouts
        readout: ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "0.9", letterSpacing: "-0.03em", fontWeight: "600" }],
        "readout-sm": ["1.5rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "600" }],
        // Tracked-out instrument labels
        label: ["0.6875rem", { lineHeight: "1.1", letterSpacing: "0.16em", fontWeight: "600" }],
        "label-lg": ["0.8125rem", { lineHeight: "1.2", letterSpacing: "0.12em", fontWeight: "500" }],
        // Display
        hero: ["clamp(3rem, 9vw, 6rem)", { lineHeight: "0.92", letterSpacing: "-0.025em", fontWeight: "700" }],
        stage: ["clamp(2rem, 5vw, 3.25rem)", { lineHeight: "1.0", letterSpacing: "-0.02em", fontWeight: "700" }],
        // Prose
        lede: ["clamp(1.0625rem, 1.6vw, 1.25rem)", { lineHeight: "1.6", fontWeight: "400" }],
        prose: ["1.0625rem", { lineHeight: "1.65", fontWeight: "400" }],
        // Legacy aliases
        "label-md": ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.12em", fontWeight: "600" }],
        display: ["clamp(2rem, 5vw, 3.25rem)", { lineHeight: "1.0", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["2rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["1.75rem", { lineHeight: "1.15", fontWeight: "700" }],
        "headline-md": ["1.375rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};

export default config;
