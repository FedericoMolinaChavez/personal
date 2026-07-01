"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw"; // augments L with Control.Draw / Draw.Event (typed via @types/leaflet-draw)
import type { PolygonGeometry } from "@/lib/fields/schema";

/** Adds a polygon-only draw control; reports the drawn polygon as GeoJSON. */
function DrawControl({
  onChange,
}: {
  onChange: (g: PolygonGeometry | null) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const drawn = new L.FeatureGroup();
    map.addLayer(drawn);

    const control = new L.Control.Draw({
      position: "topright",
      draw: {
        polygon: {},
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: { featureGroup: drawn, remove: true },
    });
    map.addControl(control);

    function onCreated(e: L.LeafletEvent) {
      const layer = (e as L.DrawEvents.Created).layer as L.Polygon;
      drawn.clearLayers();
      drawn.addLayer(layer);
      onChange(layer.toGeoJSON().geometry as unknown as PolygonGeometry);
    }
    function onDeleted() {
      if (drawn.getLayers().length === 0) onChange(null);
    }

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.DELETED, onDeleted);
    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.DELETED, onDeleted);
      map.removeControl(control);
      map.removeLayer(drawn);
    };
  }, [map, onChange]);

  return null;
}

export default function DrawMap({
  onChange,
}: {
  onChange: (g: PolygonGeometry | null) => void;
}) {
  return (
    <MapContainer
      center={[-31.4, -60.5]}
      zoom={6}
      scrollWheelZoom
      className="h-[360px] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DrawControl onChange={onChange} />
    </MapContainer>
  );
}
