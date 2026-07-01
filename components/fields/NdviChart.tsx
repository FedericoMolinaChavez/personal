"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { NdviPoint } from "@/lib/fields/readings";

const AXIS = { fontSize: 11, fill: "#8B9880" } as const;
const TOOLTIP = {
  background: "#121711",
  border: "1px solid #26301C",
  borderRadius: 8,
  color: "#E6EEDD",
} as const;

export default function NdviChart({ points }: { points: NdviPoint[] }) {
  if (!points.length) {
    return (
      <p className="text-body-md text-cmd-muted">
        No NDVI readings yet — refresh data to pull the satellite history.
      </p>
    );
  }

  const data = points.map((p) => ({
    date: p.captured_on,
    ndvi: p.ndvi_mean,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="ndviFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A3E635" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#A3E635" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#26301C" />
          <XAxis dataKey="date" tick={AXIS} stroke="#26301C" minTickGap={24} />
          <YAxis domain={[0, 1]} tick={AXIS} stroke="#26301C" />
          <Tooltip contentStyle={TOOLTIP} labelStyle={{ color: "#8B9880" }} />
          <Area
            type="monotone"
            dataKey="ndvi"
            stroke="#A3E635"
            strokeWidth={2}
            fill="url(#ndviFill)"
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
