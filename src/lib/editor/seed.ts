import { prisma } from "@/lib/db"
import { defaultContent, type HomepageContent } from "@/lib/content-config"
import { getTranslations } from "@/lib/translations"
import type { Language } from "@/lib/i18n-config"
import { emptyLocalizedString, type PageBlock, type PortfolioBlock } from "@/lib/editor/types"

const LANGS: Language[] = ["en", "de", "ru"]

const isReadableText = (value: string | undefined) => {
  if (!value) return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (/^\?+$/.test(trimmed)) return false
  if (/[\u00d0\u00d1]/.test(trimmed)) return false
  return /[\p{L}\p{N}]/u.test(trimmed)
}

const pickText = (value: string | undefined, fallback: string) =>
  isReadableText(value) ? value!.trim() : fallback

const emptyLocalized = () => ({
  en: "",
  de: "",
  ru: "",
})

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function deepMerge<T>(base: T, override: Partial<T>): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override as T) ?? base
  }

  const result = { ...(base as Record<string, unknown>) }
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue
    const baseValue = result[key]
    result[key] = isPlainObject(baseValue) && isPlainObject(value)
      ? deepMerge(baseValue, value)
      : value
  }
  return result as T
}

const buildLocalized = (
  getter: (lang: Language) => string
) => {
  const result = emptyLocalized()
  for (const lang of LANGS) {
    result[lang] = getter(lang)
  }
  return result
}

function readContent(value?: unknown): HomepageContent {
  if (!isPlainObject(value)) return defaultContent
  return deepMerge(defaultContent, value as Partial<HomepageContent>)
}

// ---------------------------------------------------------------------------
// Legal page HTML constants (German — standard for German law pages)
// Note: sanitize-html allows h2, h3, p, br, strong, em, ul, ol, li, a, div, span
// ---------------------------------------------------------------------------

const IMPRESSUM_HTML = `<h2>Impressum</h2>
<p>Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</p>

<h3>Anbieter</h3>
<p>Vladimir Linartas<br>Lange Gasse 35<br>91174 Spalt<br>Deutschland</p>

<h3>Kontakt</h3>
<p>E-Mail: <a href="mailto:vladimir@linart.club">vladimir@linart.club</a></p>

<h3>Hosting</h3>
<p>Diese Website wird technisch betrieben durch:<br>
<strong>1&amp;1 IONOS SE</strong><br>
Elgendorfer Str. 57, 56410 Montabaur<br>
<a href="https://www.ionos.de">www.ionos.de</a><br>
Zwischen uns und IONOS besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO. Die Server befinden sich in Deutschland.</p>

<h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
<p>Vladimir Linartas<br>Lange Gasse 35<br>91174 Spalt</p>

<h3>EU-Streitschlichtung</h3>
<p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:<br>
<a href="https://ec.europa.eu/consumers/odr/">https://ec.europa.eu/consumers/odr/</a><br>
Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

<h3>Haftung für Inhalte</h3>
<p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>

<h3>Haftung für Links</h3>
<p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.</p>

<h3>Urheberrecht</h3>
<p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors.</p>`

