import { prisma } from "@/lib/db"
import { defaultContent, type HomepageContent } from "@/lib/content-config"
import { getTranslations } from "@/lib/translations"
import type { Language } from "@/lib/i18n-config"
import { emptyLocalizedString, type LocalizedHtml, type PageBlock } from "@/lib/editor/types"
import {
  SHOWCASE_COPY,
  buildAiOperatorItem,
  buildAppItems,
  buildColdartBlock,
  buildCrmIotData,
  buildDuetBlock,
  buildIotCloudData,
  buildTrustHighlights,
  withBrandLogos,
  PRIVATE_CLOUD_IMAGE,
  buildKidsLabItems,
  buildLinartIdItem,
  runHomeMigrations,
} from "@/lib/editor/migrations"

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

<h3>7a. Anfrage für einen Testzugang (CRM-IoT) und Kartenauswahl</h3>
<p>Über das Formular unter <strong>linart.club/tester</strong> können Sie einen kostenlosen Testzugang zu unserer Gastgeber-App CRM-IoT anfragen. Dabei verarbeiten wir die von Ihnen eingegebenen Angaben: Name, E-Mail-Adresse, optional Telefonnummer und Firma, Art und Anzahl Ihrer Unterkünfte, genutzte Buchungskanäle, Ihr Interesse an Automatisierung (Schlösser, Sensoren, Heizung, Klima), optional Adresse und den auf der Karte gesetzten Standort sowie Ihre Nachricht. Die IP-Adresse wird nur kurzzeitig im Arbeitsspeicher zur Missbrauchsabwehr (Begrenzung der Anfragen) genutzt und nicht gespeichert.</p>
<p><strong>Zweck und Speicherung:</strong> Bearbeitung Ihrer Anfrage, Freischaltung des Testzugangs und Kontaktaufnahme. Die Daten werden auf unserem Server in Deutschland gespeichert und gelöscht, sobald sie dafür nicht mehr erforderlich sind, spätestens 12 Monate nach Ende der Testphase, sofern kein Vertrag zustande kommt.</p>
<p><strong>Karte und Adresssuche:</strong> Die Karte wird erst geladen, wenn Sie auf „Karte anzeigen“, „Suchen“ oder „Mein Standort“ klicken. Dann ruft Ihr Browser Kartenkacheln und – für die Adresssuche – den Dienst Nominatim bei der OpenStreetMap Foundation (St John’s Innovation Centre, Cambridge, Vereinigtes Königreich) ab; dabei werden Ihre IP-Adresse und die Suchanfrage an die OpenStreetMap Foundation übertragen. Für das Vereinigte Königreich besteht ein Angemessenheitsbeschluss der EU-Kommission. „Mein Standort“ nutzt die Standortfunktion Ihres Browsers erst nach Ihrer Freigabe.<br>
<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung im Formular, jederzeit widerrufbar) und Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen).</p>

<h3>8. Eingebettete Videos (YouTube)</h3>
<p>Auf dieser Website werden Videos über YouTube eingebettet (Google Ireland Limited, Dublin). Beim Öffnen einer solchen Seite wird eine Verbindung zu YouTube-Servern aufgebaut. Wir nutzen YouTube im erweiterten Datenschutzmodus (youtube-nocookie.com), der laut Anbieter erst beim aktiven Abspielen Cookies setzt.<br>
<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.</p>

