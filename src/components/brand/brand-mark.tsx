import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"
import { CalendarDays, Cloud, Cpu, Ghost, Ship, Store } from "lucide-react"

/**
 * Product marks for the home cards. Real logos where the product has one (ColdART, Duet, the iOS app icons,
 * Smart Hub Store, AI Consultant); a tile in the product's colour with a matching glyph where it has none yet.
 * Blocks reference a mark by key in `logo` (or put an image URL there for a custom logo).
 */
export const BRAND_KEYS = [
  "coldart",
  "duet",
  "iot-cloud",
  "crm-iot",
  "private-cloud",
  "linart-id",
  "ai-consultant",
  "smart-hub",
  "qr",
  "nfc-qr",
  "commercial-hub",
  "llm-lab",
  "kids-monster",
  "kids-boat",
] as const

export type BrandKey = (typeof BRAND_KEYS)[number]

export const BRAND_LABELS: Record<BrandKey, string> = {
  coldart: "ColdART (animated)",
  duet: "LinArt Duet",
  "iot-cloud": "Linart IoT Cloud / Smart Home app",
  "crm-iot": "CRM-IoT host app",
  "private-cloud": "Private Cloud",
  "linart-id": "LinArt ID",
  "ai-consultant": "AI Consultant / AI Operator",
  "smart-hub": "Smart Hub Store",
  qr: "QR Generator",
  "nfc-qr": "NFC QR Business Card app",
  "commercial-hub": "Commercial Hub",
  "llm-lab": "Local LLM lab",
  "kids-monster": "Kids Lab · Monster Apocalypse",
  "kids-boat": "Kids Lab · Boat Shutter",
}

export const isBrandKey = (value: string): value is BrandKey => (BRAND_KEYS as readonly string[]).includes(value)
const isImageUrl = (value: string) => /^(\/|https?:\/\/)/.test(value)

/** The ColdART mountains (ColdART repo, deploy/scripts/coldart-50x.html): peaks grow, snow caps glint, the base line draws. */
export function ColdartMark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 128 96" className={className} style={style} aria-hidden>
      <path className="ca-peak" style={{ animationDelay: "0s" }} d="M2 86 L34 32 L62 86 Z" fill="#cbd5e1" />
      <path className="ca-peak" style={{ animationDelay: ".42s" }} d="M70 86 L98 42 L126 86 Z" fill="#64748b" />
      <path className="ca-peak" style={{ animationDelay: ".2s" }} d="M26 86 L64 8 L102 86 Z" fill="#1e293b" stroke="#7dd3fc" strokeOpacity=".45" strokeWidth="1.2" strokeLinejoin="round" />
      <path className="ca-cap" style={{ animationDelay: ".2s" }} d="M64 8 L80 40 L71 34 L64 44 L56 32 L48 40 Z" fill="#f1f5f9" />
      <path className="ca-cap" style={{ animationDelay: "0s" }} d="M34 32 L44 49 L38 45 L34 51 L30 45 L24 49 Z" fill="#f8fafc" />
      <path className="ca-cap" style={{ animationDelay: ".42s" }} d="M98 42 L106 56 L101 53 L98 58 L94 52 L90 56 Z" fill="#e2e8f0" />
      <rect className="ca-base" x="2" y="88" width="124" height="4" rx="2" fill="#2563eb" />
    </svg>
  )
}

/** LinArt ID accent from the design (Claude Design "Linart ID Logo", default of the accent prop). */
export const LINART_ID_ACCENT = "#0f766e"

/**
 * LinArt ID, variant 1a "key in the pencil" (Claude Design "Linart ID Logo"): the LinArt mark unchanged in
 * silhouette, the third pencil becomes a keyhole — one entrance to every service. The peak takes currentColor.
 */
export function LinartIdMark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 240 246" className={className} style={style} aria-hidden>
      <path d="M120 14 L200 112 L148 86 L130 112 L110 112 L92 86 L40 112 Z" fill="currentColor" />
      <path d="M28 240 V162 Q28 132 54 132 Q80 132 80 162 V240 Z" fill="#cbd5e1" />
      <path d="M94 240 V162 Q94 132 120 132 Q146 132 146 162 V240 Z" fill="#64748b" />
      <path
        d="M160 240 V162 Q160 132 186 132 Q212 132 212 162 V240 Z M176 184 A14 14 0 1 1 196 184 L192 222 L180 222 Z"
        fillRule="evenodd"
        fill={LINART_ID_ACCENT}
      />
    </svg>
  )
}

/** AI Consultant / AI Operator app icon: the 3×3 grid with one green square. */
function AiGridMark({ size }: { size: number }) {
  const cells: Array<[number, number, string]> = [
    [0, 0, "#ffffff"], [1, 0, "rgba(255,255,255,.38)"], [2, 0, "rgba(255,255,255,.38)"],
    [0, 1, "#ffffff"], [1, 1, "rgba(255,255,255,.38)"], [2, 1, "rgba(255,255,255,.38)"],
    [0, 2, "#ffffff"], [1, 2, "#ffffff"], [2, 2, "#34d399"],
  ]
  return (
    <svg viewBox="0 0 30 30" width={size * 0.56} height={size * 0.56} aria-hidden>
      {cells.map(([x, y, fill]) => (
        <rect key={`${x}-${y}`} x={x * 10 + 1} y={y * 10 + 1} width="8" height="8" rx="2.2" fill={fill} />
      ))}
    </svg>
  )
}

