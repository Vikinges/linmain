// German translations (Deutsch)

import { Translations } from "./en"

export const de: Translations = {
  hero: {
    badge: "Immer neugierig auf Neues",
    name: "LInArt Labs",
    subtitle: "Unternehmer • Creator • Entwickler",
    description:
      "Ich war schon immer neugierig, Neues auszuprobieren – und noch besser: selbst etwas Nützliches zu bauen. Gute Leute, lasst uns zusammenkommen! Qualität zählt mehr als Quantität.",
  },
  pillars: {
    business: {
      title: "Business",
      description:
        "20+ Jahre Führungserfahrung in unterschiedlichen Unternehmen. Ich baue Teams aus Menschen, die handeln, nicht nur reden.",
    },
    content: {
      title: "Content",
      description:
        "Ich erstelle Videos und Materialien, die Ideen einfach und klar erklären. Das Wichtigste ist, nützlich zu sein.",
    },
    tech: {
      title: "Entwicklung",
      description:
        "Vom Konzept bis zum fertigen Produkt – ich baue Dinge gern selbst. Elektronik, Software, alles, was man anfassen kann.",
    },
  },
  portfolio: {
    title: "Projekte ansehen",
    subtitle:
      "Live-Karten, eingebettete Demos und private Infrastruktur an einem Ort.",
    minecraft: {
      title: "Minecraft-Server-Karte",
      description:
        "<p>Mein eigener Server für Abonnenten und Kinder. Diese Seite zeigt die Live-Karte – so kannst du in Echtzeit sehen, wie andere spielen. Klick auf die Karte, um sie im Vollbild zu öffnen.</p><ul><li><strong>Java Edition:</strong> 85.215.32.66:25565</li><li><strong>Bedrock Edition:</strong> 85.215.32.66:19132</li></ul><p>Testprojekt und eines meiner privaten DevOps-Projekte.</p>",
      linkLabel: "Karte öffnen",
    },
    sensorHub: {
      title: "SensorHub",
      description:
        "<p>SensorHub ist ein stromsparender ESP32-C3-Knoten für Luftqualität und Temperatur/Feuchte. Er schreibt NDJSON lokal, weckt das OLED per Taste und lädt periodisch zur API über eine sichere Web-Konfiguration.</p><ul><li>ESP32-C3 + I2C-Sensoren (BME280/BME680)</li><li>0,96\" OLED (SSD1306)</li><li>Akku + Solar, Deep Sleep</li></ul>",
      linkLabel: "Zum Video",
    },
    commercial: {
      title: "Commercial Hub",
      description:
        "<p>Kommerzielle Projekte und Hosting unter hub.linart.club. Zugriff nur mit Passwort.</p>",
      linkLabel: "Hub öffnen",
    },
    qrGenerator: {
      title: "QR Generator",
      description:
        "<p>QR-Generator fuer Business: digitale Visitenkarten, Meeting-Check-ins und Team-Trainingsflows.</p><p>Viele Funktionen gratis, Upgrades kosten etwa einen Kaffee.</p>",
      linkLabel: "QR Generator oeffnen",
    },
    hostLinart: {
      title: "Privater IoT-Server",
      description:
        "<p>Unsere private mandantenfähige IoT-Management-Plattform. Gerätedaten bleiben auf einem Server, <strong>dem du vertrauen kannst</strong> — nicht in irgendeiner fremden Cloud. Der Server steht lokal in Bayern und wird von echter Alpenluft gekühlt 🏔️</p><h3>Tarife</h3><ul><li>🎁 <strong>Hardware-Käufer</strong> — 1 Jahr KOSTENLOS</li><li>⚡ <strong>Geeks</strong> — ab 1,99€/Monat</li><li>🏢 <strong>B2B Cloud</strong> — ab 49€/Monat</li><li>🏆 <strong>Enterprise</strong> — Custom</li></ul><p><strong>🎉 Willkommen, erste Käufer!</strong> Wer unsere Hardware gekauft hat, erhält kostenlosen Jahres-Zugang — weil ihr etwas Seltenes erleben werdet: <strong>extreme Updates jeden einzelnen Tag.</strong> Neue Features und Möglichkeiten entstehen in Echtzeit. Ihr seid nicht nur Kunden — ihr seid Mitgestalter. Wir hören auf eure Ideen, wählen die interessantesten aus und bauen sie — manchmal schon am nächsten Tag. Wie die ersten Apple-Kunden wart ihr von Anfang an dabei. Diese Geschichte ist etwas wert.</p>",
      linkLabel: "Tarife ansehen",
    },
    crmIot: {
      title: "CRM-IoT — Smarte Mietautomatisierung",
      description:
        "<p>B2B-Plattform für Hotels, Ferienhäuser und Apartments, die ihre <strong>Immobilien effizienter monetarisieren</strong> möchten — durch IoT-Infrastruktur.</p><ul><li>Automatisches Check-in/Check-out über Smart Locks</li><li>Fingerabdruckscanner + Tastatur + NFC + drahtlose Schlüssel</li><li>Online-Modus (CRM-Sync) + Offline-Modus (vorgeladene Codes)</li><li>Geschützt durch unsere private europäische IoT-Infrastruktur</li></ul><p>Du kannst bereits eine Anfrage stellen und ein elektronisches Türschloss bestellen — wir melden uns persönlich bei dir.</p>",
      ctaTitle: "Smart Lock anfragen",
      ctaDescription:
        "Elektronisches Türschloss mit Fingerabdruckscanner, digitaler Tastatur, NFC und drahtlosen Schlüsseln. Erste Bestellungen zum Early-Adopter-Preis.",
      ctaButton: "Jetzt anfragen",
      linkLabel: "Mehr erfahren",
    },
    entertainment: {
      title: "Unterhaltung",
      subtitle: "Projekte zum Spaß und für Experimente",
    },
    cloud: {
      title: "Private Cloud — Deine Daten bleiben hier",
      description:
        "<p>Cloud-Dienste für die, denen wir vertrauen — und die uns vertrauen. Deine Daten liegen auf unserem geschützten Server <strong>in Bayern, Deutschland</strong>, der von echter Alpenluft gekühlt wird 🏔️ — nicht irgendwo in einem amerikanischen Rechenzentrum. Wir analysieren deine Daten nie und verkaufen deine Vorlieben an niemanden. Alles lokal, alles deins.</p><p><strong>📷 Immich</strong> — selbst gehostete Alternative zu Google Fotos. KI-Suche, Gesichtserkennung, Alben, Teilen — aber deine Fotos verlassen unseren Server nie. Zugang: <a href='https://photo.linart.club'>photo.linart.club</a></p><p><strong>☁️ Nextcloud</strong> — persönliche Cloud: Dateien, Kalender, Kontakte, Dokumente. Wie Dropbox oder Google Drive — aber privat, in Europa, unter deiner Kontrolle. Zugang: <a href='https://cloud.crm-iot.com'>cloud.crm-iot.com</a></p><p>Zugang auf Einladung für vertrauenswürdige Nutzer. Schreib uns, wenn du mitmachen möchtest.</p>",
    },
    placeholders: {
      mapMissing: "Map-Embed-URL im Admin-Bereich hinzufügen.",
      videoMissing:
        "YouTube-Link im Admin-Bereich hinzufügen, um den Player zu zeigen.",
      lockedHint: "Privater Zugriff. Passwort erforderlich.",
      mediaMissing: "Medien nicht gesetzt.",
    },
  },
  cta: {
    primary: "Projekte ansehen",
    secondary: "Kontaktieren",
  },
  callout: {
    title: "Lass uns zusammenarbeiten",
    description:
      "Ich suche gute Leute für interessante Projekte. Qualität zählt mehr als Quantität. Wenn du Lust hast, gemeinsam nützliche Dinge zu bauen, melde dich.",
  },
  chat: {
    title: "Community-Chat",
    description: "Live-Chat für registrierte Nutzer. Anti-Spam-Limits sind aktiv.",
  },
  auth: {
    loginTitle: "Willkommen zurück",
    loginSubtitle: "Melde dich bei deinem Konto an",
    registerTitle: "Konto erstellen",
    registerSubtitle: "Registriere dich, um zu starten",
    continueWithGoogle: "Mit Google fortfahren",
    continueWithEmail: "Oder mit E-Mail fortfahren",
    signupWithEmail: "Oder mit E-Mail registrieren",
    emailLabel: "E-Mail",
    passwordLabel: "Passwort",
    confirmPasswordLabel: "Passwort bestätigen",
    nameLabel: "Name (optional)",
    signInButton: "Anmelden",
    signUpButton: "Konto erstellen",
    forgotPassword: "Vergessen?",
    haveAccount: "Schon ein Konto?",
    noAccount: "Noch kein Konto?",
    signInLink: "Anmelden",
    signUpLink: "Registrieren",
    terms:
      "Mit der Anmeldung stimmst du unseren Nutzungsbedingungen und der Datenschutzerklärung zu",
    errors: {
      googleData: "Anmeldung mit Google fehlgeschlagen",
      invalidCredentials: "Ungültige E-Mail oder Passwort",
      passwordLength: "Passwort muss mindestens 8 Zeichen lang sein",
      passwordMatch: "Passwörter stimmen nicht überein",
      required: "E-Mail und Passwort sind erforderlich",
      generic: "Ein unerwarteter Fehler ist aufgetreten",
      registrationFailed: "Registrierung fehlgeschlagen",
      signInFailed:
        "Konto erstellt, aber Anmeldung fehlgeschlagen. Bitte versuche, dich manuell anzumelden.",
    },
  },
  nav: {
    login: "Anmelden",
    getStarted: "Loslegen",
  },
  footer: {
    admin: "Admin",
    dashboard: "Dashboard",
    copyright: "© 2025 Vladimir Linartas. Alle Rechte vorbehalten.",
  },
}
