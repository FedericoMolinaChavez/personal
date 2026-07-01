"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GeoJSON, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { GeoJsonObject } from "geojson";
import type { FieldMapItem } from "./FieldHealthMap";
import { HEALTH_HEX, HEALTH_LABEL } from "./health";

/** Fit the map to all field polygons once they're mounted. */
function FitBounds({ fields }: { fields: FieldMapItem[] }) {
  const map = useMap();
  useEffect(() => {
    const latlngs: [number, number][] = [];
    for (const f of fields) {
      for (const pos of f.geometry?.coordinates?.[0] ?? []) {
        latlngs.push([pos[1], pos[0]]); // GeoJSON is [lng,lat]; Leaflet wants [lat,lng]
      }
    }
    if (latlngs.length) map.fitBounds(latlngs, { padding: [24, 24] });
  }, [fields, map]);
  return null;
}

export default function FieldHealthMapInner({
  fields,
}: {
  fields: FieldMapItem[];
}) {
  const router = useRouter();
  const drawable = fields.filter((f) => f.geometry);

  return (
    <MapContainer
      center={[-31.4, -60.5]}
      zoom={5}
      scrollWheelZoom={false}
      className="h-[420px] w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {drawable.map((f) => (
        <GeoJSON
          key={f.id}
          data={f.geometry as unknown as GeoJsonObject}
          pathOptions={{
            color: HEALTH_HEX[f.health],
            weight: 2,
            fillColor: HEALTH_HEX[f.health],
            fillOpacity: 0.35,
          }}
          eventHandlers={{ click: () => router.push(`/tools/fields/${f.id}`) }}
        >
          <Tooltip sticky>
            {f.name} — {HEALTH_LABEL[f.health]}
          </Tooltip>
        </GeoJSON>
      ))}
      <FitBounds fields={drawable} />
    </MapContainer>
  );
}