/** Smart Hub Store mark (shopiot repo, public/favicon.svg): the LinArt pencils under a cyan peak. */
function SmartHubMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size * 0.72} height={size * 0.72} aria-hidden>
      <path d="M32 4 L42 18 L38 18 L38 15 L26 15 L26 18 L22 18 Z" fill="#22d3ee" />
      <rect x="8" y="22" width="14" height="34" rx="7" fill="#d4d4d4" />
      <rect x="25" y="22" width="14" height="34" rx="7" fill="#8a8a8a" />
      <rect x="42" y="22" width="14" height="34" rx="7" fill="#3f3f46" />
    </svg>
  )
}

/** QR Generator: finder squares and modules, as on its cover. */
function QrMark({ size }: { size: number }) {
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="9" height="9" rx="2" fill="#e2e8f0" />
      <rect x={x + 2} y={y + 2} width="5" height="5" rx="1" fill="#0b1220" />
      <rect x={x + 3.5} y={y + 3.5} width="2" height="2" fill="#e2e8f0" />
    </g>
  )
  const dots: Array<[number, number]> = [[12, 2], [14, 5], [12, 8], [12, 12], [15, 12], [18, 12], [21, 12], [12, 15], [18, 15], [21, 16], [12, 19], [15, 20], [19, 19], [22, 21], [14, 23], [18, 23], [22, 25]]
  return (
    <svg viewBox="0 0 30 30" width={size * 0.6} height={size * 0.6} aria-hidden>
      {finder(1, 1)}
      {finder(20, 1)}
      {finder(1, 20)}
      {dots.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="2.4" height="2.4" rx=".5" fill={x > 17 ? "#5eead4" : "#e2e8f0"} />
      ))}
    </svg>
  )
}

type Tile = { background: string; border: string; glow: string; render: (size: number) => ReactNode }

function glyph(Icon: typeof Cloud) {
  return function renderGlyph(size: number) {
    return <Icon style={{ width: size * 0.5, height: size * 0.5 }} className="text-white" strokeWidth={1.8} />
  }
}
function picture(src: string, alt: string, scale = 1) {
  return function renderPicture(size: number) {
    return <Image src={src} alt={alt} width={size * 2} height={size * 2} style={{ width: size * scale, height: size * scale }} className="object-contain" />
  }
}

const TILES: Record<BrandKey, Tile> = {
  coldart: {
    background: "radial-gradient(85% 85% at 50% 20%, #1f3a68 0%, #0d1730 55%, #05060b 100%)",
    border: "rgba(125,211,252,.35)",
    glow: "rgba(37,99,235,.45)",
    render: (size) => <ColdartMark style={{ width: size * 0.74, marginTop: size * 0.04 }} />,
  },
  duet: {
    background: "linear-gradient(135deg, #f3f4f6, #d1d5db)",
    border: "rgba(255,255,255,.35)",
    glow: "rgba(190,18,60,.35)",
    render: picture("/assets/duet/icon.png", "LinArt Duet", 0.78),
  },
  "iot-cloud": { background: "#c9a227", border: "rgba(255,255,255,.18)", glow: "rgba(201,162,39,.4)", render: picture("/assets/brands/iot-cloud.png", "Linart IoT Cloud") },
  "nfc-qr": { background: "#0a0a0a", border: "rgba(255,255,255,.16)", glow: "rgba(220,38,38,.3)", render: picture("/assets/brands/nfc-qr-card.png", "NFC QR Business Card") },
  "crm-iot": { background: "linear-gradient(135deg, #7c5cfc, #38beff)", border: "rgba(130,220,255,.4)", glow: "rgba(124,92,252,.45)", render: glyph(CalendarDays) },
  "private-cloud": { background: "linear-gradient(135deg, #10b981, #0ea5e9)", border: "rgba(167,243,208,.35)", glow: "rgba(16,185,129,.4)", render: glyph(Cloud) },
  "linart-id": {
    background: "#0b1220",
    border: "rgba(45,212,191,.28)",
    glow: "rgba(15,118,110,.45)",
    render: (size) => <LinartIdMark className="text-slate-50" style={{ width: size * 0.69 }} />,
  },
  "ai-consultant": { background: "linear-gradient(160deg, #3b82f6, #1d4ed8)", border: "rgba(147,197,253,.35)", glow: "rgba(59,130,246,.5)", render: (size) => <AiGridMark size={size} /> },
  "smart-hub": { background: "linear-gradient(160deg, #1f2937, #0b1220)", border: "rgba(34,211,238,.35)", glow: "rgba(8,145,178,.4)", render: (size) => <SmartHubMark size={size} /> },
  qr: { background: "linear-gradient(160deg, #0f2a3a, #0b1220)", border: "rgba(94,234,212,.35)", glow: "rgba(20,184,166,.35)", render: (size) => <QrMark size={size} /> },
  "commercial-hub": { background: "linear-gradient(135deg, #f59e0b, #ea580c)", border: "rgba(253,230,138,.35)", glow: "rgba(245,158,11,.4)", render: glyph(Store) },
  "llm-lab": { background: "linear-gradient(135deg, #8b5cf6, #c026d3)", border: "rgba(233,213,255,.35)", glow: "rgba(168,85,247,.45)", render: glyph(Cpu) },
  "kids-monster": { background: "linear-gradient(135deg, #84cc16, #15803d)", border: "rgba(217,249,157,.35)", glow: "rgba(132,204,22,.4)", render: glyph(Ghost) },
  "kids-boat": { background: "linear-gradient(135deg, #22d3ee, #2563eb)", border: "rgba(165,243,252,.35)", glow: "rgba(34,211,238,.4)", render: glyph(Ship) },
}

