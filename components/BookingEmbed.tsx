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
        // The dive world is dark and the booking instrument sits inside it —
        // a light widget here reads as a third-party panel dropped onto the
        // page. Brand colour is the thermocline, like every other action.
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#23D6E6" },
          dark: { "cal-brand": "#23D6E6" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="module w-full overflow-hidden">
      <Cal
        calLink={CAL_LINK}
        style={{ width: "100%", height: "100%", minHeight: "600px" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
