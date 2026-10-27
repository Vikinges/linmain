"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Archive,
  ArrowRight,
  Check,
  Columns2,
  Command,
  Copy,
  Download,
  Eye,
  FolderSync,
  HardDrive,
  Layers,
  Mail,
  Move,
  PencilLine,
  PieChart,
  RefreshCw,
  Search,
  ShieldCheck,
  Tags,
} from "lucide-react"
import type { Language } from "@/lib/i18n-config"
import type { DuetRelease } from "@/lib/duet"

type Shot = { src: string; width: number; height: number }

/**
 * Product screenshots in public/assets/duet (from the filemanger repo, release\showcase: demo data under C:\Demo only).
 * The hero is the main window in the visitor's language; the gallery is English.
 */
const HERO_SHOTS: Record<Language, Shot> = {
  en: { src: "/assets/duet/main-en.png", width: 2910, height: 1830 },
  de: { src: "/assets/duet/main-de.png", width: 2910, height: 1830 },
  ru: { src: "/assets/duet/main-ru.png", width: 2910, height: 1830 },
}

const GALLERY: Array<Shot & { caption: Record<Language, string> }> = [
  {
    src: "/assets/duet/quicklook.png",
    width: 2910,
    height: 1830,
    caption: { en: "Quick Look — preview without leaving the panel", de: "Quick Look — Vorschau ohne den Bereich zu verlassen", ru: "Quick Look — просмотр, не уходя из панели" },
  },
  {
    src: "/assets/duet/palette.png",
    width: 2910,
    height: 1830,
    caption: { en: "Command palette — every command by name", de: "Befehlspalette — jeder Befehl per Name", ru: "Палитра команд — любая команда по названию" },
  },
  {
    src: "/assets/duet/sync.png",
    width: 2560,
    height: 1600,
    caption: { en: "Compare and synchronise folders", de: "Ordner vergleichen und synchronisieren", ru: "Сравнение и синхронизация папок" },
  },
  {
    src: "/assets/duet/light.png",
    width: 2910,
    height: 1830,
    caption: { en: "Light theme", de: "Helles Design", ru: "Светлая тема" },
  },
]

const FEATURE_ICONS = [Columns2, Command, Eye, Layers, FolderSync, PencilLine, Tags, PieChart, HardDrive, Archive, Search, Move] as const

