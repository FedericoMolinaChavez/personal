"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeatherPoint } from "@/lib/fields/readings";

const AXIS = { fontSize: 11, fill: "#8B9880" } as const;
const TOOLTIP = {
  background: "#121711",
  border: "1px solid #26301C",
  borderRadius: 8,
  color: "#E6EEDD",
} as const;

export default function WeatherChart({ points }: { points: WeatherPoint[] }) {
  if (!points.length) {
    return <p className="text-body-md text-cmd-muted">No weather data yet.</p>;
  }

  const data = points.map((p) => ({
    date: p.observed_on.slice(5), // MM-DD
    precip: p.precip_mm,
    temp: p.temp_c,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#26301C" />
          <XAxis dataKey="date" tick={AXIS} stroke="#26301C" minTickGap={20} />
          <YAxis yAxisId="left" tick={AXIS} stroke="#26301C" />
          <YAxis yAxisId="right" orientation="right" tick={AXIS} stroke="#26301C" />
          <Tooltip contentStyle={TOOLTIP} labelStyle={{ color: "#8B9880" }} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#8B9880" }} />
          <Bar
            yAxisId="left"
            dataKey="precip"
            name="Rain (mm)"
            fill="#A3E635"
            radius={[2, 2, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="temp"
            name="Max °C"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
