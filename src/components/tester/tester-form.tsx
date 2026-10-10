"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"
import { ArrowRight, Check, Crosshair, KeyRound, Loader2, MapPin, Search, Snowflake, Sparkles, ThermometerSun, Wind } from "lucide-react"
import type { Language } from "@/lib/i18n-config"
import {
  TESTER_CHANNELS,
  TESTER_INTERESTS,
  TESTER_KINDS,
  TESTER_LABELS,
  type TesterChannel,
  type TesterInterest,
  type TesterKind,
} from "@/lib/tester-request"
import type { MapPoint } from "@/components/tester/linart-map"

const LinartMap = dynamic(() => import("@/components/tester/linart-map").then((m) => m.LinartMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-white/[0.03]" />,
})

const T = {
  en: {
    badge: "CRM-IoT · open beta",
    title: "Free tester access",
    subtitle:
      "Tell us about your property and we unlock the host app for you — bookings, door codes, guest cards and cleaning in one place. We reply personally.",
    you: "About you",
    name: "Name",
    email: "E-mail",
    phone: "Phone (optional)",
    company: "Company / property name (optional)",
    property: "Your property",
    kind: "What do you rent out?",
    units: "Number of units",
    channels: "Where do bookings come from?",
    where: "Where is it?",
    whereHint: "Search for the address or click the map — then drag the pin to the exact spot.",
    address: "Address or town",
    search: "Find",
    locate: "Use my location",
    mapLoad: "Show map",
    mapNote: "The map and the address search use OpenStreetMap — they load only after you click.",
    nearest: "Exact address not found — the pin is on the nearest match. Drag it to the exact spot.",
    pinSet: "Pin set",
    pinNone: "No pin yet",
    notFound: "Address not found — try the town or postcode.",
    automationTitle: "Automation for your property",
    automationQuestion: "Would you like to use our automation in your hotel or rental?",
    automationHint: "Pick everything that is interesting — we bring the hardware and set it up with you.",
    message: "Anything else? (optional)",
    consentA: "I agree that LinArt stores these details to process my request. ",
    consentLink: "Privacy policy",
    submit: "Request tester access",
    sending: "Sending…",
    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid e-mail address.",
      kind: "Please choose what you rent out.",
      consent: "Please confirm the privacy note.",
      location: "The pin is incomplete — click the map again.",
      rate: "Too many requests — please try again in an hour.",
      server: "Something went wrong on our side — please write to vladimir@linart.club.",
      invalid: "Something went wrong — please try again.",
    },
    doneTitle: "Thank you — your request is in!",
    doneText: "We will get back to you at",
    doneBack: "Back to LinArt Labs",
  },
  de: {
    badge: "CRM-IoT · offene Beta",
    title: "Kostenloser Testzugang",
    subtitle:
      "Erzählen Sie uns von Ihrer Unterkunft — wir schalten die Gastgeber-App für Sie frei: Buchungen, Türcodes, Gast-Karten und Reinigung an einem Ort. Wir melden uns persönlich.",
    you: "Über Sie",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon (optional)",
    company: "Firma / Name der Unterkunft (optional)",
    property: "Ihre Unterkunft",
    kind: "Was vermieten Sie?",
    units: "Anzahl Einheiten",
    channels: "Woher kommen die Buchungen?",
    where: "Wo liegt sie?",
    whereHint: "Adresse suchen oder in die Karte klicken — dann die Nadel an die genaue Stelle ziehen.",
    address: "Adresse oder Ort",
    search: "Suchen",
    locate: "Mein Standort",
    mapLoad: "Karte anzeigen",
    mapNote: "Karte und Adresssuche nutzen OpenStreetMap — sie werden erst nach Ihrem Klick geladen.",
    nearest: "Genaue Adresse nicht gefunden — die Nadel steht am nächsten Treffer. Ziehen Sie sie an die genaue Stelle.",
    pinSet: "Nadel gesetzt",
    pinNone: "Noch keine Nadel",
    notFound: "Adresse nicht gefunden — versuchen Sie Ort oder Postleitzahl.",
    automationTitle: "Automatisierung für Ihre Unterkunft",
    automationQuestion: "Möchten Sie unsere Automatisierung in Ihrem Hotel oder Ihrer Vermietung nutzen?",
    automationHint: "Wählen Sie alles, was interessant ist — wir bringen die Hardware und richten sie mit Ihnen ein.",
    message: "Noch etwas? (optional)",
    consentA: "Ich bin einverstanden, dass LinArt diese Angaben zur Bearbeitung meiner Anfrage speichert. ",
    consentLink: "Datenschutz",
    submit: "Testzugang anfragen",
    sending: "Wird gesendet…",
    errors: {
      name: "Bitte geben Sie Ihren Namen ein.",
      email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      kind: "Bitte wählen Sie, was Sie vermieten.",
      consent: "Bitte bestätigen Sie den Datenschutzhinweis.",
      location: "Die Nadel ist unvollständig — bitte erneut in die Karte klicken.",
      rate: "Zu viele Anfragen — bitte in einer Stunde erneut versuchen.",
      server: "Bei uns ist etwas schiefgelaufen — bitte schreiben Sie an vladimir@linart.club.",
      invalid: "Etwas ist schiefgelaufen — bitte erneut versuchen.",
    },
    doneTitle: "Danke — Ihre Anfrage ist da!",
    doneText: "Wir melden uns unter",
    doneBack: "Zurück zu LinArt Labs",
  },
  ru: {
    badge: "CRM-IoT · открытая бета",
    title: "Бесплатный тестовый доступ",
    subtitle:
      "Расскажите о своём объекте, и мы откроем вам приложение хоста: брони, коды двери, карточки гостей и уборка в одном месте. Ответим лично.",
    you: "О вас",
    name: "Имя",
    email: "E-mail",
    phone: "Телефон (необязательно)",
    company: "Компания / название объекта (необязательно)",
    property: "Ваш объект",
    kind: "Что вы сдаёте?",
    units: "Количество объектов",
    channels: "Откуда приходят брони?",
    where: "Где он находится?",
    whereHint: "Найдите адрес или кликните по карте, затем перетащите булавку точно на место.",
    address: "Адрес или город",
    search: "Найти",
    locate: "Моё местоположение",
    mapLoad: "Показать карту",
    mapNote: "Карта и поиск адреса работают через OpenStreetMap и загружаются только после вашего клика.",
    nearest: "Точный адрес не найден, булавка стоит на ближайшем совпадении. Перетащите её точно на место.",
    pinSet: "Булавка стоит",
    pinNone: "Булавки пока нет",
    notFound: "Адрес не найден — попробуйте город или индекс.",
    automationTitle: "Автоматизация для вашего объекта",
    automationQuestion: "Хотите использовать нашу автоматизацию в своём отеле или объекте аренды?",
    automationHint: "Отметьте всё, что интересно: мы привезём оборудование и настроим его вместе с вами.",
    message: "Что-то ещё? (необязательно)",
    consentA: "Я согласен, что LinArt сохранит эти данные для обработки моей заявки. ",
    consentLink: "Политика конфиденциальности",
    submit: "Запросить тестовый доступ",
    sending: "Отправляем…",
    errors: {
      name: "Пожалуйста, укажите имя.",
      email: "Пожалуйста, укажите корректный e-mail.",
      kind: "Пожалуйста, выберите, что вы сдаёте.",
      consent: "Пожалуйста, подтвердите согласие с политикой конфиденциальности.",
      location: "Булавка поставлена не полностью — кликните по карте ещё раз.",
      rate: "Слишком много заявок — попробуйте через час.",
      server: "У нас что-то пошло не так — напишите, пожалуйста, на vladimir@linart.club.",
      invalid: "Что-то пошло не так — попробуйте ещё раз.",
    },
    doneTitle: "Спасибо, заявка получена!",
    doneText: "Мы ответим на",
    doneBack: "Вернуться на LinArt Labs",
  },
} as const