<h3>9. KI-Chat / Online-Beratung</h3>
<p>Auf dieser Website steht ein Chat-Fenster („LinArt AI Consultant") zur Verfügung. Das Chat-Skript wird von unserem eigenen Server <strong>ai.crm-iot.com</strong> geladen; erst wenn Sie den Chat öffnen und nutzen, werden Daten an diesen Server übertragen.</p>
<p><strong>Verarbeitete Daten:</strong> Ihre Chat-Nachrichten und die Antworten des Systems, ein zufällig erzeugter Sitzungs-Schlüssel, Zeitstempel sowie die technisch notwendigen Verbindungsdaten (IP-Adresse). Optional — und nur, wenn Sie sie selbst eingeben: Name, E-Mail-Adresse und Telefonnummer (bei der Weiterleitung an einen Mitarbeiter oder bei einer Terminbuchung) sowie Sprachnachrichten, die zur Texterkennung verarbeitet werden.</p>
<p><strong>Zweck:</strong> Beantwortung Ihrer Anfragen, Weiterleitung an einen menschlichen Mitarbeiter auf Ihren Wunsch und ggf. Terminvereinbarung.</p>
<p><strong>Speicherung:</strong> Der Gesprächsverlauf wird auf unserem eigenen Server in Deutschland gespeichert und aufbewahrt, solange dies zur Bearbeitung Ihres Anliegens und zur Nachvollziehbarkeit der Beratung erforderlich ist; anschließend wird er gelöscht, sofern keine gesetzliche Aufbewahrungspflicht besteht. Auf Anfrage löschen wir Ihren Gesprächsverlauf jederzeit. Im Browser wird zusätzlich ein Sitzungs-Schlüssel („linart_sid") im lokalen Speicher abgelegt, damit Ihr Gespräch beim Neuladen der Seite erhalten bleibt; er enthält keine personenbezogenen Daten und ist für den von Ihnen angeforderten Dienst technisch erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).</p>
<p><strong>Eingesetzte KI:</strong> Die Antworten werden von einem selbst betriebenen Sprachmodell (Open-Source-Modell auf eigener Hardware) erzeugt. Auch die Spracherkennung für Sprachnachrichten und die automatische Übersetzung laufen auf unseren eigenen Servern. <strong>Es werden keine Daten an externe KI-Anbieter (z. B. OpenAI, Google) übermittelt</strong> und keine Daten in Drittländer außerhalb der EU übertragen.</p>
<p><strong>Bitte beachten:</strong> Geben Sie im Chat keine besonderen Kategorien personenbezogener Daten (z. B. Gesundheitsdaten) ein.<br>
<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an effizienter Kundenkommunikation) bzw. Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage der Anbahnung oder Erfüllung eines Vertrags dient.</p>

<h3>10. Cookies</h3>
<p>Wir verwenden ausschließlich technisch notwendige Cookies für die Sitzungsverwaltung (Login-Status). Tracking- oder Analyse-Cookies werden nicht eingesetzt. Notwendige Cookies erfordern keine gesonderte Einwilligung (§ 25 Abs. 2 TDDDG).</p>

<h3>11. Keine Analyse-Tools</h3>
<p>Wir verwenden keine Analyse- oder Tracking-Dienste (kein Google Analytics, kein Facebook Pixel o. Ä.). Es werden keine Nutzerprofile erstellt und keine Daten zu Werbezwecken weitergegeben.</p>

<h3>12. Ihre Rechte</h3>
<p>Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Erteilte Einwilligungen können Sie jederzeit widerrufen (Art. 7 Abs. 3 DSGVO).</p>
<p>Anfragen richten Sie bitte an: <a href="mailto:vladimir@linart.club">vladimir@linart.club</a></p>

<h3>13. Beschwerderecht</h3>
<p>Sie haben das Recht, sich bei der zuständigen Datenschutzbehörde zu beschweren. Für Bayern:<br>
<strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong><br>
Promenade 27, 91522 Ansbach — <a href="https://www.lda.bayern.de">www.lda.bayern.de</a></p>

<h3>14. Externe Dienste</h3>
<p>Unsere weiteren Dienste (IoT-Plattform und Gastgeber-App CRM-IoT host.crm-iot.com, Fotoplattform photo.linart.club, Cloud-Speicher nex.crm-iot.com, KI-Beratung ai.crm-iot.com) verfügen über eigene Datenschutzhinweise, die beim jeweiligen Dienst einsehbar sind. Diese Dienste werden auf eigenem Server in Bayern, Deutschland betrieben.</p>

<p><em>Stand: Oktober 2026</em></p>`

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

const buildPillarsHtml = (): LocalizedHtml => {
  const result = emptyLocalized()
  for (const lang of LANGS) {
    const p = getTranslations(lang).pillars
    result[lang] =
      `<ul><li><strong>${p.business.title}</strong> — ${p.business.description}</li>` +
      `<li><strong>${p.content.title}</strong> — ${p.content.description}</li>` +
      `<li><strong>${p.tech.title}</strong> — ${p.tech.description}</li></ul>`
  }
  return result
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

  const blocks: PageBlock[] = withBrandLogos([
    // 1. Hero
    {
      id: "hero",
      type: "hero",
      data: {
        badge: SHOWCASE_COPY.hero.badge,
        title: SHOWCASE_COPY.hero.title,
        subtitle: SHOWCASE_COPY.hero.subtitle,
        description: SHOWCASE_COPY.hero.description,
        primaryCta: { label: SHOWCASE_COPY.hero.primaryCta, url: "#projects" },
        secondaryCta: { label: SHOWCASE_COPY.hero.secondaryCta, url: "#contact" },
        highlights: buildTrustHighlights(),
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
      data: buildIotCloudData(),
    },
    // 3. CRM-IoT — rentals host app, open beta (showcase layout: steps + host calendar screenshot)
    {
      id: "crm-iot",
      type: "project",
      data: buildCrmIotData(),
    },
    // 4. Private cloud — same style as IoT server
    {
      id: "cloud-services",
      type: "project",
      data: {
        title: portfolioText.cloud.title,
        description: portfolioText.cloud.description,
        image: { url: PRIVATE_CLOUD_IMAGE, alt: emptyLocalized(), width: 420, height: 420 },
        linkLabel: SHOWCASE_COPY.cloudRequest,
        linkUrl: `mailto:${SHOWCASE_COPY.contact.email}?subject=Private%20Cloud%20invite`,
        align: "left",
        badge: { label: SHOWCASE_COPY.badges.live, tone: "live" },
        secondaryLink: { label: SHOWCASE_COPY.cloudSignIn, url: "/login" },
      },
    },
    // 5. ColdART — remote access & zero trust
    buildColdartBlock(),
    // 5b. LinArt Duet — free Windows file manager
    buildDuetBlock(),
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
            kind: "image",
            title: SHOWCASE_COPY.smartHubStore.title,
            description: SHOWCASE_COPY.smartHubStore.description,
            embedUrl: "",
            imageUrl: "",
            linkLabel: SHOWCASE_COPY.smartHubStore.linkLabel,
            linkUrl: content.portfolio?.sensorHub?.linkUrl || "https://shop.linart.club/en",
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
          buildAiOperatorItem(),
          ...buildAppItems(),
          buildLinartIdItem(),
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
    // 7. Kids Lab — browser games built by the kids (free for everyone)
    {
      id: "entertainment",
      type: "portfolio",
      data: {
        title: SHOWCASE_COPY.kidsLab.title,
        subtitle: SHOWCASE_COPY.kidsLab.subtitle,
        items: buildKidsLabItems(),
      },
    },
    // 8. About — the personal story that used to be the hero
    {
      id: "about",
      type: "richText",
      data: {
        width: "narrow",
        content: buildLocalized(
          (lang) =>
            `<h2>${SHOWCASE_COPY.about.title[lang]}</h2><p>${heroText.description[lang]}</p>${buildPillarsHtml()[lang]}`
        ),
      },
    },
    // 9. Callout
    {
      id: "callout",
      type: "cta",
      data: {
        title: calloutText.title,
        description: calloutText.description,
        buttonLabel: SHOWCASE_COPY.callout.buttonLabel,
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
        email: SHOWCASE_COPY.contact.email,
        phone: "",
        address: SHOWCASE_COPY.contact.address,
      },
    },
  ])

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

  // One-off content fixes for an already-seeded live home page (see migrations.ts).
  await runHomeMigrations(buildPillarsHtml())
}

