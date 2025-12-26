// German translations (Deutsch)

import { Translations } from "./en"

export const de: Translations = {
  hero: {
    badge: "Immer neugierig auf Neues",
    name: "VLADIMIR LINARTAS",
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