const DATENSCHUTZ_HTML = `<h2>Datenschutzerklärung</h2>

<h3>1. Verantwortlicher</h3>
<p>Vladimir Linartas<br>Lange Gasse 35<br>91174 Spalt<br>Deutschland<br>
E-Mail: <a href="mailto:vladimir@linart.club">vladimir@linart.club</a></p>

<h3>2. Hosting und Server-Logfiles</h3>
<p>Diese Website wird gehostet von <strong>1&amp;1 IONOS SE</strong>, Elgendorfer Str. 57, 56410 Montabaur (<a href="https://www.ionos.de">www.ionos.de</a>). Mit IONOS besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO. Alle Server stehen in Deutschland.</p>
<p>Beim Aufruf der Website erfasst der Webserver automatisch Server-Logfiles: IP-Adresse, Datum/Uhrzeit des Zugriffs, aufgerufene Seiten, Browser und Betriebssystem. Diese Daten werden nicht mit anderen Quellen zusammengeführt und nach 7 Tagen gelöscht, sofern keine gesetzliche Aufbewahrungspflicht besteht.<br>
<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</p>

<h3>3. SSL-/TLS-Verschlüsselung</h3>
<p>Diese Website nutzt SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie am „https://" in der Adresszeile Ihres Browsers. Dabei können Daten, die Sie übermitteln, nicht von Dritten mitgelesen werden.</p>

<h3>4. Registrierung und Benutzerkonto</h3>
<p>Zur Registrierung benötigen wir Ihre E-Mail-Adresse und ein Passwort. Ein Name ist optional. Passwörter werden ausschließlich als kryptografischer Hash gespeichert — Ihr Klartextpasswort ist uns nicht bekannt. Ihre Daten werden auf IONOS-Servern in Deutschland verarbeitet. Sie können Ihr Konto jederzeit löschen lassen.<br>
<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>

<h3>5. Anmeldung via Google (OAuth)</h3>
<p>Wenn Sie sich mit Google anmelden, wird eine Verbindung zu Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland hergestellt. Google übermittelt uns Ihre E-Mail-Adresse und ggf. Ihren Namen. Weitere Informationen: <a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a>.<br>
<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</p>

<h3>6. Community-Chat</h3>
<p>Nachrichten im Community-Chat werden auf unseren Servern gespeichert. Nur registrierte Nutzer können teilnehmen. Chat-Nachrichten können auf Anfrage gelöscht werden.<br>
<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO.</p>

<h3>7. Kontaktanfragen</h3>
<p>Wenn Sie uns per E-Mail oder Kontaktformular kontaktieren, werden Ihre Angaben zur Bearbeitung gespeichert und danach gelöscht, sofern keine gesetzliche Aufbewahrungspflicht besteht.<br>
<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.</p>

<h3>8. Eingebettete Videos (YouTube)</h3>
<p>Auf dieser Website werden Videos über YouTube eingebettet (Google Ireland Limited, Dublin). Beim Öffnen einer solchen Seite wird eine Verbindung zu YouTube-Servern aufgebaut. Wir nutzen YouTube im erweiterten Datenschutzmodus (youtube-nocookie.com), der laut Anbieter erst beim aktiven Abspielen Cookies setzt.<br>
<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.</p>

<h3>9. Cookies</h3>
<p>Wir verwenden ausschließlich technisch notwendige Cookies für die Sitzungsverwaltung (Login-Status). Tracking- oder Analyse-Cookies werden nicht eingesetzt. Notwendige Cookies erfordern keine gesonderte Einwilligung (§ 25 Abs. 2 TDDDG).</p>

<h3>10. Keine Analyse-Tools</h3>
<p>Wir verwenden keine Analyse- oder Tracking-Dienste (kein Google Analytics, kein Facebook Pixel o. Ä.). Es werden keine Nutzerprofile erstellt und keine Daten zu Werbezwecken weitergegeben.</p>

<h3>11. Ihre Rechte</h3>
<p>Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Erteilte Einwilligungen können Sie jederzeit widerrufen (Art. 7 Abs. 3 DSGVO).</p>
<p>Anfragen richten Sie bitte an: <a href="mailto:vladimir@linart.club">vladimir@linart.club</a></p>

<h3>12. Beschwerderecht</h3>
<p>Sie haben das Recht, sich bei der zuständigen Datenschutzbehörde zu beschweren. Für Bayern:<br>
<strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong><br>
Promenade 27, 91522 Ansbach — <a href="https://www.lda.bayern.de">www.lda.bayern.de</a></p>

<h3>13. Externe Dienste</h3>
<p>Unsere weiteren Dienste (IoT-Plattform host.linart.club, Fotoplattform photo.linart.club, Cloud-Speicher cloud.crm-iot.com) verfügen über eigene Datenschutzhinweise, die beim jeweiligen Dienst einsehbar sind. Diese Dienste werden auf eigenem Server in Bayern, Deutschland betrieben.</p>

<p><em>Stand: April 2026</em></p>`

