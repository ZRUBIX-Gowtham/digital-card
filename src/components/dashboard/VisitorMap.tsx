"use client";

import { useEffect, useRef } from "react";
import type { GeoPoint } from "@/lib/analytics-store";

/**
 * Interactive map of where visitors opened the card. Leaflet is loaded from a
 * CDN on demand (no npm dependency, no cost when the page isn't opened) and each
 * cluster of visits is drawn as a proportionally sized marker.
 */
export function VisitorMap({ points, accent }: { points: GeoPoint[]; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: LeafletMap | undefined;
    let cancelled = false;

    (async () => {
      const L = await loadLeaflet();
      if (cancelled || !ref.current || !L) return;

      map = L.map(ref.current, {
        attributionControl: false,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      if (points.length) {
        // Geo-IP is city-level, so many visitors share (near-)identical
        // coordinates. Scatter each dot slightly (~1km) so every visitor shows
        // up as its own point instead of stacking into one.
        const markers = points.map((p) =>
          L.circleMarker(jitter(p.lat, p.lng), {
            radius: 5,
            color: accent,
            fillColor: accent,
            fillOpacity: 0.5,
            weight: 1,
          }).bindPopup(`<strong>${escapeHtml(p.label)}</strong>`),
        );
        const group = L.featureGroup(markers).addTo(map);
        map.fitBounds(group.getBounds().pad(0.3), { maxZoom: 11 });
      } else {
        map.setView([20, 0], 1);
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [points, accent]);

  return (
    <div
      ref={ref}
      className="h-72 w-full overflow-hidden rounded-xl border border-border bg-surface-2/40"
      role="img"
      aria-label="Map of visitor locations"
    />
  );
}

/** Nudge a point by up to ~1km in a random direction so co-located dots spread. */
function jitter(lat: number, lng: number): [number, number] {
  const d = 0.01; // ~1.1km in latitude degrees
  return [lat + (Math.random() - 0.5) * d, lng + (Math.random() - 0.5) * d];
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

// --- Leaflet CDN loader ----------------------------------------------------

const LEAFLET_VERSION = "1.9.4";
let leafletPromise: Promise<Leaflet | undefined> | undefined;

function loadLeaflet(): Promise<Leaflet | undefined> {
  if (typeof window === "undefined") return Promise.resolve(undefined);
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise<Leaflet | undefined>((resolve) => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
      document.head.appendChild(link);
    }

    const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      return;
    }

    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => resolve(undefined);
    document.head.appendChild(script);
  });

  return leafletPromise;
}

// Minimal typings for the slice of the Leaflet global we use (loaded at runtime).
type LatLng = [number, number];
interface LeafletLayer {
  addTo(map: LeafletMap): this;
  bindPopup(html: string): this;
}
interface LeafletFeatureGroup extends LeafletLayer {
  getBounds(): { pad(n: number): unknown };
}
interface LeafletMap {
  remove(): void;
  setView(center: LatLng, zoom: number): this;
  fitBounds(bounds: unknown, opts?: { maxZoom?: number }): this;
}
interface Leaflet {
  map(el: HTMLElement, opts: Record<string, unknown>): LeafletMap;
  tileLayer(url: string, opts: Record<string, unknown>): LeafletLayer;
  circleMarker(latlng: LatLng, opts: Record<string, unknown>): LeafletLayer;
  featureGroup(layers: LeafletLayer[]): LeafletFeatureGroup;
}

declare global {
  interface Window {
    L?: Leaflet;
  }
}
