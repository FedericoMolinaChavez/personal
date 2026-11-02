"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAttribution } from "@/lib/marketing/attribution";

export default function AttributionCapture() {
  const pathname = usePathname();
  useEffect(() => { getAttribution(); }, [pathname]);
  return null;
}