const T = {
  en: {
    badge: "Completely free · Windows 10 / 11",
    tagline: "Two panes. One harmony.",
    subtitle:
      "A fast two-pane file manager for Windows in the spirit of Total Commander — with a modern look, tabs, instant preview and a command palette. Free for personal and commercial use. No ads, no account.",
    download: "Download for Windows",
    soon: "Download coming soon",
    meta: (v: string, size: string, date: string) => `Version ${v} · ${size} · ${date}`,
    freeTitle: "Free. Really.",
    freeText: "No trial, no premium tier, no ads, no sign-up. Use it at home and at work.",
    featuresTitle: "Everything a power user expects",
    features: [
      ["Two panes and tabs", "Classic Total Commander keys (F3–F8, Tab, Ins), tabs in both panes, breadcrumb path bar, light and dark theme."],
      ["Command palette", "Ctrl+Shift+P: commands, recent folders, drives and paths in one fuzzy search box."],
      ["Quick Look", "Ctrl+Space: images with zoom, syntax-highlighted code, hex, PDF, video, audio, folder and archive summaries."],
      ["Operations centre", "Copy and move run in the background: queue, pause, resume, speed graph, taskbar progress."],
      ["Compare and sync folders", "Side-by-side result by date, size or content, mirror or two-way sync, saved profiles."],
      ["Multi-rename", "Masks, search and replace, counters, case and transliteration — live preview, safe rollback and undo."],
      ["Colour labels", "Ctrl+1…7, tags and #label filter; colour rules for old, new and hidden files."],
      ["Folder sizes and space map", "Sizes calculated in the background with share bars, plus a treemap of what fills the disk."],
      ["Live drive bar", "USB sticks, network shares and cloud folders appear as they connect; photo import from camera cards."],
      ["Archives", "Browse ZIP, 7z, RAR and TAR like folders, extract, pack ZIP or tar.gz."],
      ["Instant filter and search", "Just type to filter the panel (wildcards, several terms); Alt+F7 searches with live results you can send to a panel."],
      ["Drag and drop", "Like Explorer: drag files out to other apps and in onto tabs, drives and path levels, with a right-drag menu."],
    ],
    installTitle: "Install in a minute",
    steps: [
      ["Download", "One file, about 50 MB — nothing else to install (.NET is inside)."],
      [
        "Start it — no admin rights",
        "Installs for your user into the Start menu and desktop, adds “Open in LinArt Duet” to Explorer. Windows may say “Windows protected your PC” because the app is new and not code-signed yet: click “More info” → “Run anyway”.",
      ],
      ["It keeps itself up to date", "Updates are signed by LinArt Labs; the app checks the signature and the checksum before it installs anything."],
    ],
    detailsTitle: "Details",
    details: [
      ["System", "Windows 10 or 11, 64-bit (x64)"],
      ["Languages", "English, Deutsch, Русский"],
      ["Portable", "Rename the file so its name has no “setup” — it runs without installing"],
      ["Uninstall", "Windows Settings → Apps → LinArt Duet"],
      ["Preview of PDF and media", "uses Microsoft Edge WebView2 (built into Windows 11 and current Windows 10)"],
    ],
    whatsNew: "What’s new in",
    checksum: "SHA-256 of the download",
    copy: "Copy",
    copied: "Copied",
    feedbackTitle: "Ideas or a bug?",
    feedbackText: "We read every message — write to us and tell us what you miss.",
    feedbackCta: "Write to us",
  },
  de: {
    badge: "Komplett kostenlos · Windows 10 / 11",
    tagline: "Zwei Bereiche. Ein Einklang.",
    subtitle:
      "Ein schneller Zwei-Fenster-Dateimanager für Windows im Geist des Total Commander — modern gestaltet, mit Tabs, Sofortvorschau und Befehlspalette. Kostenlos für private und kommerzielle Nutzung. Ohne Werbung, ohne Konto.",
    download: "Für Windows herunterladen",
    soon: "Download in Kürze",
    meta: (v: string, size: string, date: string) => `Version ${v} · ${size} · ${date}`,
    freeTitle: "Kostenlos. Wirklich.",
    freeText: "Keine Testphase, keine Premium-Stufe, keine Werbung, keine Registrierung. Zu Hause und im Büro.",
    featuresTitle: "Alles, was Profis erwarten",
    features: [
      ["Zwei Bereiche und Tabs", "Klassische Total-Commander-Tasten (F3–F8, Tab, Einfg), Tabs in beiden Bereichen, Pfadleiste, helles und dunkles Design."],
      ["Befehlspalette", "Strg+Umschalt+P: Befehle, zuletzt genutzte Ordner, Laufwerke und Pfade in einem Suchfeld."],
      ["Quick Look", "Strg+Leertaste: Bilder mit Zoom, Code mit Syntaxhervorhebung, Hex, PDF, Video, Audio, Ordner- und Archivübersicht."],
      ["Vorgangszentrale", "Kopieren und Verschieben im Hintergrund: Warteschlange, Pause, Fortsetzen, Tempo-Grafik, Fortschritt in der Taskleiste."],
      ["Ordner vergleichen und synchronisieren", "Ergebnis nebeneinander nach Datum, Größe oder Inhalt, Spiegeln oder Zwei-Wege-Sync, gespeicherte Profile."],
      ["Mehrfach umbenennen", "Masken, Suchen und Ersetzen, Zähler, Groß/Klein und Transliteration — Live-Vorschau, sicheres Zurückrollen und Rückgängig."],
      ["Farbmarkierungen", "Strg+1…7, Tags und #Label-Filter; Farbregeln für alte, neue und versteckte Dateien."],
      ["Ordnergrößen und Speicherkarte", "Größen im Hintergrund mit Anteilsbalken, dazu eine Treemap, was die Platte füllt."],
      ["Live-Laufwerksleiste", "USB-Sticks, Netzwerkfreigaben und Cloud-Ordner erscheinen beim Verbinden; Fotoimport von Speicherkarten."],
      ["Archive", "ZIP, 7z, RAR und TAR wie Ordner öffnen, entpacken, als ZIP oder tar.gz packen."],
      ["Sofortfilter und Suche", "Einfach lostippen, um den Bereich zu filtern (Platzhalter, mehrere Begriffe); Alt+F7 sucht mit Live-Ergebnissen, die Sie in einen Bereich übernehmen."],
      ["Drag & Drop", "Wie im Explorer: Dateien in andere Apps ziehen und auf Tabs, Laufwerke und Pfadebenen ablegen, mit Menü beim Ziehen mit rechter Maustaste."],
    ],
    installTitle: "In einer Minute installiert",
    steps: [
      ["Herunterladen", "Eine Datei, etwa 50 MB — sonst nichts zu installieren (.NET ist enthalten)."],
      [
        "Starten — ohne Administratorrechte",
        "Installiert für Ihr Benutzerkonto ins Startmenü und auf den Desktop, ergänzt „In LinArt Duet öffnen“ im Explorer. Windows meldet eventuell „Der Computer wurde durch Windows geschützt“, weil die App neu und noch nicht codesigniert ist: „Weitere Informationen“ → „Trotzdem ausführen“.",
      ],
      ["Aktualisiert sich selbst", "Updates sind von LinArt Labs signiert; die App prüft Signatur und Prüfsumme, bevor sie etwas installiert."],
    ],
    detailsTitle: "Details",
    details: [
      ["System", "Windows 10 oder 11, 64 Bit (x64)"],
      ["Sprachen", "English, Deutsch, Русский"],
      ["Portabel", "Datei so umbenennen, dass „setup“ nicht im Namen steht — sie läuft ohne Installation"],
      ["Deinstallieren", "Windows-Einstellungen → Apps → LinArt Duet"],
      ["Vorschau von PDF und Medien", "nutzt Microsoft Edge WebView2 (in Windows 11 und aktuellem Windows 10 enthalten)"],
    ],
    whatsNew: "Neu in",
    checksum: "SHA-256 des Downloads",
    copy: "Kopieren",
    copied: "Kopiert",
    feedbackTitle: "Idee oder Fehler?",
    feedbackText: "Wir lesen jede Nachricht — schreiben Sie uns, was Ihnen fehlt.",
    feedbackCta: "Schreiben Sie uns",
  },
  ru: {
    badge: "Полностью бесплатно · Windows 10 / 11",
    tagline: "Две панели. Одна гармония.",
    subtitle:
      "Быстрый двухпанельный файловый менеджер для Windows в духе Total Commander — современный вид, вкладки, мгновенный просмотр и палитра команд. Бесплатно для личного и коммерческого использования. Без рекламы и без регистрации.",
    download: "Скачать для Windows",
    soon: "Скоро можно будет скачать",
    meta: (v: string, size: string, date: string) => `Версия ${v} · ${size} · ${date}`,
    freeTitle: "Бесплатно. Правда.",
    freeText: "Ни пробного периода, ни платной версии, ни рекламы, ни регистрации. Дома и на работе.",
    featuresTitle: "Всё, что ждёт опытный пользователь",
    features: [
      ["Две панели и вкладки", "Привычные клавиши Total Commander (F3–F8, Tab, Ins), вкладки в обеих панелях, строка пути, светлая и тёмная тема."],
      ["Палитра команд", "Ctrl+Shift+P: команды, недавние папки, диски и пути в одной строке поиска."],
      ["Quick Look", "Ctrl+Пробел: картинки с зумом, код с подсветкой, hex, PDF, видео, аудио, сводка по папке и архиву."],
      ["Центр операций", "Копирование и перенос в фоне: очередь, пауза, продолжение, график скорости, прогресс на панели задач."],
      ["Сравнение и синхронизация папок", "Результат бок о бок по дате, размеру или содержимому, зеркало или двусторонняя синхронизация, профили."],
      ["Групповое переименование", "Маски, поиск и замена, счётчики, регистр и транслитерация — живой предпросмотр, безопасный откат и отмена."],
      ["Цветные метки", "Ctrl+1…7, теги и фильтр #метка; цветовые правила для старых, новых и скрытых файлов."],
      ["Размеры папок и карта диска", "Размеры считаются в фоне с полосками долей, плюс карта того, чем занят диск."],
      ["Живая полоса дисков", "Флешки, сетевые и облачные папки появляются при подключении; импорт фото с карт памяти."],
      ["Архивы", "ZIP, 7z, RAR и TAR открываются как папки, распаковка, упаковка в ZIP или tar.gz."],
      ["Мгновенный фильтр и поиск", "Просто начните печатать, чтобы отфильтровать панель (маски, несколько слов); Alt+F7 ищет с живыми результатами, которые можно вывести в панель."],
      ["Перетаскивание", "Как в Проводнике: файлы перетаскиваются в другие программы и на вкладки, диски и уровни пути, меню при перетаскивании правой кнопкой."],
    ],
    installTitle: "Установка за минуту",
    steps: [
      ["Скачайте", "Один файл, около 50 МБ — больше ничего ставить не нужно (.NET уже внутри)."],
      [
        "Запустите — без прав администратора",
        "Устанавливается для вашего пользователя в «Пуск» и на рабочий стол, добавляет «Открыть в LinArt Duet» в Проводник. Windows может написать «Система Windows защитила ваш компьютер» — программа новая и пока без цифровой подписи: нажмите «Подробнее» → «Выполнить в любом случае».",
      ],
      ["Обновляется сама", "Обновления подписаны LinArt Labs; программа проверяет подпись и контрольную сумму, прежде чем что-то установить."],
    ],
    detailsTitle: "Подробности",
    details: [
      ["Система", "Windows 10 или 11, 64 бит (x64)"],
      ["Языки", "English, Deutsch, Русский"],
      ["Портативно", "Переименуйте файл, чтобы в имени не было «setup», — он запустится без установки"],
      ["Удаление", "Параметры Windows → Приложения → LinArt Duet"],
      ["Просмотр PDF и медиа", "через Microsoft Edge WebView2 (есть в Windows 11 и актуальной Windows 10)"],
    ],
    whatsNew: "Что нового в",
    checksum: "SHA-256 файла",
    copy: "Копировать",
    copied: "Скопировано",
    feedbackTitle: "Идея или ошибка?",
    feedbackText: "Мы читаем каждое письмо — напишите, чего вам не хватает.",
    feedbackCta: "Написать нам",
  },
} as const

