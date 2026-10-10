"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2, Mail, MapPin, Phone, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TESTER_LABELS, TESTER_STATUSES, type TesterRequestRecord, type TesterStatus } from "@/lib/tester-request"
import type { MapMarker } from "@/components/tester/linart-map"

const LinartMap = dynamic(() => import("@/components/tester/linart-map").then((m) => m.LinartMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-white/[0.03]" />,
})

const STATUS_COLORS: Record<TesterStatus, string> = {
  new: "#38bdf8",
  contacted: "#f59e0b",
  granted: "#34d399",
  declined: "#6b7280",
}

const labels = TESTER_LABELS.en

const label = (map: Record<string, string>, key: string) => map[key] || key

export function TesterRequestsAdmin() {
  const [rows, setRows] = useState<TesterRequestRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<TesterStatus | "all">("all")
  const [selected, setSelected] = useState<string | null>(null)
  const [focus, setFocus] = useState<{ lat: number; lng: number; zoom?: number } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/tester-requests", { cache: "no-store" })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { requests: TesterRequestRecord[] }
      setRows(data.requests)
    } catch {
      setError("Could not load the requests. Is the database schema up to date (prisma db push)?")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const update = async (id: string, patch: { status?: string; note?: string }) => {
    const res = await fetch(`/api/admin/tester-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    if (res.ok) setRows((list) => list.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const remove = async (id: string) => {
    if (!window.confirm("Delete this request permanently?")) return
    const res = await fetch(`/api/admin/tester-requests/${id}`, { method: "DELETE" })
    if (res.ok) setRows((list) => list.filter((r) => r.id !== id))
  }

  const visible = useMemo(() => rows.filter((r) => filter === "all" || r.status === filter), [rows, filter])

  const markers: MapMarker[] = useMemo(
    () =>
      visible
        .filter((r) => r.lat !== null && r.lng !== null)
        .map((r) => ({
          id: r.id,
          lat: r.lat as number,
          lng: r.lng as number,
          title: `${r.name} · ${label(labels.kinds, r.kind)}${r.units ? ` · ${r.units}` : ""}`,
          color: STATUS_COLORS[(r.status as TesterStatus) || "new"] || STATUS_COLORS.new,
        })),
    [visible]
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length }
    for (const s of TESTER_STATUSES) c[s] = rows.filter((r) => r.status === s).length
    return c
  }, [rows])

  const select = (row: TesterRequestRecord) => {
    setSelected(row.id)
    if (row.lat !== null && row.lng !== null) setFocus({ lat: row.lat, lng: row.lng, zoom: 13 })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Tester requests</h1>
          <p className="text-gray-400">
            CRM-IoT open beta — requests from <span className="font-mono">/tester</span>. Unlock access in the IoT dashboard: Admin → Accounts → 🏠 (units + days; it ends by itself and the host gets an e-mail).
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...TESTER_STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition ${
              filter === s ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {s !== "all" && <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[s] }} />}
            {s === "all" ? "All" : labels.statuses[s]}
            <span className="text-gray-500">{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="relative h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <LinartMap markers={markers} onMarkerClick={(id) => setSelected(id)} focus={focus} className="h-full w-full" />
        {markers.length === 0 && !loading && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[500] mx-auto w-fit rounded-full bg-black/60 px-4 py-2 text-sm text-gray-300">
            No pins yet
          </div>
        )}
      </div>

      {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <div className="space-y-4">
        {visible.map((r) => (
          <Card
            key={r.id}
            onClick={() => select(r)}
            className={`glass-card cursor-pointer border-white/10 transition ${selected === r.id ? "ring-2 ring-sky-400/60" : "hover:border-white/25"}`}
          >
            <CardContent className="space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {r.name}
                    {r.company && <span className="font-normal text-gray-400"> · {r.company}</span>}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(r.createdAt).toLocaleString("de-DE")} · {r.lang.toUpperCase()} · {label(labels.kinds, r.kind)}
                    {r.units ? ` · ${r.units} units` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={r.status}
                    onChange={(e) => void update(r.id, { status: e.target.value })}
                    className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
                  >
                    {TESTER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {labels.statuses[s]}
                      </option>
                    ))}
                  </select>
                  <Button variant="ghost" size="icon" onClick={() => void remove(r.id)} title="Delete">
                    <Trash2 className="h-4 w-4 text-red-300" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <a href={`mailto:${r.email}?subject=${encodeURIComponent("CRM-IoT – Testzugang / tester access")}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-sky-300 hover:underline">
                  <Mail className="h-4 w-4" />
                  {r.email}
                </a>
                {r.phone && (
                  <a href={`tel:${r.phone}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-sky-300 hover:underline">
                    <Phone className="h-4 w-4" />
                    {r.phone}
                  </a>
                )}
                {(r.address || r.lat !== null) && (
                  <span className="inline-flex items-center gap-1.5 text-gray-300">
                    <MapPin className="h-4 w-4" />
                    {r.address || `${r.lat}, ${r.lng}`}
                  </span>
                )}
              </div>

              {(r.interests.length > 0 || r.channels.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {r.interests.map((i) => (
                    <span key={i} className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
                      {label(labels.interests, i)}
                    </span>
                  ))}
                  {r.channels.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-300">
                      {label(labels.channels, c)}
                    </span>
                  ))}
                </div>
              )}

              {r.message && <p className="whitespace-pre-wrap rounded-xl bg-black/30 px-4 py-3 text-sm text-gray-200">{r.message}</p>}

              <textarea
                defaultValue={r.note || ""}
                placeholder="Internal note (saved when you leave the field)"
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => {
                  if ((e.target.value || "") !== (r.note || "")) void update(r.id, { note: e.target.value })
                }}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500"
                rows={2}
              />
            </CardContent>
          </Card>
        ))}
        {!loading && visible.length === 0 && !error && (
          <p className="rounded-xl border border-white/10 px-4 py-6 text-center text-gray-400">No requests yet.</p>
        )}
      </div>
    </div>
  )
}