// Creates a static page (e.g. Impressum, Datenschutz) only if it doesn't exist yet.
// Does NOT overwrite, so admin edits to these pages persist across restarts.
async function ensureStaticPage(slug: string, title: string, html: string) {
  const existing = await prisma.page.findUnique({ where: { slug } })
  if (existing) return

  const blocks: PageBlock[] = [
    {
      id: "content",
      type: "richText",
      data: {
        content: { en: html, de: html, ru: html },
        width: "full",
      },
    },
  ]

  const page = await prisma.page.create({ data: { slug, title } })
  const revision = await prisma.pageRevision.create({
    data: { pageId: page.id, title, blocks },
  })
  await prisma.page.update({
    where: { id: page.id },
    data: { draftRevisionId: revision.id, publishedRevisionId: revision.id },
  })
}

export async function ensureDefaultPages() {
  const count = await prisma.page.count()

  const contentRow = await prisma.siteConfig.findUnique({ where: { key: "content" } })
  const content = readContent(contentRow?.value)

  const heroText = {
    badge: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.hero?.badge
      const legacy = lang === "en" ? content.hero.badge : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).hero.badge))
    }),
    name: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.hero?.name
      const legacy = lang === "en" ? content.hero.name : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).hero.name))
    }),
    subtitle: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.hero?.subtitle
      const legacy = lang === "en" ? content.hero.subtitle : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).hero.subtitle))
    }),
    description: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.hero?.description
      const legacy = lang === "en" ? content.hero.description : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).hero.description))
    }),
  }

  const ctaText = {
    primaryButton: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.cta?.primaryButton
      const legacy = lang === "en" ? content.cta.primaryButton : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).cta.primary))
    }),
    secondaryButton: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.cta?.secondaryButton
      const legacy = lang === "en" ? content.cta.secondaryButton : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).cta.secondary))
    }),
  }

  const calloutText = {
    title: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.callout?.title
      const legacy = lang === "en" ? content.callout.title : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).callout.title))
    }),
    description: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.callout?.description
      const legacy = lang === "en" ? content.callout.description : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).callout.description))
    }),
  }

  const chatText = {
    title: buildLocalized((lang) => getTranslations(lang).chat.title),
    description: buildLocalized((lang) => getTranslations(lang).chat.description),
  }

  const portfolioText = {
    title: buildLocalized((lang) => {
      const overrides = content.portfolio?.locales?.[lang]?.title
      return pickText(overrides, getTranslations(lang).portfolio.title)
    }),
    subtitle: buildLocalized((lang) => {
      const overrides = content.portfolio?.locales?.[lang]?.subtitle
      return pickText(overrides, getTranslations(lang).portfolio.subtitle)
    }),
    minecraft: {
      title: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.minecraft?.title
        return pickText(overrides, getTranslations(lang).portfolio.minecraft.title)
      }),
      description: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.minecraft?.description
        return pickText(overrides, getTranslations(lang).portfolio.minecraft.description)
      }),
      linkLabel: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.minecraft?.linkLabel
        return pickText(overrides, getTranslations(lang).portfolio.minecraft.linkLabel)
      }),
    },
    sensorHub: {
      title: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.sensorHub?.title
        return pickText(overrides, getTranslations(lang).portfolio.sensorHub.title)
      }),
      description: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.sensorHub?.description
        return pickText(overrides, getTranslations(lang).portfolio.sensorHub.description)
      }),
      linkLabel: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.sensorHub?.linkLabel
        return pickText(overrides, getTranslations(lang).portfolio.sensorHub.linkLabel)
      }),
    },
    commercial: {
      title: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.commercial?.title
        return pickText(overrides, getTranslations(lang).portfolio.commercial.title)
      }),
      description: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.commercial?.description
        return pickText(overrides, getTranslations(lang).portfolio.commercial.description)
      }),
      linkLabel: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.commercial?.linkLabel
        return pickText(overrides, getTranslations(lang).portfolio.commercial.linkLabel)
      }),
    },
    qrGenerator: {
      title: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.qrGenerator?.title
        return pickText(overrides, getTranslations(lang).portfolio.qrGenerator.title)
      }),
      description: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.qrGenerator?.description
        return pickText(overrides, getTranslations(lang).portfolio.qrGenerator.description)
      }),
      linkLabel: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.qrGenerator?.linkLabel
        return pickText(overrides, getTranslations(lang).portfolio.qrGenerator.linkLabel)
      }),
    },
    hostLinart: {
      title: buildLocalized((lang) => getTranslations(lang).portfolio.hostLinart.title),
      description: buildLocalized((lang) => getTranslations(lang).portfolio.hostLinart.description),
      linkLabel: buildLocalized((lang) => getTranslations(lang).portfolio.hostLinart.linkLabel),
    },
    crmIot: {
      title: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.title),
      description: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.description),
      ctaTitle: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.ctaTitle),
      ctaDescription: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.ctaDescription),
      ctaButton: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.ctaButton),
      linkLabel: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.linkLabel),
    },
    entertainment: {
      title: buildLocalized((lang) => getTranslations(lang).portfolio.entertainment.title),
      subtitle: buildLocalized((lang) => getTranslations(lang).portfolio.entertainment.subtitle),
    },
    cloud: {
      title: buildLocalized((lang) => getTranslations(lang).portfolio.cloud.title),
      description: buildLocalized((lang) => getTranslations(lang).portfolio.cloud.description),
    },
  }

  const blocks: PageBlock[] = [
    // 1. Hero
    {
      id: "hero",
      type: "hero",
      data: {
        badge: heroText.badge,
        title: heroText.name,
        subtitle: heroText.subtitle,
        description: heroText.description,
        primaryCta: { label: ctaText.primaryButton, url: "#projects" },
        secondaryCta: { label: ctaText.secondaryButton, url: "#contact" },
        image: {
          url: content.media?.heroImageUrl || "",
          alt: {
            en: content.media?.heroImageAlt || heroText.name.en,
            de: content.media?.heroImageAlt || heroText.name.de,
            ru: content.media?.heroImageAlt || heroText.name.ru,
          },
        },
      },
    },
    // 2. IoT Private Server — featured first
    {
      id: "iot-server",
      type: "project",
      data: {
        title: portfolioText.hostLinart.title,
        description: portfolioText.hostLinart.description,
        image: { url: "", alt: emptyLocalized() },
        linkLabel: portfolioText.hostLinart.linkLabel,
        linkUrl: "https://host.linart.club/",
        align: "left",
      },
    },
    // 3. CRM-IoT — second, same style as IoT server
    {
      id: "crm-iot",
      type: "project",
      data: {
        title: portfolioText.crmIot.title,
        description: portfolioText.crmIot.description,
        image: { url: "", alt: emptyLocalized() },
        linkLabel: portfolioText.crmIot.linkLabel,
        linkUrl: "mailto:info@linart.club?subject=Smart%20Lock%20Request",
        align: "left",
      },
    },
    // 4. Private cloud — same style as IoT server
    {
      id: "cloud-services",
      type: "project",
      data: {
        title: portfolioText.cloud.title,
        description: portfolioText.cloud.description,
        image: { url: "", alt: emptyLocalized() },
        linkLabel: buildLocalized((lang) =>
          lang === "ru" ? "Запросить доступ" : lang === "de" ? "Zugang anfragen" : "Request Access"
        ),
        linkUrl: "mailto:info@linart.club?subject=Cloud%20Access%20Request",
        align: "left",
      },
    },
    // 6. Main portfolio — other projects
    {
      id: "portfolio",
      type: "portfolio",
      data: {
        title: portfolioText.title,
        subtitle: portfolioText.subtitle,
        items: [
          {
            id: "sensorhub",
            kind: "video",
            title: portfolioText.sensorHub.title,
            description: portfolioText.sensorHub.description,
            embedUrl: content.portfolio?.sensorHub?.videoUrl || "",
            imageUrl: "",
            linkLabel: portfolioText.sensorHub.linkLabel,
            linkUrl: content.portfolio?.sensorHub?.linkUrl || "",
          },
          {
            id: "qr-generator",
            kind: "image",
            title: portfolioText.qrGenerator.title,
            description: portfolioText.qrGenerator.description,
            embedUrl: "",
            imageUrl:
              content.portfolio?.qrGenerator?.imageUrl ||
              "/assets/qr-generator-cover.svg",
            linkLabel: portfolioText.qrGenerator.linkLabel,
            linkUrl:
              content.portfolio?.qrGenerator?.linkUrl ||
              "https://qr.linart.club/",
          },
          {
            id: "commercial",
            kind: "locked",
            title: portfolioText.commercial.title,
            description: portfolioText.commercial.description,
            embedUrl: "",
            imageUrl: "",
            linkLabel: portfolioText.commercial.linkLabel,
            linkUrl: content.portfolio?.commercial?.linkUrl || "",
          },
        ],
      },
    },
    // 7. Entertainment section — Minecraft map
    {
      id: "entertainment",
      type: "portfolio",
      data: {
        title: portfolioText.entertainment.title,
        subtitle: portfolioText.entertainment.subtitle,
        items: [
          {
            id: "minecraft",
            kind: "map",
            title: portfolioText.minecraft.title,
            description: portfolioText.minecraft.description,
            embedUrl: content.portfolio?.minecraft?.mapUrl || "",
            imageUrl: "",
            linkLabel: portfolioText.minecraft.linkLabel,
            linkUrl: content.portfolio?.minecraft?.linkUrl || "",
          },
        ],
      },
    },
    // 8. Community chat
    {
      id: "chat",
      type: "chat",
      data: {
        title: chatText.title,
        description: chatText.description,
      },
    },
    // 9. Callout
    {
      id: "callout",
      type: "cta",
      data: {
        title: calloutText.title,
        description: calloutText.description,
        buttonLabel: buildLocalized((lang) => getTranslations(lang).cta.primary),
        buttonUrl: "#contact",
      },
    },
    // 10. Contact
    {
      id: "contact",
      type: "contact",
      data: {
        title: emptyLocalizedString(),
        description: emptyLocalizedString(),
        email: "",
        phone: "",
        address: emptyLocalizedString(),
      },
    },
  ]

  if (count > 0) {
    // Pages already exist — only create the home page if it's missing.
    // NEVER overwrite an existing home page with seed data, or editor
    // changes will be silently lost on every page visit.
    const existing = await prisma.page.findUnique({ where: { slug: "home" } })
    if (!existing) {
      const page = await prisma.page.create({
        data: { slug: "home", title: "Home" },
      })
      const revision = await prisma.pageRevision.create({
        data: { pageId: page.id, title: "Home", blocks },
      })
      await prisma.page.update({
        where: { id: page.id },
        data: { draftRevisionId: revision.id, publishedRevisionId: revision.id },
      })
    }
  } else {
    const page = await prisma.page.create({
      data: {
        slug: "home",
        title: "Home",
      },
    })

    const revision = await prisma.pageRevision.create({
      data: {
        pageId: page.id,
        title: "Home",
        blocks,
      },
    })

    await prisma.page.update({
      where: { id: page.id },
      data: {
        draftRevisionId: revision.id,
        publishedRevisionId: revision.id,
      },
    })
  }

  await ensureStaticPage("impressum", "Impressum", IMPRESSUM_HTML)
  await ensureStaticPage("datenschutz", "Datenschutz", DATENSCHUTZ_HTML)
}