/** A product's mark on its tile. `logo` is a brand key or an image URL; unknown values render nothing. */
export function BrandMark({ logo, size = 48, className = "" }: { logo?: string; size?: number; className?: string }) {
  const value = (logo || "").trim()
  if (!value) return null
  const radius = Math.round(size * 0.26)
  if (isImageUrl(value)) {
    return (
      <span className={`inline-flex shrink-0 overflow-hidden ${className}`} style={{ width: size, height: size, borderRadius: radius }}>
        <Image src={value} alt="" width={size * 2} height={size * 2} className="h-full w-full object-cover" />
      </span>
    )
  }
  if (!isBrandKey(value)) return null
  const tile = TILES[value]
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: tile.background,
        boxShadow: `0 0 0 1px ${tile.border} inset, 0 ${Math.round(size / 6)}px ${Math.round(size / 2)}px -${Math.round(size / 6)}px ${tile.glow}`,
      }}
    >
      {tile.render(size)}
    </span>
  )
}

/** The big ColdART lockup for the home card: night sky, the animated mountains, wordmark with a sheen, the glowing ridge. */
export function ColdartShowcase({ tagline }: { tagline: string }) {
  return (
    <div
      className="relative flex h-80 w-80 max-w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-sky-300/20 shadow-2xl shadow-blue-950/50"
      style={{ background: "radial-gradient(120% 90% at 50% -10%, #1d3b6e 0%, #0a101e 55%, #05060b 100%)" }}
    >
      <div aria-hidden className="ca-stars pointer-events-none absolute inset-0" />
      <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full" viewBox="0 0 320 96" preserveAspectRatio="none">
        <path fill="#0e1830" d="M0 70 L40 44 L78 62 L124 30 L168 58 L212 36 L256 60 L292 40 L320 56 L320 96 L0 96 Z" />
        <polyline className="ca-ridge" fill="none" stroke="#7dd3fc" strokeWidth="1.6" strokeLinejoin="round" points="0,70 40,44 78,62 124,30 168,58 212,36 256,60 292,40 320,56" />
        <circle className="ca-node" cx="124" cy="30" r="2.5" fill="#e0f2fe" />
        <circle className="ca-node" cx="212" cy="36" r="2.5" fill="#7dd3fc" style={{ animationDelay: ".6s" }} />
      </svg>
      <div className="relative -mt-8 flex flex-col items-center gap-5">
        <ColdartMark className="w-40 drop-shadow-[0_8px_22px_rgba(37,99,235,.5)]" />
        <div className="text-center">
          <div className="ca-sheen relative overflow-hidden">
            <span className="text-4xl font-black leading-none tracking-tight text-white">
              COLD<span className="text-sky-300">ART</span>
            </span>
          </div>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-sky-300/85">{tagline}</p>
        </div>
      </div>
    </div>
  )
}

/** The LinArt ID lockup from the design: mark, LINART ID wordmark, a quiet caption, on the near-black panel. */
export function LinartIdLockup({ caption }: { caption: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#05060b] bg-[radial-gradient(ellipse_at_50%_35%,rgba(15,118,110,0.22),transparent_60%)] px-6 text-center">
      <LinartIdMark className="w-28 text-slate-50 drop-shadow-[0_10px_28px_rgba(15,118,110,.45)]" />
      <p className="text-3xl font-black tracking-tight text-slate-50">
        LINART <span style={{ color: LINART_ID_ACCENT }}>ID</span>
      </p>
      <p className="text-sm text-slate-300/60">{caption}</p>
    </div>
  )
}

/** Large mark on a soft glow, for cards that have no screenshot (e.g. LinArt ID). */
export function BrandPanel({ logo, size = 120 }: { logo: string; size?: number }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(124,92,252,0.18),transparent_65%)]">
      <BrandMark logo={logo} size={size} />
    </div>
  )
}
