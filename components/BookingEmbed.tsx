"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const CAL_LINK =
  process.env.NEXT_PUBLIC_CALCOM_LINK || "placeholder/consultation";

export default function BookingEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#8f4538" },
          dark: { "cal-brand": "#8f4538" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest soil-shadow">
      <Cal
        calLink={CAL_LINK}
        style={{ width: "100%", height: "100%", minHeight: "600px" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