const normalizeUrl = (value: string | undefined) =>
  (value || "").trim().replace(/\/+$/, "")

async function ensureHomeHasQrProject(
  content: HomepageContent,
  portfolioText: {
    title: ReturnType<typeof buildLocalized>
    subtitle: ReturnType<typeof buildLocalized>
    minecraft: {
      title: ReturnType<typeof buildLocalized>
      description: ReturnType<typeof buildLocalized>
      linkLabel: ReturnType<typeof buildLocalized>
    }
    sensorHub: {
      title: ReturnType<typeof buildLocalized>
      description: ReturnType<typeof buildLocalized>
      linkLabel: ReturnType<typeof buildLocalized>
    }
    commercial: {
      title: ReturnType<typeof buildLocalized>
      description: ReturnType<typeof buildLocalized>
      linkLabel: ReturnType<typeof buildLocalized>
    }
    qrGenerator: {
      title: ReturnType<typeof buildLocalized>
      description: ReturnType<typeof buildLocalized>
      linkLabel: ReturnType<typeof buildLocalized>
    }
  }
) {
  const page = await prisma.page.findUnique({
    where: { slug: "home" },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })

  if (!page) return

  const sourceRevision = page.draftRevision || page.publishedRevision
  if (!sourceRevision || !Array.isArray(sourceRevision.blocks)) return

  const blocks = sourceRevision.blocks as PageBlock[]
  const targetUrl = normalizeUrl(
    content.portfolio?.qrGenerator?.linkUrl || "https://qr.linart.club/"
  )
  let nextBlocks = [...blocks]
  let updated = false

  nextBlocks = nextBlocks.filter((block) => {
    if (block.type !== "project") return true
    const link = normalizeUrl(block.data.linkUrl)
    const isQr = block.id === "qr-highlight" || link === targetUrl
    if (isQr) updated = true
    return !isQr
  })

  const portfolioIndex = nextBlocks.findIndex((block) => block.type === "portfolio")
  if (portfolioIndex >= 0) {
    const portfolioBlock = nextBlocks[portfolioIndex] as PortfolioBlock
    const items = Array.isArray(portfolioBlock.data.items) ? portfolioBlock.data.items : []
    const alreadyExists = items.some((item) => {
      if (item.id === "qr-generator") return true
      const link = normalizeUrl(item.linkUrl)
      return link === targetUrl
    })

    if (!alreadyExists) {
      const nextItem = {
        id: "qr-generator",
        kind: "image" as const,
        title: portfolioText.qrGenerator.title,
        description: portfolioText.qrGenerator.description,
        embedUrl: "",
        imageUrl:
          content.portfolio?.qrGenerator?.imageUrl ||
          "/assets/qr-generator-cover.svg",
        linkLabel: portfolioText.qrGenerator.linkLabel,
        linkUrl:
          content.portfolio?.qrGenerator?.linkUrl ||
          "https://qr.linart.club/",
      }

      const nextBlock: PortfolioBlock = {
        ...portfolioBlock,
        data: {
          ...portfolioBlock.data,
          items: [...items, nextItem],
        },
      }

      nextBlocks = nextBlocks.map((block, index) =>
        index === portfolioIndex ? nextBlock : block
      )
      updated = true
    }
  }

  if (!updated) return

  const revision = await prisma.pageRevision.create({
    data: {
      pageId: page.id,
      title: sourceRevision.title || page.title,
      blocks: nextBlocks,
    },
  })

  const update: {
    draftRevisionId: string
    publishedRevisionId?: string | null
  } = {
    draftRevisionId: revision.id,
  }

  if (!page.draftRevisionId || page.draftRevisionId === page.publishedRevisionId) {
    update.publishedRevisionId = revision.id
  }

  await prisma.page.update({
    where: { id: page.id },
    data: update,
  })
}