const LOCALES: Record<Language, string> = { en: "en-GB", de: "de-DE", ru: "ru-RU" }

const formatSize = (bytes: number) => `${Math.round(bytes / 1024 / 1024)} MB`
const formatDate = (iso: string, language: Language) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat(LOCALES[language], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date)
}

function DownloadButton({ release, language }: { release: DuetRelease | null; language: Language }) {
  const t = T[language] ?? T.en
  if (!release) {
    return (
      <span className="inline-flex cursor-not-allowed items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-lg font-semibold text-gray-400">
        <Download className="h-5 w-5" />
        {t.soon}
      </span>
    )
  }
  return (
    <div className="flex flex-col items-center gap-3">
      <a
        href={`/duet/${release.file}`}
        className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-600 px-7 py-4 text-lg font-semibold text-white shadow-xl shadow-rose-950/50 ring-1 ring-white/10 transition hover:from-rose-600 hover:to-rose-500"
      >
        <Download className="h-5 w-5" />
        {t.download}
      </a>
      <span className="text-sm text-gray-400">{t.meta(release.version, formatSize(release.size), formatDate(release.published, language))}</span>
    </div>
  )
}

function Checksum({ value, language }: { value: string; language: Language }) {
  const t = T[language] ?? T.en
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard blocked: the value stays selectable
    }
  }
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-400">{t.checksum}</p>
      <div className="flex items-start gap-3">
        <code className="min-w-0 flex-1 break-all rounded-lg bg-black/40 px-3 py-2 font-mono text-xs text-gray-300">{value}</code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? t.copied : t.copy}
        </button>
      </div>
    </div>
  )
}

