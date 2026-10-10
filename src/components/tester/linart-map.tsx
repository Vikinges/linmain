"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"
import type * as Leaflet from "leaflet"

export type MapPoint = { lat: number; lng: number }
export type MapMarker = MapPoint & { id: string; title: string; color?: string }

type LinartMapProps = {
  /** The editable pin (form). Click on the map or drag the pin to move it. */
  pin?: MapPoint | null
  onPick?: (point: MapPoint) => void
  /** Read-only markers (admin overview). */
  markers?: MapMarker[]
  onMarkerClick?: (id: string) => void
  /** Pan/zoom here whenever it changes. */
  focus?: (MapPoint & { zoom?: number }) | null
  className?: string
  scrollWheelZoom?: boolean
}

// OpenStreetMap standard tiles (free for low traffic with attribution, see the OSMF tile policy), turned dark
// with a CSS filter (.linart-dark-tiles in globals.css) so the map matches the site.
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'

// Bavaria / central Europe: where the first hosts are.
const DEFAULT_VIEW: [number, number] = [48.6, 11.2]
const DEFAULT_ZOOM = 5

function pinHtml(color: string, size: number) {
  return `<div style="position:relative;width:${size}px;height:${size}px;">
    <div style="position:absolute;inset:0;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      background:linear-gradient(135deg, ${color}, #0b1220 160%);border:2px solid rgba(255,255,255,.9);
      box-shadow:0 6px 18px rgba(0,0,0,.55), 0 0 0 6px ${color}33;"></div>
    <div style="position:absolute;left:50%;top:50%;width:${Math.round(size / 3)}px;height:${Math.round(size / 3)}px;
      margin:-${Math.round(size / 6)}px 0 0 -${Math.round(size / 6)}px;border-radius:50%;background:#fff;"></div>
  </div>`
}

export function LinartMap({
  pin,
  onPick,
  markers,
  onMarkerClick,
  focus,
  className,
  scrollWheelZoom = true,
}: LinartMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)
  const leafletRef = useRef<typeof Leaflet | null>(null)
  const pinRef = useRef<Leaflet.Marker | null>(null)
  const layerRef = useRef<Leaflet.LayerGroup | null>(null)
  const fittedRef = useRef(false)
  // Keep the latest callbacks without re-creating the map.
  const onPickRef = useRef(onPick)
  const onMarkerClickRef = useRef(onMarkerClick)
  useEffect(() => {
    onPickRef.current = onPick
    onMarkerClickRef.current = onMarkerClick
  }, [onPick, onMarkerClick])

  // Create the map once.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const L = (await import("leaflet")).default
      if (cancelled || !containerRef.current || mapRef.current) return
      leafletRef.current = L
      const map = L.map(containerRef.current, {
        center: DEFAULT_VIEW,
        zoom: DEFAULT_ZOOM,
        scrollWheelZoom,
        worldCopyJump: true,
      })
      L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19, className: "linart-dark-tiles" }).addTo(map)
      layerRef.current = L.layerGroup().addTo(map)
      map.on("click", (event: Leaflet.LeafletMouseEvent) => {
        onPickRef.current?.({ lat: event.latlng.lat, lng: event.latlng.lng })
      })
      mapRef.current = map
      // The container may have been laid out after the map measured it.
      setTimeout(() => map.invalidateSize(), 0)
    })()
    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      pinRef.current = null
      layerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Editable pin.
  useEffect(() => {
    const apply = () => {
      const L = leafletRef.current
      const map = mapRef.current
      if (!L || !map) return
      if (!pin) {
        pinRef.current?.remove()
        pinRef.current = null
        return
      }
      if (!pinRef.current) {
        const icon = L.divIcon({ html: pinHtml("#38bdf8", 30), className: "", iconSize: [30, 30], iconAnchor: [15, 34] })
        pinRef.current = L.marker([pin.lat, pin.lng], { icon, draggable: Boolean(onPickRef.current), autoPan: true }).addTo(map)
        pinRef.current.on("dragend", () => {
          const p = pinRef.current?.getLatLng()
          if (p) onPickRef.current?.({ lat: p.lat, lng: p.lng })
        })
      } else {
        pinRef.current.setLatLng([pin.lat, pin.lng])
      }
    }
    apply()
    const map = mapRef.current
    if (!map) {
      const timer = setInterval(() => {
        if (mapRef.current) {
          clearInterval(timer)
          apply()
        }
      }, 100)
      return () => clearInterval(timer)
    }
  }, [pin])

  // Read-only markers.
  useEffect(() => {
    const apply = () => {
      const L = leafletRef.current
      const map = mapRef.current
      const layer = layerRef.current
      if (!L || !map || !layer) return false
      layer.clearLayers()
      const list = markers || []
      for (const m of list) {
        const icon = L.divIcon({ html: pinHtml(m.color || "#38bdf8", 26), className: "", iconSize: [26, 26], iconAnchor: [13, 30] })
        L.marker([m.lat, m.lng], { icon, title: m.title })
          .bindTooltip(m.title, { direction: "top", offset: [0, -28] })
          .on("click", () => onMarkerClickRef.current?.(m.id))
          .addTo(layer)
      }
      if (!fittedRef.current && list.length > 0) {
        fittedRef.current = true
        if (list.length === 1) map.setView([list[0].lat, list[0].lng], 10)
        else map.fitBounds(L.latLngBounds(list.map((m) => [m.lat, m.lng] as [number, number])), { padding: [40, 40], maxZoom: 11 })
      }
      return true
    }
    if (apply()) return
    const timer = setInterval(() => {
      if (apply()) clearInterval(timer)
    }, 100)
    return () => clearInterval(timer)
  }, [markers])

  // Focus.
  useEffect(() => {
    if (!focus) return
    const run = () => {
      const map = mapRef.current
      if (!map) return false
      map.flyTo([focus.lat, focus.lng], focus.zoom ?? Math.max(map.getZoom(), 13), { duration: 0.8 })
      return true
    }
    if (run()) return
    const timer = setInterval(() => {
      if (run()) clearInterval(timer)
    }, 100)
    return () => clearInterval(timer)
  }, [focus])

  return <div ref={containerRef} className={className} />
}