const INTEREST_ICONS: Record<TesterInterest, ReactNode> = {
  locks: <KeyRound className="h-5 w-5" />,
  air: <Wind className="h-5 w-5" />,
  heating: <ThermometerSun className="h-5 w-5" />,
  cooling: <Snowflake className="h-5 w-5" />,
  software: <Sparkles className="h-5 w-5" />,
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white placeholder:text-gray-500 outline-none transition focus:border-sky-400/60 focus:bg-black/40 focus:ring-2 focus:ring-sky-400/20"

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-sky-400/60 bg-sky-500/15 text-white shadow-[0_0_0_3px_rgba(56,189,248,0.12)]"
          : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-white/25 hover:text-white"
      }`}
    >
      {active && <Check className="h-4 w-4 text-sky-300" />}
      {children}
    </button>
  )
}

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gray-900/60 p-6 backdrop-blur-xl md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-sm font-bold text-white shadow-lg shadow-sky-900/40">
          {step}
        </span>
        <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-gray-400">{label}</span>
      {children}
    </label>
  )
}

export function TesterForm({ language }: { language: Language }) {
  const t = T[language] ?? T.en
  const labels = TESTER_LABELS[language] ?? TESTER_LABELS.en

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [kind, setKind] = useState<TesterKind | "">("")
  const [units, setUnits] = useState("")
  const [channels, setChannels] = useState<TesterChannel[]>([])
  const [interests, setInterests] = useState<TesterInterest[]>([])
  const [address, setAddress] = useState("")
  const [pin, setPin] = useState<MapPoint | null>(null)
  const [focus, setFocus] = useState<(MapPoint & { zoom?: number }) | null>(null)
  const [mapOpen, setMapOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [searchNote, setSearchNote] = useState("")
  const [message, setMessage] = useState("")
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = useState("")
  const startedAt = useRef(0)
  const lastReverse = useRef(0)

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  // Functional update: several quick clicks in a row must not overwrite each other.
  const toggle = <T extends string>(value: T, set: Dispatch<SetStateAction<T[]>>) =>
    set((list) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]))

  const searchAddress = async () => {
    const q = address.trim()
    if (!q) return
    setMapOpen(true)
    setSearching(true)
    setSearchNote("")
    try {
      // Full query first; if OSM does not know the street, fall back to shorter queries (town, postcode).
      // Nominatim allows 1 request per second, so the fallbacks wait.
      const parts = q.split(/[,\s]+/).filter(Boolean)
      const attempts = [q, ...[1, 2].map((drop) => parts.slice(drop).join(" ")).filter((s) => s && s !== q)]
      for (let i = 0; i < attempts.length; i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, 1100))
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=${language}&q=${encodeURIComponent(attempts[i])}`
        )
        const list = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>
        if (list.length) {
          const point = { lat: Number(list[0].lat), lng: Number(list[0].lon) }
          setPin(point)
          setFocus({ ...point, zoom: i === 0 ? 16 : 14 })
          if (i > 0) setSearchNote(t.nearest)
          return
        }
      }
      setSearchNote(t.notFound)
    } catch {
      setSearchNote(t.notFound)
    } finally {
      setSearching(false)
    }
  }

  const reverseFill = async (point: MapPoint) => {
    // Fill the address field once from the pin; respect Nominatim's 1 request/second rule.
    if (address.trim() || Date.now() - lastReverse.current < 1500) return
    lastReverse.current = Date.now()
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&accept-language=${language}&lat=${point.lat}&lon=${point.lng}`
      )
      const data = (await res.json()) as { display_name?: string }
      if (data.display_name) setAddress(data.display_name.slice(0, 240))
    } catch {
      /* the pin alone is enough */
    }
  }

  const pick = (point: MapPoint) => {
    setPin(point)
    void reverseFill(point)
  }

  const locate = () => {
    if (!navigator.geolocation) return
    setMapOpen(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const point = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        pick(point)
        setFocus({ ...point, zoom: 15 })
      },
      () => setSearchNote(t.notFound),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    if (name.trim().length < 2) return setError(t.errors.name)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError(t.errors.email)
    if (!kind) return setError(t.errors.kind)
    if (!consent) return setError(t.errors.consent)

    setStatus("sending")
    try {
      const res = await fetch("/api/tester-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          kind,
          units: units ? Number(units) : null,
          channels,
          interests,
          address,
          lat: pin?.lat ?? null,
          lng: pin?.lng ?? null,
          message,
          lang: language,
          consent,
          website,
          elapsedMs: Date.now() - startedAt.current,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: keyof typeof t.errors }
      if (res.ok && data.ok) {
        setStatus("done")
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }
      setError(t.errors[data.error || "invalid"] || t.errors.invalid)
    } catch {
      setError(t.errors.invalid)
    }
    setStatus("idle")
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-3xl border border-white/10 bg-gray-900/70 p-10 text-center backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-emerald-900/40">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">{t.doneTitle}</h1>
          <p className="mt-4 text-lg text-gray-300">
            {t.doneText} <span className="font-semibold text-white">{email.trim()}</span>.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold text-gray-100 transition hover:bg-white/10"
          >
            {t.doneBack}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6 px-4" noValidate>
      <header className="space-y-5 pb-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-300">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          {t.badge}
        </span>
        <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">{t.title}</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">{t.subtitle}</p>
      </header>

      <Section step={1} title={t.you}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t.name}>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={100} required />
          </Field>
          <Field label={t.email}>
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={160} required />
          </Field>
          <Field label={t.phone}>
            <input className={inputClass} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" maxLength={40} />
          </Field>
          <Field label={t.company}>
            <input className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" maxLength={120} />
          </Field>
        </div>
        {/* Honeypot: hidden from people, filled by bots */}
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </Section>

      <Section step={2} title={t.property}>
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-gray-400">{t.kind}</p>
            <div className="flex flex-wrap gap-2">
              {TESTER_KINDS.map((k) => (
                <Chip key={k} active={kind === k} onClick={() => setKind(k)}>
                  {labels.kinds[k]}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[200px_1fr] md:items-start">
            <Field label={t.units}>
              <input className={inputClass} type="number" min={1} max={10000} inputMode="numeric" value={units} onChange={(e) => setUnits(e.target.value)} />
            </Field>
            <div className="space-y-3">
              <p className="text-sm text-gray-400">{t.channels}</p>
              <div className="flex flex-wrap gap-2">
                {TESTER_CHANNELS.map((c) => (
                  <Chip key={c} active={channels.includes(c)} onClick={() => toggle(c, setChannels)}>
                    {labels.channels[c]}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section step={3} title={t.where}>
        <p className="mb-4 text-sm text-gray-400">{t.whereHint}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className={inputClass}
            value={address}
            placeholder={t.address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                void searchAddress()
              }
            }}
            autoComplete="street-address"
            maxLength={240}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void searchAddress()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 font-medium text-white transition hover:bg-white/10"
            >
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {t.search}
            </button>
            <button
              type="button"
              onClick={locate}
              title={t.locate}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 font-medium text-white transition hover:bg-white/10"
            >
              <Crosshair className="h-4 w-4" />
              <span className="hidden md:inline">{t.locate}</span>
            </button>
          </div>
        </div>
        {searchNote && <p className="mt-2 text-sm text-amber-300">{searchNote}</p>}

        <div className="relative mt-4 h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-black/40 md:h-[420px]">
          {mapOpen ? (
            <LinartMap pin={pin} onPick={pick} focus={focus} className="h-full w-full" scrollWheelZoom={false} />
          ) : (
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className="group flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_60%)] px-6 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/10 text-sky-300 transition group-hover:scale-110">
                <MapPin className="h-7 w-7" />
              </span>
              <span className="text-lg font-semibold text-white">{t.mapLoad}</span>
              <span className="max-w-md text-xs text-gray-500">{t.mapNote}</span>
            </button>
          )}
          <span
            className={`pointer-events-none absolute left-3 top-3 z-[500] inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur ${
              pin ? "bg-emerald-500/20 text-emerald-200" : "bg-black/50 text-gray-400"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            {pin ? `${t.pinSet} · ${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}` : t.pinNone}
          </span>
        </div>
      </Section>

      <Section step={4} title={t.automationTitle}>
        <p className="text-lg font-medium text-white">{t.automationQuestion}</p>
        <p className="mb-5 mt-1 text-sm text-gray-400">{t.automationHint}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {TESTER_INTERESTS.map((i) => {
            const active = interests.includes(i)
            return (
              <button
                key={i}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(i, setInterests)}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-sky-400/60 bg-sky-500/10 text-white shadow-[0_0_0_3px_rgba(56,189,248,0.12)]"
                    : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-white/25 hover:text-white"
                } ${i === "software" ? "sm:col-span-2" : ""}`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    active ? "bg-sky-500/25 text-sky-200" : "bg-white/[0.05] text-gray-400"
                  }`}
                >
                  {INTEREST_ICONS[i]}
                </span>
                <span className="flex-1 font-medium">{labels.interests[i]}</span>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                    active ? "border-sky-400 bg-sky-500 text-white" : "border-white/20"
                  }`}
                >
                  {active && <Check className="h-4 w-4" />}
                </span>
              </button>
            )
          })}
        </div>
      </Section>

      <Section step={5} title={t.message}>
        <textarea className={`${inputClass} min-h-[120px] resize-y`} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} />
        <label className="mt-5 flex items-start gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-sky-500"
          />
          <span>
            {t.consentA}
            <Link href="/p/datenschutz" target="_blank" className="text-sky-300 underline-offset-2 hover:underline">
              {t.consentLink}
            </Link>
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:from-sky-400 hover:to-sky-500 disabled:opacity-60 md:w-auto"
        >
          {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          {status === "sending" ? t.sending : t.submit}
        </button>
      </Section>
    </form>
  )
}