/** linart.club/duet — the LinArt Duet download page. The release data comes from the signed update.json. */
export function DuetLanding({ language, release }: { language: Language; release: DuetRelease | null }) {
  const t = T[language] ?? T.en
  const notes = release ? release.notes[language] || release.notes.en || "" : ""
  const hero = HERO_SHOTS[language] ?? HERO_SHOTS.en

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4">
      <header className="space-y-7 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-100 to-gray-300 shadow-2xl shadow-rose-950/40 ring-1 ring-white/20">
          <Image src="/assets/duet/icon.png" alt="LinArt Duet" width={72} height={72} priority />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-1.5 text-sm font-medium text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          {t.badge}
        </span>
        <div className="space-y-3">
          <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">LinArt Duet</h1>
          <p className="bg-gradient-to-r from-rose-300 via-gray-100 to-sky-300 bg-clip-text text-xl font-medium text-transparent md:text-2xl">
            {t.tagline}
          </p>
        </div>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">{t.subtitle}</p>
        <DownloadButton release={release} language={language} />
      </header>

      <div className="relative">
        <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 rounded-full bg-rose-700/15 blur-3xl" />
        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 ring-1 ring-white/5">
          <Image src={hero.src} alt="LinArt Duet" width={hero.width} height={hero.height} sizes="(min-width: 1152px) 1120px, 100vw" className="h-auto w-full" priority />
        </div>
      </div>

      <section className="grid gap-6 rounded-3xl border border-emerald-400/20 bg-emerald-500/[0.06] p-8 md:grid-cols-[auto_1fr] md:items-center md:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-emerald-900/40">
          <Check className="h-7 w-7 text-white" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white md:text-3xl">{t.freeTitle}</h2>
          <p className="text-lg text-gray-300">{t.freeText}</p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">{t.featuresTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.map(([title, text], index) => {
            const Icon = FEATURE_ICONS[index] ?? Columns2
            return (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-gray-900/60 p-6 backdrop-blur-xl transition-colors duration-300 hover:border-rose-400/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="grid gap-x-6 gap-y-10 md:grid-cols-2">
        {GALLERY.map((shot) => (
          <figure key={shot.src} className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/50 ring-1 ring-white/5">
              <Image src={shot.src} alt={shot.caption[language] ?? shot.caption.en} width={shot.width} height={shot.height} sizes="(min-width: 1152px) 548px, (min-width: 768px) 50vw, 100vw" className="h-auto w-full" />
            </div>
            <figcaption className="text-center text-sm text-gray-400">{shot.caption[language] ?? shot.caption.en}</figcaption>
          </figure>
        ))}
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white">{t.installTitle}</h2>
          <ol className="space-y-4">
            {t.steps.map(([title, text], index) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-sm font-bold text-white shadow-lg shadow-rose-950/40">
                  {index + 1}
                </span>
                <div className="space-y-1">
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm leading-relaxed text-gray-400">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white">{t.detailsTitle}</h2>
          <div className="space-y-5 rounded-2xl border border-white/10 bg-gray-900/60 p-6 backdrop-blur-xl">
            <dl className="space-y-3">
              {t.details.map(([label, value]) => (
                <div key={label} className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="text-sm font-medium text-gray-400">{label}</dt>
                  <dd className="text-sm text-gray-200">{value}</dd>
                </div>
              ))}
            </dl>
            {release && notes && (
              <div className="space-y-2 border-t border-white/10 pt-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  <RefreshCw className="h-4 w-4 text-rose-300" />
                  {t.whatsNew} {release.version}
                </p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-300">{notes}</p>
              </div>
            )}
            {release && (
              <div className="border-t border-white/10 pt-5">
                <Checksum value={release.sha256} language={language} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-gray-900/60 p-10 text-center backdrop-blur-xl">
        <ShieldCheck className="h-10 w-10 text-sky-300" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white md:text-3xl">{t.feedbackTitle}</h2>
          <p className="text-lg text-gray-300">{t.feedbackText}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <DownloadButton release={release} language={language} />
          <a
            href="mailto:vladimir@linart.club?subject=LinArt%20Duet"
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/15 px-6 py-4 font-semibold text-gray-100 transition hover:bg-white/10"
          >
            <Mail className="h-5 w-5" />
            {t.feedbackCta}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
