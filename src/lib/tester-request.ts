import type { Language } from "@/lib/i18n-config"

/**
 * Tester-access request for CRM-IoT (form at /tester). Pure module: shared by the form, the public API
 * and the admin inbox — keep it free of Prisma so the client bundle stays small.
 */

export const TESTER_KINDS = ["apartment", "house", "hotel", "boarding", "rooms", "vehicle", "sauna", "other"] as const
export const TESTER_CHANNELS = ["airbnb", "booking", "vrbo", "smoobu", "direct", "other"] as const
export const TESTER_INTERESTS = ["locks", "air", "heating", "cooling", "software"] as const
export const TESTER_STATUSES = ["new", "contacted", "granted", "declined"] as const

export type TesterKind = (typeof TESTER_KINDS)[number]
export type TesterChannel = (typeof TESTER_CHANNELS)[number]
export type TesterInterest = (typeof TESTER_INTERESTS)[number]
export type TesterStatus = (typeof TESTER_STATUSES)[number]

export type TesterRequestInput = {
  name: string
  email: string
  phone?: string
  company?: string
  kind: TesterKind
  units?: number | null
  channels: TesterChannel[]
  interests: TesterInterest[]
  address?: string
  lat?: number | null
  lng?: number | null
  message?: string
  lang: Language
  consent: boolean
  /** Honeypot — must stay empty. */
  website?: string
  /** Milliseconds the form was open before submit (bots submit instantly). */
  elapsedMs?: number
}

export type TesterRequestRecord = {
  id: string
  createdAt: string
  name: string
  email: string
  phone: string | null
  company: string | null
  kind: string
  units: number | null
  channels: string[]
  interests: string[]
  address: string | null
  lat: number | null
  lng: number | null
  message: string | null
  lang: string
  status: string
  note: string | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : ""

const longText = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : ""

const pick = <T extends string>(value: unknown, allowed: readonly T[]): T[] =>
  Array.isArray(value)
    ? Array.from(new Set(value.filter((v): v is T => typeof v === "string" && (allowed as readonly string[]).includes(v))))
    : []

const coordinate = (value: unknown, limit: number) => {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN
  if (!Number.isFinite(n) || Math.abs(n) > limit) return null
  // ~11 m precision is plenty to see the property on a map
  return Math.round(n * 10000) / 10000
}

export type TesterValidation =
  | { ok: true; data: Omit<TesterRequestInput, "consent" | "website" | "elapsedMs"> }
  | { ok: false; error: "name" | "email" | "kind" | "consent" | "spam" | "location" }

/** Normalises and validates a request body. Used on the server; the form uses the same rules for hints. */
export function validateTesterRequest(body: unknown): TesterValidation {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>

  if (text(b.website, 200)) return { ok: false, error: "spam" }
  if (typeof b.elapsedMs === "number" && b.elapsedMs < 2500) return { ok: false, error: "spam" }

  const name = text(b.name, 100)
  if (name.length < 2) return { ok: false, error: "name" }
  const email = text(b.email, 160).toLowerCase()
  if (!EMAIL_RE.test(email)) return { ok: false, error: "email" }
  const kind = text(b.kind, 20) as TesterKind
  if (!(TESTER_KINDS as readonly string[]).includes(kind)) return { ok: false, error: "kind" }
  if (b.consent !== true) return { ok: false, error: "consent" }

  const lat = coordinate(b.lat, 90)
  const lng = coordinate(b.lng, 180)
  if ((lat === null) !== (lng === null)) return { ok: false, error: "location" }

  const unitsRaw = typeof b.units === "number" ? b.units : Number(b.units)
  const units = Number.isFinite(unitsRaw) && unitsRaw >= 1 ? Math.min(Math.round(unitsRaw), 10000) : null

  const langRaw = text(b.lang, 2)
  const lang: Language = langRaw === "de" || langRaw === "ru" ? langRaw : "en"

  return {
    ok: true,
    data: {
      name,
      email,
      phone: text(b.phone, 40) || undefined,
      company: text(b.company, 120) || undefined,
      kind,
      units,
      channels: pick(b.channels, TESTER_CHANNELS),
      interests: pick(b.interests, TESTER_INTERESTS),
      address: text(b.address, 240) || undefined,
      lat,
      lng,
      message: longText(b.message, 2000) || undefined,
      lang,
    },
  }
}

/** Labels used by the form and by the admin inbox. */
export const TESTER_LABELS: Record<
  Language,
  {
    kinds: Record<TesterKind, string>
    channels: Record<TesterChannel, string>
    interests: Record<TesterInterest, string>
    statuses: Record<TesterStatus, string>
  }
> = {
  en: {
    kinds: {
      apartment: "Holiday flat",
      house: "Holiday house",
      hotel: "Hotel",
      boarding: "Boarding house",
      rooms: "Rooms / guesthouse",
      vehicle: "Camper / caravan / boat",
      sauna: "Sauna (hourly)",
      other: "Other",
    },
    channels: { airbnb: "Airbnb", booking: "Booking.com", vrbo: "Vrbo / FeWo-direkt", smoobu: "Smoobu", direct: "Direct bookings", other: "Other" },
    interests: {
      locks: "Smart door locks",
      air: "Air-quality sensors (CO₂, humidity, temperature)",
      heating: "Heating control",
      cooling: "Air-conditioning control",
      software: "Only the software for now",
    },
    statuses: { new: "New", contacted: "Contacted", granted: "Access granted", declined: "Declined" },
  },
  de: {
    kinds: {
      apartment: "Ferienwohnung",
      house: "Ferienhaus",
      hotel: "Hotel",
      boarding: "Boardinghouse",
      rooms: "Zimmer / Pension",
      vehicle: "Wohnmobil / Wohnwagen / Boot",
      sauna: "Sauna (stundenweise)",
      other: "Sonstiges",
    },
    channels: { airbnb: "Airbnb", booking: "Booking.com", vrbo: "Vrbo / FeWo-direkt", smoobu: "Smoobu", direct: "Direktbuchungen", other: "Sonstiges" },
    interests: {
      locks: "Smarte Türschlösser",
      air: "Luftqualitäts-Sensoren (CO₂, Feuchte, Temperatur)",
      heating: "Heizungssteuerung",
      cooling: "Klimaanlagen-Steuerung",
      software: "Vorerst nur die Software",
    },
    statuses: { new: "Neu", contacted: "Kontaktiert", granted: "Zugang erteilt", declined: "Abgelehnt" },
  },
  ru: {
    kinds: {
      apartment: "Апартаменты",
      house: "Дом для отдыха",
      hotel: "Отель",
      boarding: "Бординг-хаус",
      rooms: "Комнаты / гостевой дом",
      vehicle: "Автодом / караван / лодка",
      sauna: "Сауна (почасово)",
      other: "Другое",
    },
    channels: { airbnb: "Airbnb", booking: "Booking.com", vrbo: "Vrbo / FeWo-direkt", smoobu: "Smoobu", direct: "Прямые брони", other: "Другое" },
    interests: {
      locks: "Умные замки",
      air: "Датчики качества воздуха (CO₂, влажность, температура)",
      heating: "Управление отоплением",
      cooling: "Управление кондиционированием",
      software: "Пока только программа",
    },
    statuses: { new: "Новая", contacted: "Связались", granted: "Доступ выдан", declined: "Отказ" },
  },
}
