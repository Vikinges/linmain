import { prisma } from "@/lib/db"
import type {
  ContactBlock,
  CtaBlock,
  HeroBlock,
  LocalizedHtml,
  LocalizedString,
  PageBlock,
  PortfolioBlock,
  ProjectBlock,
  RichTextBlock,
} from "@/lib/editor/types"

/**
 * One-off content migrations for the live home page.
 *
 * The home page lives in the database and is edited in /admin, so code changes alone
 * cannot fix its content. Each migration here is applied exactly once (tracked in
 * SiteConfig key "homeMigrations"), creates a new PageRevision and never touches
 * blocks the owner has already changed in a way we don't recognise.
 */

const MIGRATIONS_KEY = "homeMigrations"
const SHOWCASE_V124 = "v1.24-showcase"
const CRM_BETA_V125 = "v1.25-crm-iot-beta"
const DATENSCHUTZ_V126 = "v1.26-datenschutz-tester"
const IOT_SHOWCASE_V127 = "v1.27-iot-showcase-trust"
const STYLE_V127 = "v1.27-hero-style-poster"
const BG_POSTER = "/assets/bg-poster.jpg"
export const PRIVATE_CLOUD_IMAGE = "/assets/private-cloud.jpeg"

const CONTACT_EMAIL = "vladimir@linart.club"

const L = (en: string, de: string, ru: string): LocalizedString => ({ en, de, ru })

// ---------------------------------------------------------------------------
// Copy used by the migration (also reused by seed.ts for fresh installs)
// ---------------------------------------------------------------------------

export const SHOWCASE_COPY = {
  hero: {
    badge: L("Hosted in Bavaria · No US cloud", "Gehostet in Bayern · Keine US-Cloud", "Серверы в Баварии · Без американских облаков"),
    title: L("LinArt Labs", "LinArt Labs", "LinArt Labs"),
    subtitle: L(
      "Private IoT, cloud and AI — on servers you can trust",
      "Private IoT-, Cloud- und KI-Lösungen auf Servern, denen Sie vertrauen können",
      "Приватные IoT, облако и ИИ на серверах, которым можно доверять"
    ),
    description: L(
      "<p>We build and host IoT platforms, smart-lock automation for rentals, private cloud and AI assistants trained only on your data. Everything runs on our own hardware in Germany — no third-party clouds, no data resale.</p>",
      "<p>Wir entwickeln und betreiben IoT-Plattformen, Smart-Lock-Automatisierung für Vermieter, Private Cloud und KI-Assistenten, die nur mit Ihren Daten arbeiten. Alles läuft auf eigener Hardware in Deutschland — ohne Fremd-Clouds, ohne Datenverkauf.</p>",
      "<p>Мы создаём и хостим IoT-платформы, автоматизацию аренды на умных замках, приватное облако и ИИ-ассистентов, обученных только на ваших данных. Всё работает на собственном железе в Германии — без чужих облаков и перепродажи данных.</p>"
    ),
    primaryCta: L("See products", "Produkte ansehen", "Смотреть продукты"),
    secondaryCta: L("Talk to us", "Kontakt aufnehmen", "Связаться"),
  },
  about: {
    title: L("About LinArt Labs", "Über LinArt Labs", "О LinArt Labs"),
  },
  badges: {
    live: L("Live", "Live", "Работает"),
    dev: L("In development", "In Entwicklung", "В разработке"),
    pilot: L("Pilot program", "Pilotprogramm", "Пилот"),
  },
  iotApp: L("iOS app", "iOS-App", "iOS-приложение"),
  crmRequest: L("Request a smart lock", "Smart Lock anfragen", "Запросить умный замок"),
  trust: [
    { icon: "map" as const, label: L("Servers in Bavaria", "Server in Bayern", "Серверы в Баварии") },
    { icon: "shield" as const, label: L("GDPR by design", "DSGVO von Anfang an", "GDPR с первого дня") },
    { icon: "server" as const, label: L("Our own hardware — no US cloud", "Eigene Hardware — keine US-Cloud", "Своё железо, без облаков США") },
    { icon: "cpu" as const, label: L("Self-hosted AI", "Selbst gehostete KI", "Собственный ИИ на своих серверах") },
  ],
  iotCloud: {
    title: L(
      "Linart IoT Cloud — your devices, your data, our server in Bavaria",
      "Linart IoT Cloud — Ihre Geräte, Ihre Daten, unser Server in Bayern",
      "Linart IoT Cloud — ваши устройства, ваши данные, наш сервер в Баварии"
    ),
    description: L(
      "<p>One place for sensors, relays, door locks, solar inverters and gateways: live charts, alerts, automations and remote access — in the browser and in the iOS app. Data stays in Germany and is never sold.</p>" +
        "<ul><li><strong>Home</strong> — free for 1 device, plans from €12 / year</li>" +
        "<li><strong>Family</strong> — up to 10 people, door codes for guests that expire on their own, child profiles</li>" +
        "<li><strong>Developers</strong> — API, MQTT and firmware tools, from €49 / year</li>" +
        "<li><strong>Business &amp; rentals</strong> — several sites, white label and the CRM-IoT host app</li></ul>" +
        "<p>New features ship almost every day — early users decide what comes next.</p>",
      "<p>Ein Ort für Sensoren, Relais, Türschlösser, Wechselrichter und Gateways: Live-Diagramme, Alarme, Automationen und Fernzugriff — im Browser und in der iOS-App. Die Daten bleiben in Deutschland und werden nie verkauft.</p>" +
        "<ul><li><strong>Zuhause</strong> — kostenlos für 1 Gerät, Tarife ab 12 € / Jahr</li>" +
        "<li><strong>Familie</strong> — bis zu 10 Personen, Türcodes für Gäste, die von selbst ablaufen, Kinderprofile</li>" +
        "<li><strong>Entwickler</strong> — API, MQTT und Firmware-Werkzeuge, ab 49 € / Jahr</li>" +
        "<li><strong>Business &amp; Vermietung</strong> — mehrere Standorte, White Label und die Gastgeber-App CRM-IoT</li></ul>" +
        "<p>Neue Funktionen kommen fast täglich — frühe Nutzer bestimmen, was als Nächstes kommt.</p>",
      "<p>Одно место для датчиков, реле, дверных замков, солнечных инверторов и шлюзов: живые графики, оповещения, автоматизации и удалённый доступ — в браузере и в iOS-приложении. Данные остаются в Германии и никогда не продаются.</p>" +
        "<ul><li><strong>Дом</strong> — бесплатно для 1 устройства, тарифы от 12 € в год</li>" +
        "<li><strong>Семья</strong> — до 10 человек, коды двери для гостей, которые истекают сами, детские профили</li>" +
        "<li><strong>Разработчики</strong> — API, MQTT и инструменты прошивки, от 49 € в год</li>" +
        "<li><strong>Бизнес и аренда</strong> — несколько объектов, white label и приложение хоста CRM-IoT</li></ul>" +
        "<p>Новые функции выходят почти каждый день — первые пользователи решают, что будет дальше.</p>"
    ),
    steps: [
      {
        title: L("Connect a device", "Gerät verbinden", "Подключите устройство"),
        text: L(
          "Sensor Hub, relay, LockHub or your own ESP32 — Wi-Fi setup right from the app or the browser.",
          "Sensor Hub, Relais, LockHub oder Ihr eigener ESP32 — WLAN-Einrichtung direkt aus App oder Browser.",
          "Sensor Hub, реле, LockHub или ваш собственный ESP32 — настройка Wi-Fi прямо из приложения или браузера."
        ),
      },
      {
        title: L("See your home live", "Ihr Zuhause live sehen", "Дом в реальном времени"),
        text: L(
          "Rooms, energy and doors on one screen — via cloud, Bluetooth or local Wi-Fi.",
          "Räume, Energie und Türen auf einem Bildschirm — über Cloud, Bluetooth oder lokales WLAN.",
          "Комнаты, энергия и двери на одном экране — через облако, Bluetooth или локальный Wi-Fi."
        ),
      },
      {
        title: L("Let it act for you", "Lassen Sie es für sich arbeiten", "Пусть работает за вас"),
        text: L(
          "Push alerts, automations and guest codes that expire on their own.",
          "Push-Alarme, Automationen und Gastcodes, die von selbst ablaufen.",
          "Push-оповещения, автоматизации и гостевые коды, которые истекают сами."
        ),
      },
    ],
    linkLabel: L("View plans", "Tarife ansehen", "Смотреть тарифы"),
    linkUrl: "https://host.crm-iot.com/tarife",
    imageUrl: "/assets/iot-cloud-home.jpeg",
    imageAlt: L(
      "Linart IoT Cloud home screen: weather, solar roof and live room sensors",
      "Startbildschirm von Linart IoT Cloud: Wetter, Solardach und Raumsensoren live",
      "Главный экран Linart IoT Cloud: погода, солнечная крыша и датчики комнат в реальном времени"
    ),
    imageWidth: 2600,
    imageHeight: 1660,
    showcaseUrl: "host.crm-iot.com/app",
  },
  crmIot: {
    badge: L("Open beta · free for testers", "Offene Beta · kostenlos für Tester", "Открытая бета · бесплатно для тестеров"),
    title: L(
      "CRM-IoT — the host app for rentals",
      "CRM-IoT — die Gastgeber-App für Vermietung",
      "CRM-IoT — приложение хоста для аренды"
    ),
    description: L(
      "<p>Bookings from Airbnb, Booking.com, Vrbo or Smoobu turn into a door code, a guest card and a cleaning task — automatically. For holiday flats, houses, rooms, campers, boats and saunas.</p>" +
        "<ul><li><strong>Today · Calendar · Bookings</strong> — arrivals, departures and double bookings on one board</li>" +
        "<li><strong>Door codes</strong> — written to the lock for exactly the stay; codes on the lock keep working without internet</li>" +
        "<li><strong>Guest card</strong> — address, Wi-Fi and house rules in DE / EN / RU, no app to install</li>" +
        "<li><strong>Cleaning &amp; energy</strong> — a task with its own code after every departure, heating back to eco</li></ul>" +
        "<p>No commission, guest money never flows through us, hosted in Germany. <strong>Free for testers during the beta</strong> — write to us and we unlock access for your property.</p>" +
        "<p>After the beta: <strong>€15 per unit / month</strong> or <strong>€160 per unit / year</strong> (≈ €13.33 / month).</p>",
      "<p>Buchungen aus Airbnb, Booking.com, Vrbo oder Smoobu werden automatisch zu Türcode, Gast-Karte und Reinigungsauftrag. Für Ferienwohnungen, Häuser, Zimmer, Wohnmobile, Boote und Saunen.</p>" +
        "<ul><li><strong>Heute · Kalender · Buchungen</strong> — Anreisen, Abreisen und Doppelbuchungen auf einen Blick</li>" +
        "<li><strong>Türcodes</strong> — genau für den Aufenthalt aufs Schloss geschrieben; Codes auf dem Schloss funktionieren auch ohne Internet</li>" +
        "<li><strong>Gast-Karte</strong> — Adresse, WLAN und Hausregeln auf DE / EN / RU, ohne App-Installation</li>" +
        "<li><strong>Reinigung &amp; Energie</strong> — nach jeder Abreise ein Auftrag mit eigenem Code, Heizung zurück auf Eco</li></ul>" +
        "<p>Keine Provision, Gästegeld fließt nie über uns, gehostet in Deutschland. <strong>Für Tester während der Beta kostenlos</strong> — schreiben Sie uns, wir schalten den Zugang für Ihre Unterkunft frei.</p>" +
        "<p>Nach der Beta: <strong>15 € pro Unterkunft / Monat</strong> oder <strong>160 € pro Unterkunft / Jahr</strong> (≈ 13,33 € / Monat).</p>",
      "<p>Бронирования из Airbnb, Booking.com, Vrbo или Smoobu сами превращаются в код двери, карточку гостя и задачу на уборку. Для апартаментов, домов, комнат, автодомов, лодок и саун.</p>" +
        "<ul><li><strong>Сегодня · Календарь · Брони</strong> — заезды, выезды и двойные брони на одной доске</li>" +
        "<li><strong>Коды двери</strong> — записываются в замок ровно на срок проживания; записанные коды работают и без интернета</li>" +
        "<li><strong>Карточка гостя</strong> — адрес, Wi-Fi и правила дома на DE / EN / RU, без установки приложения</li>" +
        "<li><strong>Уборка и энергия</strong> — после каждого выезда задача со своим кодом, отопление обратно в эко</li></ul>" +
        "<p>Без комиссии, деньги гостей никогда не идут через нас, хостинг в Германии. <strong>Для тестеров на время беты бесплатно</strong> — напишите нам, и мы откроем доступ для вашего объекта.</p>" +
        "<p>После беты: <strong>15 € за объект в месяц</strong> или <strong>160 € за объект в год</strong> (≈ 13,33 € в месяц).</p>"
    ),
    steps: [
      {
        title: L("Connect your calendar", "Kalender verbinden", "Подключите календарь"),
        text: L(
          "iCal from Airbnb, Booking.com or Vrbo — or Smoobu. Or add bookings by hand.",
          "iCal aus Airbnb, Booking.com oder Vrbo — oder Smoobu. Oder Buchungen selbst eintragen.",
          "iCal из Airbnb, Booking.com или Vrbo — или Smoobu. Либо вносите брони вручную."
        ),
      },
      {
        title: L("The door code writes itself", "Der Türcode schreibt sich selbst", "Код двери записывается сам"),
        text: L(
          "Valid from check-in to check-out, written to the lock through our LockHub.",
          "Gültig von Check-in bis Check-out, über unseren LockHub aufs Schloss geschrieben.",
          "Действует от заезда до выезда, записывается в замок через наш LockHub."
        ),
      },
      {
        title: L("Guest and cleaner are ready", "Gast und Reinigung sind bereit", "Гость и уборка готовы"),
        text: L(
          "Guest card link and message templates, a cleaning task with its own code after departure.",
          "Link zur Gast-Karte und Nachrichtenvorlagen, nach der Abreise ein Reinigungsauftrag mit eigenem Code.",
          "Ссылка на карточку гостя и шаблоны сообщений, после выезда — задача на уборку со своим кодом."
        ),
      },
    ],
    linkLabel: L("Request free tester access", "Kostenlosen Testzugang anfragen", "Запросить бесплатный тестовый доступ"),
    // Tester access is granted by hand (owner decision 2026-10-10): a self-registered account has no rentals workspace.
    // The form at /tester asks for the property, its location (map pin) and interest in locks / sensors / heating / AC.
    linkUrl: "/tester",
    guideLabel: L("Host guide", "Anleitung für Gastgeber", "Инструкция для хоста"),
    guideUrl: "https://host.crm-iot.com/manuals/app/rentals-host.html",
    // EN / RU manuals live since host.crm-iot.com v4.55.0 (2026-10-10); same anchors in every language.
    guideUrlByLang: L(
      "https://host.crm-iot.com/manuals/app/en/rentals-host.html",
      "https://host.crm-iot.com/manuals/app/rentals-host.html",
      "https://host.crm-iot.com/manuals/app/ru/rentals-host.html"
    ),
    imageUrl: "/assets/crm-iot-host-calendar.jpeg",
    imageAlt: L(
      "Host calendar in CRM-IoT: properties, bookings by channel",
      "Gastgeber-Kalender in CRM-IoT: Unterkünfte, Buchungen nach Kanal",
      "Календарь хоста в CRM-IoT: объекты и брони по каналам"
    ),
    imageWidth: 2600,
    imageHeight: 970,
    showcaseUrl: "host.crm-iot.com/app/rentals/calendar",
  },
  cloudRequest: L("Request an invite", "Einladung anfragen", "Запросить приглашение"),
  cloudSignIn: L("Sign in", "Anmelden", "Войти"),
  coldart: {
    title: L("ColdART — Remote Access & Zero Trust", "ColdART — Fernzugriff & Zero Trust", "ColdART — удалённый доступ и Zero Trust"),
    description: L(
      "<p>Secure remote access to your devices, sites and servers — without opening ports or trusting a third-party relay. Gateways register themselves, every access is consented and time-boxed, and the browser terminal uses short-lived SSH certificates.</p><ul><li><strong>Free:</strong> remote help &amp; support sessions, tunnels for your own gateways</li><li><strong>Commercial:</strong> multi-tenant control plane, managed support for installers and businesses</li><li><strong>ColdART Connect:</strong> private RustDesk relay for remote desktops</li></ul><p>Runs on our own edge in Bavaria — your traffic, your rules, no logs.</p>",
      "<p>Sicherer Fernzugriff auf Ihre Geräte, Standorte und Server — ohne offene Ports und ohne fremde Relays. Gateways registrieren sich selbst, jeder Zugriff ist bestätigt und zeitlich begrenzt, das Browser-Terminal nutzt kurzlebige SSH-Zertifikate.</p><ul><li><strong>Kostenlos:</strong> Remote-Hilfe &amp; Support-Sitzungen, Tunnel für eigene Gateways</li><li><strong>Kommerziell:</strong> mandantenfähige Control Plane, Managed Support für Installateure und Unternehmen</li><li><strong>ColdART Connect:</strong> privates RustDesk-Relay für Remote-Desktops</li></ul><p>Läuft auf unserem eigenen Edge in Bayern — Ihr Traffic, Ihre Regeln, keine Logs.</p>",
      "<p>Безопасный удалённый доступ к вашим устройствам, объектам и серверам — без открытых портов и чужих relay-серверов. Шлюзы регистрируются сами, каждый доступ подтверждается и ограничен по времени, терминал в браузере работает на короткоживущих SSH-сертификатах.</p><ul><li><strong>Бесплатно:</strong> сессии удалённой помощи и поддержки, туннели для собственных шлюзов</li><li><strong>Коммерчески:</strong> мультитенантная панель управления, managed-поддержка для установщиков и бизнеса</li><li><strong>ColdART Connect:</strong> приватный RustDesk-relay для удалённых рабочих столов</li></ul><p>Работает на нашем собственном edge в Баварии — ваш трафик, ваши правила, без логов.</p>"
    ),
    linkLabel: L("Open ColdART", "ColdART öffnen", "Открыть ColdART"),
    linkUrl: "https://zerotrust.crm-iot.com/",
    secondaryLabel: L("Request remote support", "Remote-Support anfragen", "Запросить удалённую поддержку"),
    secondaryUrl: `mailto:${CONTACT_EMAIL}?subject=ColdART%20remote%20support`,
  },
  linartId: {
    title: L("LinArt ID — one account for all services", "LinArt ID — ein Konto für alle Dienste", "LinArt ID — один аккаунт для всех сервисов"),
    description: L(
      "<p>Single sign-on for everything LinArt: IoT Cloud, ColdART, Studio, games and the iOS apps. OpenID Connect with MFA, Google and Apple sign-in — hosted by us in Germany, not by a US identity provider.</p><p>Available as SSO for your own services too.</p>",
      "<p>Single Sign-on für alles von LinArt: IoT Cloud, ColdART, Studio, Spiele und die iOS-Apps. OpenID Connect mit MFA, Google- und Apple-Login — gehostet von uns in Deutschland, nicht bei einem US-Identity-Provider.</p><p>Auch als SSO für Ihre eigenen Dienste verfügbar.</p>",
      "<p>Единый вход во все сервисы LinArt: IoT Cloud, ColdART, Studio, игры и iOS-приложения. OpenID Connect с MFA, вход через Google и Apple — хостинг у нас в Германии, а не у американского провайдера.</p><p>Доступен и как SSO для ваших собственных сервисов.</p>"
    ),
    linkLabel: L("Open LinArt ID", "LinArt ID öffnen", "Открыть LinArt ID"),
    linkUrl: "https://id.crm-iot.com/",
  },
  smartHubStore: {
    title: L("Smart Hub Store", "Smart Hub Store", "Smart Hub Store"),
    description: L(
      "<p>Smart Hub Store offers practical devices for monitoring and control: CO₂, humidity, temperature, relays and smart locks. Our hardware runs locally via Wi-Fi, Bluetooth and LoRa, with optional connection to our server (host.crm-iot.com).</p><p>Solutions for B2C and B2B — from simple, affordable devices to custom, hand-assembled systems. Buy hardware and get a year of IoT Cloud for free.</p>",
      "<p>Der Smart Hub Store bietet praktische Geräte für Überwachung und Steuerung: CO₂, Luftfeuchte, Temperatur, Relais und Smart Locks. Unsere Hardware läuft lokal über Wi-Fi, Bluetooth und LoRa, optional mit Anbindung an unseren Server (host.crm-iot.com).</p><p>Lösungen für B2C und B2B — vom einfachen, günstigen Gerät bis zum individuell von Hand montierten System. Hardware kaufen und ein Jahr IoT Cloud gratis erhalten.</p>",
      "<p>Smart Hub Store — практичные устройства для мониторинга и управления: CO₂, влажность, температура, реле и умные замки. Железо работает локально по Wi-Fi, Bluetooth и LoRa, при желании подключается к нашему серверу (host.crm-iot.com).</p><p>Решения для B2C и B2B — от простых недорогих устройств до систем ручной сборки под задачу. Купите железо — получите год IoT Cloud бесплатно.</p>"
    ),
    linkLabel: L("Go to Store", "Zum Shop", "В магазин"),
  },
  qr: {
    descriptionDe:
      "<p>QR-Generator für Business: digitale Visitenkarten, Meeting-Check-ins und Team-Trainingsflows.</p><p>Viele Funktionen gratis, Upgrades kosten etwa einen Kaffee.</p>",
    descriptionRu:
      "<p>QR-коды для бизнеса: цифровые визитки, чекин на встречах и обучение команды.</p><p>Базовые функции бесплатны, платные стоят как чашка кофе.</p>",
    linkLabelDe: "QR-Generator öffnen",
    linkLabelRu: "Открыть QR-генератор",
  },
  appNfcQr: {
    title: L("NFC QR Business Card 3D Maker (iOS)", "NFC QR Business Card 3D Maker (iOS)", "NFC QR Business Card 3D Maker (iOS)"),
    description: L(
      "<p>Turn your contact details into a 3D-printed business card, a scannable QR code or a tap-to-share NFC tag — designed in seconds on your iPhone.</p><p>Designing, templates, your logo and the home-screen widget are free. One one-time purchase unlocks file export and NFC writing — no subscription, ever.</p>",
      "<p>Verwandeln Sie Ihre Kontaktdaten in eine 3D-gedruckte Visitenkarte, einen scannbaren QR-Code oder einen NFC-Tag zum Antippen — in Sekunden auf dem iPhone gestaltet.</p><p>Gestalten, Vorlagen, eigenes Logo und Home-Widget sind kostenlos. Ein einmaliger Kauf schaltet Export und NFC-Schreiben frei — nie ein Abo.</p>",
      "<p>Превратите контакты в 3D-печатную визитку, сканируемый QR-код или NFC-метку для обмена одним касанием — за секунды прямо на iPhone.</p><p>Дизайн, шаблоны, свой логотип и виджет на главном экране бесплатны. Одна разовая покупка открывает экспорт файлов и запись NFC — никаких подписок.</p>"
    ),
    linkLabel: L("Get on the App Store", "Im App Store laden", "Скачать в App Store"),
    linkUrl: "https://apps.apple.com/de/app/nfc-qr-business-card-3d-maker/id6785651800",
    imageUrl: "/assets/appstore-nfc-qr-card.png",
  },
  appSmartHome: {
    title: L("Smart Home IoT Dashboard (iOS)", "Smart Home IoT Dashboard (iOS)", "Smart Home IoT Dashboard (iOS)"),
    description: L(
      "<p>Full control of your Sensor Hubs, relays, LoRa gateways and display hubs — from anywhere, even offline. The app switches automatically between cloud, Bluetooth and local Wi-Fi.</p><ul><li>Live charts: CO₂, temperature, humidity, pressure</li><li>Push alerts and Lock-Screen Live Activities</li><li>Toggle relays, set automations and alert rules</li></ul>",
      "<p>Volle Kontrolle über Ihre Sensor Hubs, Relais, LoRa-Gateways und Display Hubs — von überall, auch offline. Die App wechselt automatisch zwischen Cloud, Bluetooth und lokalem WLAN.</p><ul><li>Live-Diagramme: CO₂, Temperatur, Luftfeuchte, Luftdruck</li><li>Push-Alarme und Live Activities auf dem Sperrbildschirm</li><li>Relais schalten, Automationen und Alarmregeln setzen</li></ul>",
      "<p>Полный контроль над Sensor Hub, реле, LoRa-шлюзами и дисплеями — откуда угодно, даже офлайн. Приложение само переключается между облаком, Bluetooth и локальным Wi-Fi.</p><ul><li>Живые графики: CO₂, температура, влажность, давление</li><li>Push-оповещения и Live Activities на экране блокировки</li><li>Управление реле, автоматизации и правила оповещений</li></ul>"
    ),
    linkLabel: L("Get on the App Store", "Im App Store laden", "Скачать в App Store"),
    linkUrl: "https://apps.apple.com/de/app/smart-home-iot-dashboard/id6782025663",
    imageUrl: "/assets/appstore-smart-home-iot.png",
  },
  aiConsultant: {
    title: L(
      "Your own AI consultant, trained only on your data",
      "Ihr eigener KI-Berater, trainiert nur auf Ihren Daten",
      "Ваш собственный AI-консультант, обученный только на ваших данных"
    ),
    descriptionDe:
      "<p>Kunden erwarten sofortige Antworten — und Ihre Daten dürfen nicht in eine US-Cloud. Der LinArt KI-Berater antwortet ausschließlich aus Ihren Dokumenten, in 119 Sprachen, mit Quellenangabe, und sagt „Ich weiß es nicht“, statt zu erfinden.</p><ul><li>Jeder Kunde isoliert, gehostet in Deutschland (DSGVO / Schrems II)</li><li>Übergabe an einen Mitarbeiter und Terminbuchung im Chat</li><li>Einbindung mit einem Script-Tag — diese Seite nutzt ihn selbst</li></ul>",
    descriptionRu:
      "<p>Клиенты ждут мгновенных ответов, а ваши данные не должны уходить в американское облако. AI-консультант LinArt отвечает только по вашим документам, на 119 языках, со ссылками на источники, и говорит «не знаю» вместо выдумок.</p><ul><li>Каждый клиент изолирован, хостинг в Германии (GDPR / Schrems II)</li><li>Передача живому сотруднику и запись на встречу прямо в чате</li><li>Подключение одним script-тегом — этот сайт сам им пользуется</li></ul>",
    linkLabel: L("Open AI Consultant", "KI-Berater öffnen", "Открыть AI-консультанта"),
  },
  localLlm: {
    title: L(
      "Lab: local LLM on Intel Arc Pro B70 (32 GB)",
      "Lab: lokale LLM auf Intel Arc Pro B70 (32 GB)",
      "Лаборатория: локальная LLM на Intel Arc Pro B70 (32 ГБ)"
    ),
    descriptionDe:
      "<p>Wie weit kommt ein Offline-Sprachmodell auf einer einzelnen GPU? GGUF 4-Bit, llama.cpp mit Vulkan, intelligentes Layer-Offloading — vollständig offline. Das ist der Motor hinter unserem KI-Berater.</p>",
    descriptionRu:
      "<p>На что способна офлайн-языковая модель на одной видеокарте? GGUF 4-bit, llama.cpp с Vulkan, умный offload слоёв — полностью без интернета. Это движок нашего AI-консультанта.</p>",
    linkLabel: L("Open Web UI (login)", "Web-UI öffnen (Login)", "Открыть Web UI (вход)"),
  },
  kidsLab: {
    title: L("Kids Lab", "Kids Lab", "Детская лаборатория"),
    subtitle: L(
      "Two browser games built by our kids. Free for everyone — just play.",
      "Zwei Browser-Spiele, gebaut von unseren Kindern. Kostenlos für alle — einfach spielen.",
      "Две браузерные игры, которые сделали наши дети. Бесплатно для всех — просто играйте."
    ),
    monster: {
      title: L("Monster Apocalypse", "Monster Apocalypse", "Monster Apocalypse"),
      description: L(
        "<p>Protect your bunker! A tower-defense game for the browser and phone: waves of monsters, upgrades, a leaderboard and a sign-in with LinArt ID to keep your score.</p>",
        "<p>Beschütze deinen Bunker! Tower-Defense für Browser und Handy: Monsterwellen, Upgrades, Bestenliste und Login mit LinArt ID, damit dein Rekord bleibt.</p>",
        "<p>Защити свой бункер! Tower-defense в браузере и на телефоне: волны монстров, апгрейды, таблица рекордов и вход через LinArt ID, чтобы сохранить результат.</p>"
      ),
      linkLabel: L("Play", "Spielen", "Играть"),
      linkUrl: "https://monst.crm-iot.com/",
      imageUrl: "/assets/game-monster-apocalypse.jpeg",
    },
    boat: {
      title: L("Boat Shutter", "Boat Shutter", "Boat Shutter"),
      description: L(
        "<p>Defend the shipyard, sink the fleet. Place cannons along the river and stop enemy boats before they reach your castle. Levels, waves, coins and a Top Defenders leaderboard.</p>",
        "<p>Verteidige die Werft, versenke die Flotte. Platziere Kanonen am Fluss und stoppe die feindlichen Boote, bevor sie deine Burg erreichen. Level, Wellen, Münzen und eine Bestenliste.</p>",
        "<p>Защити верфь, потопи флот. Расставляй пушки вдоль реки и останавливай вражеские лодки, пока они не добрались до замка. Уровни, волны, монеты и таблица лучших защитников.</p>"
      ),
      linkLabel: L("Play", "Spielen", "Играть"),
      linkUrl: "https://boat.crm-iot.com/",
      imageUrl: "/assets/game-boat-shutter.jpeg",
    },
  },
  callout: {
    buttonLabel: L("Contact us", "Kontakt aufnehmen", "Связаться с нами"),
  },
  contact: {
    email: CONTACT_EMAIL,
    address: L("Spalt, Bavaria, Germany", "Spalt, Bayern, Deutschland", "Шпальт, Бавария, Германия"),
  },
}

export const buildKidsLabItems = (): PortfolioBlock["data"]["items"] => [
  {
    id: "game-monster-apocalypse",
    kind: "image",
    title: SHOWCASE_COPY.kidsLab.monster.title,
    description: SHOWCASE_COPY.kidsLab.monster.description,
    embedUrl: "",
    imageUrl: SHOWCASE_COPY.kidsLab.monster.imageUrl,
    linkLabel: SHOWCASE_COPY.kidsLab.monster.linkLabel,
    linkUrl: SHOWCASE_COPY.kidsLab.monster.linkUrl,
  },
  {
    id: "game-boat-shutter",
    kind: "image",
    title: SHOWCASE_COPY.kidsLab.boat.title,
    description: SHOWCASE_COPY.kidsLab.boat.description,
    embedUrl: "",
    imageUrl: SHOWCASE_COPY.kidsLab.boat.imageUrl,
    linkLabel: SHOWCASE_COPY.kidsLab.boat.linkLabel,
    linkUrl: SHOWCASE_COPY.kidsLab.boat.linkUrl,
  },
]

export const buildAppItems = (): PortfolioBlock["data"]["items"] => [
  {
    id: "app-nfc-qr-card",
    kind: "image",
    title: SHOWCASE_COPY.appNfcQr.title,
    description: SHOWCASE_COPY.appNfcQr.description,
    embedUrl: "",
    imageUrl: SHOWCASE_COPY.appNfcQr.imageUrl,
    linkLabel: SHOWCASE_COPY.appNfcQr.linkLabel,
    linkUrl: SHOWCASE_COPY.appNfcQr.linkUrl,
  },
  {
    id: "app-smart-home-iot",
    kind: "image",
    title: SHOWCASE_COPY.appSmartHome.title,
    description: SHOWCASE_COPY.appSmartHome.description,
    embedUrl: "",
    imageUrl: SHOWCASE_COPY.appSmartHome.imageUrl,
    linkLabel: SHOWCASE_COPY.appSmartHome.linkLabel,
    linkUrl: SHOWCASE_COPY.appSmartHome.linkUrl,
  },
]

export const buildLinartIdItem = (): PortfolioBlock["data"]["items"][number] => ({
  id: "linart-id",
  kind: "image",
  title: SHOWCASE_COPY.linartId.title,
  description: SHOWCASE_COPY.linartId.description,
  embedUrl: "",
  imageUrl: "",
  linkLabel: SHOWCASE_COPY.linartId.linkLabel,
  linkUrl: SHOWCASE_COPY.linartId.linkUrl,
})

/** The IoT Cloud block in its v1.27 "showcase" form (real home screen, steps, current plan prices). */
export const buildIotCloudData = (): ProjectBlock["data"] => {
  const c = SHOWCASE_COPY.iotCloud
  return {
    title: c.title,
    description: c.description,
    image: { url: c.imageUrl, alt: c.imageAlt, width: c.imageWidth, height: c.imageHeight },
    linkLabel: c.linkLabel,
    linkUrl: c.linkUrl,
    align: "left",
    badge: { label: SHOWCASE_COPY.badges.live, tone: "live" },
    secondaryLink: { label: SHOWCASE_COPY.iotApp, url: SHOWCASE_COPY.appSmartHome.linkUrl },
    layout: "showcase",
    showcaseUrl: c.showcaseUrl,
    steps: c.steps.map((s) => ({ title: s.title, text: s.text })),
  }
}

export const buildTrustHighlights = (): NonNullable<HeroBlock["data"]["highlights"]> =>
  SHOWCASE_COPY.trust.map((t) => ({ icon: t.icon, label: t.label }))

/** The CRM-IoT rentals block in its v1.25 "showcase" form (open beta, free for testers). */
export const buildCrmIotData = (): ProjectBlock["data"] => {
  const c = SHOWCASE_COPY.crmIot
  return {
    title: c.title,
    description: c.description,
    image: { url: c.imageUrl, alt: c.imageAlt, width: c.imageWidth, height: c.imageHeight },
    linkLabel: c.linkLabel,
    linkUrl: c.linkUrl,
    align: "left",
    badge: { label: c.badge, tone: "pilot" },
    secondaryLink: { label: c.guideLabel, url: c.guideUrl, urlByLang: c.guideUrlByLang },
    layout: "showcase",
    showcaseUrl: c.showcaseUrl,
    steps: c.steps.map((s) => ({ title: s.title, text: s.text })),
  }
}

export const buildColdartBlock = (): ProjectBlock => ({
  id: "coldart",
  type: "project",
  data: {
    title: SHOWCASE_COPY.coldart.title,
    description: SHOWCASE_COPY.coldart.description,
    image: { url: "", alt: L("", "", "") },
    linkLabel: SHOWCASE_COPY.coldart.linkLabel,
    linkUrl: SHOWCASE_COPY.coldart.linkUrl,
    align: "left",
    badge: { label: SHOWCASE_COPY.badges.live, tone: "live" },
    secondaryLink: { label: SHOWCASE_COPY.coldart.secondaryLabel, url: SHOWCASE_COPY.coldart.secondaryUrl },
  },
})

const asParagraph = (html: string) => (html.trim().startsWith("<") ? html : `<p>${html}</p>`)

export const buildAboutBlock = (personalDescription: LocalizedHtml, pillarsHtml: LocalizedHtml): RichTextBlock => ({
  id: "about",
  type: "richText",
  data: {
    width: "narrow",
    content: {
      en: `<h2>${SHOWCASE_COPY.about.title.en}</h2>${asParagraph(personalDescription.en)}${pillarsHtml.en}`,
      de: `<h2>${SHOWCASE_COPY.about.title.de}</h2>${asParagraph(personalDescription.de)}${pillarsHtml.de}`,
      ru: `<h2>${SHOWCASE_COPY.about.title.ru}</h2>${asParagraph(personalDescription.ru)}${pillarsHtml.ru}`,
    },
  },
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const isBlank = (value: string | undefined) => !value || !value.trim()
const allBlank = (value: LocalizedString | undefined) =>
  !value || (isBlank(value.en) && isBlank(value.de) && isBlank(value.ru))

const fillBlank = (current: LocalizedString | undefined, fallback: LocalizedString): LocalizedString => ({
  en: isBlank(current?.en) ? fallback.en : current!.en,
  de: isBlank(current?.de) ? fallback.de : current!.de,
  ru: isBlank(current?.ru) ? fallback.ru : current!.ru,
})

const stripDevNotice = (html: string) =>
  html.replace(/<p[^>]*>\s*🚧[^<]*<\/p>\s*/u, "")

const fixCloudHtml = (html: string) =>
  html
    .replace(/photo\.<a href="https:\/\/photo\.linart\.club"([^>]*)>linart\.club<\/a>/g, '<a href="https://photo.linart.club"$1>photo.linart.club</a>')
    .replace(/nex\.<a href="https:\/\/cloud\.crm-iot\.com"([^>]*)>crm-iot\.com<\/a>/g, '<a href="https://nex.crm-iot.com"$1>nex.crm-iot.com</a>')
    .replace(/<a href="https:\/\/cloud\.crm-iot\.com"([^>]*)>cloud\.crm-iot\.com<\/a>/g, '<a href="https://nex.crm-iot.com"$1>nex.crm-iot.com</a>')
    .replace(/https:\/\/cloud\.crm-iot\.com/g, "https://nex.crm-iot.com")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/<p>\s*zerotrust\.crm-iot\.com\s*<\/p>/g, '<p><a href="https://zerotrust.crm-iot.com" rel="noopener noreferrer" target="_blank">zerotrust.crm-iot.com</a></p>')
    .replace(/<p>\s*git\.crm-iot\.com\s*<\/p>/g, '<p><a href="https://git.crm-iot.com" rel="noopener noreferrer" target="_blank">git.crm-iot.com</a></p>')

const unwrapHeading = (html: string) =>
  html.replace(/^\s*<h2>([\s\S]*)<\/h2>\s*$/u, "$1").replace(/<p>\s*<\/p>/g, "")

const LEGACY_HERO_TITLES = new Set(["VLADIMIR LINARTAS", "LInArt Labs", "LinArt Labs"])
const LEGACY_VIEW_PROJECTS = new Set(["View Projects", "Projekte ansehen", "Посмотреть проекты"])

// ---------------------------------------------------------------------------
// The migration
// ---------------------------------------------------------------------------

export function applyShowcaseV124(blocks: PageBlock[], pillarsHtml: LocalizedHtml): { blocks: PageBlock[]; changed: boolean } {
  let changed = false
  let next: PageBlock[] = blocks.map((b) => JSON.parse(JSON.stringify(b)) as PageBlock)

  // 1. Hero → LinArt Labs positioning (only if the owner has not written a custom title)
  const hero = next.find((b): b is HeroBlock => b.type === "hero")
  let personalDescription: LocalizedHtml | null = null
  if (hero && LEGACY_HERO_TITLES.has((hero.data.title.en || "").trim())) {
    personalDescription = { ...hero.data.description }
    hero.data.badge = SHOWCASE_COPY.hero.badge
    hero.data.title = SHOWCASE_COPY.hero.title
    hero.data.subtitle = SHOWCASE_COPY.hero.subtitle
    hero.data.description = SHOWCASE_COPY.hero.description
    hero.data.primaryCta = { label: SHOWCASE_COPY.hero.primaryCta, url: "#projects" }
    hero.data.secondaryCta = { label: SHOWCASE_COPY.hero.secondaryCta, url: "#contact" }
    hero.data.image = { ...hero.data.image, alt: SHOWCASE_COPY.hero.title }
    changed = true
  }

  // 2. Project blocks
  for (const block of next) {
    if (block.type !== "project") continue
    const d = block.data
    const url = (d.linkUrl || "").trim()

    if (block.id === "iot-server" || url.startsWith("https://host.")) {
      if (url === "https://host.linart.club/" || url === "https://host.linart.club") {
        d.linkUrl = "https://host.crm-iot.com/"
        changed = true
      }
      if (!d.badge) { d.badge = { label: SHOWCASE_COPY.badges.live, tone: "live" }; changed = true }
      if (!d.secondaryLink?.url) {
        d.secondaryLink = { label: SHOWCASE_COPY.iotApp, url: SHOWCASE_COPY.appSmartHome.linkUrl }
        changed = true
      }
    }

    if (block.id === "crm-iot" || url.includes("crm-iot.com/") && !url.includes(".crm-iot.com")) {
      const hadNotice = /🚧/u.test(d.description.en || "")
      if (hadNotice || !d.badge) {
        d.description = {
          en: stripDevNotice(d.description.en || ""),
          de: stripDevNotice(d.description.de || ""),
          ru: stripDevNotice(d.description.ru || ""),
        }
        d.badge = { label: SHOWCASE_COPY.badges.dev, tone: "dev" }
        changed = true
      }
      d.linkLabel = { en: (d.linkLabel.en || "").trim(), de: (d.linkLabel.de || "").trim(), ru: (d.linkLabel.ru || "").trim() }
      if (!d.secondaryLink?.url) {
        d.secondaryLink = { label: SHOWCASE_COPY.crmRequest, url: `mailto:${CONTACT_EMAIL}?subject=Smart%20Lock%20Request` }
        changed = true
      }
    }

    if (block.id === "cloud-services") {
      const fixed = { en: fixCloudHtml(d.description.en || ""), de: fixCloudHtml(d.description.de || ""), ru: fixCloudHtml(d.description.ru || "") }
      if (fixed.en !== d.description.en || fixed.de !== d.description.de || fixed.ru !== d.description.ru) {
        d.description = fixed
        changed = true
      }
      if (url.endsWith("/dashboard") || url.startsWith("mailto:info@")) {
        d.secondaryLink = { label: SHOWCASE_COPY.cloudSignIn, url: "/login" }
        d.linkLabel = SHOWCASE_COPY.cloudRequest
        d.linkUrl = `mailto:${CONTACT_EMAIL}?subject=Private%20Cloud%20invite`
        changed = true
      }
      if (!d.badge) { d.badge = { label: SHOWCASE_COPY.badges.live, tone: "live" }; changed = true }
    }
  }

  // 3. ColdART block after the cloud block (or after the last project block)
  if (!next.some((b) => b.id === "coldart")) {
    const cloudIndex = next.findIndex((b) => b.id === "cloud-services")
    const lastProject = next.map((b) => b.type).lastIndexOf("project")
    const insertAt = (cloudIndex >= 0 ? cloudIndex : lastProject) + 1
    next.splice(insertAt, 0, buildColdartBlock())
    changed = true
  }

  // 4. Main portfolio: fix cards, add apps + LinArt ID
  const portfolio = next.find((b): b is PortfolioBlock => b.type === "portfolio" && b.id === "portfolio")
  if (portfolio) {
    const items = portfolio.data.items
    for (const item of items) {
      const link = (item.linkUrl || "").trim()

      if (item.id === "sensorhub" || link.startsWith("https://shop.linart.club")) {
        item.title = SHOWCASE_COPY.smartHubStore.title
        item.description = {
          en: unwrapHeading(item.description.en || "").replace("host.linart.club", "host.crm-iot.com") || SHOWCASE_COPY.smartHubStore.description.en,
          de: SHOWCASE_COPY.smartHubStore.description.de,
          ru: SHOWCASE_COPY.smartHubStore.description.ru,
        }
        item.linkLabel = SHOWCASE_COPY.smartHubStore.linkLabel
        if (item.kind === "video" && !item.embedUrl) item.kind = "image"
        changed = true
      }

      if (item.id === "qr-generator") {
        if (/dlia|Otkryt/.test((item.description.ru || "") + (item.linkLabel.ru || ""))) {
          item.description.ru = SHOWCASE_COPY.qr.descriptionRu
          item.linkLabel.ru = SHOWCASE_COPY.qr.linkLabelRu
          changed = true
        }
        if (/fuer|oeffnen/.test((item.description.de || "") + (item.linkLabel.de || ""))) {
          item.description.de = SHOWCASE_COPY.qr.descriptionDe
          item.linkLabel.de = SHOWCASE_COPY.qr.linkLabelDe
          changed = true
        }
      }

      if (link.startsWith("https://ai.crm-iot.com")) {
        item.title = fillBlank(item.title, SHOWCASE_COPY.aiConsultant.title)
        item.title.en = item.title.en.trim()
        if (isBlank(item.description.de)) item.description.de = SHOWCASE_COPY.aiConsultant.descriptionDe
        if (isBlank(item.description.ru)) item.description.ru = SHOWCASE_COPY.aiConsultant.descriptionRu
        if ((item.linkLabel.en || "").trim() === "Web" || allBlank(item.linkLabel)) item.linkLabel = { ...SHOWCASE_COPY.aiConsultant.linkLabel }
        else item.linkLabel = fillBlank(item.linkLabel, SHOWCASE_COPY.aiConsultant.linkLabel)
        changed = true
      }

      if (link.startsWith("https://llm.crm-iot.com")) {
        item.title = fillBlank(item.title, SHOWCASE_COPY.localLlm.title)
        item.title.en = item.title.en.trim()
        if (isBlank(item.description.de)) item.description.de = SHOWCASE_COPY.localLlm.descriptionDe
        if (isBlank(item.description.ru)) item.description.ru = SHOWCASE_COPY.localLlm.descriptionRu
        if ((item.linkLabel.en || "").trim().toLowerCase() === "ai web" || allBlank(item.linkLabel)) item.linkLabel = { ...SHOWCASE_COPY.localLlm.linkLabel }
        else item.linkLabel = fillBlank(item.linkLabel, SHOWCASE_COPY.localLlm.linkLabel)
        changed = true
      }
    }

    const hasApp = (id: string, url: string) => items.some((i) => i.id === id || (i.linkUrl || "").includes(url))
    const qrIndex = items.findIndex((i) => i.id === "qr-generator")
    const [nfcItem, smartHomeItem] = buildAppItems()
    const toInsert: PortfolioBlock["data"]["items"] = []
    if (!hasApp(nfcItem.id, "id6785651800")) toInsert.push(nfcItem)
    if (!hasApp(smartHomeItem.id, "id6782025663")) toInsert.push(smartHomeItem)
    if (toInsert.length) {
      items.splice(qrIndex >= 0 ? qrIndex + 1 : items.length, 0, ...toInsert)
      changed = true
    }
    if (!items.some((i) => i.id === "linart-id" || (i.linkUrl || "").includes("id.crm-iot.com"))) {
      items.push(buildLinartIdItem())
      changed = true
    }

    // AI consultant is the most mature product with a live demo on this very page → first card.
    const aiIndex = items.findIndex((i) => (i.linkUrl || "").startsWith("https://ai.crm-iot.com"))
    if (aiIndex > 0) {
      const [ai] = items.splice(aiIndex, 1)
      items.unshift(ai)
      changed = true
    }
  }

  // 5. Entertainment → Kids Lab (Minecraft map is offline; the kids' games are live and free)
  const entertainment = next.find((b): b is PortfolioBlock => b.type === "portfolio" && b.id === "entertainment")
  if (entertainment) {
    const items = entertainment.data.items.filter((i) => i.kind !== "map" && i.id !== "minecraft")
    const games = buildKidsLabItems().filter((g) => !items.some((i) => i.id === g.id || (i.linkUrl || "").includes(new URL(g.linkUrl).hostname)))
    entertainment.data.items = [...games, ...items]
    entertainment.data.title = SHOWCASE_COPY.kidsLab.title
    entertainment.data.subtitle = SHOWCASE_COPY.kidsLab.subtitle
    changed = true
  }

  // 6. Community chat block: a login-only chat on a showcase page confuses visitors and
  //    duplicates the AI consultant widget. The dashboard keeps its own chat.
  const withoutChat = next.filter((b) => b.type !== "chat")
  if (withoutChat.length !== next.length) { next = withoutChat; changed = true }

  // 7. About block (personal story moved out of the hero) before the callout
  if (personalDescription && !next.some((b) => b.id === "about")) {
    const calloutIndex = next.findIndex((b) => b.type === "cta")
    const about = buildAboutBlock(personalDescription, pillarsHtml)
    next.splice(calloutIndex >= 0 ? calloutIndex : next.length, 0, about)
    changed = true
  }

  // 8. Callout button: it points at #contact but was labelled "View Projects"
  const callout = next.find((b): b is CtaBlock => b.type === "cta")
  if (callout && callout.data.buttonUrl === "#contact" && LEGACY_VIEW_PROJECTS.has((callout.data.buttonLabel.en || "").trim())) {
    callout.data.buttonLabel = SHOWCASE_COPY.callout.buttonLabel
    changed = true
  }

  // 9. Contact block: never render an empty section that two CTAs point at
  const contact = next.find((b): b is ContactBlock => b.type === "contact")
  if (contact && isBlank(contact.data.email) && isBlank(contact.data.phone) && allBlank(contact.data.address)) {
    contact.data.email = SHOWCASE_COPY.contact.email
    contact.data.address = SHOWCASE_COPY.contact.address
    changed = true
  }

  return { blocks: next, changed }
}

/**
 * v1.25: CRM-IoT is live and open to testers for free. Replaces the "in development" card with the showcase
 * layout (steps + real host-calendar screenshot). Only touches the block while it is still in its
 * "in development" state (tone dev, or no badge with the old 🚧 text), so an owner's own edit is kept.
 */
export function applyCrmBetaV125(blocks: PageBlock[]): { blocks: PageBlock[]; changed: boolean } {
  let changed = false
  const next = blocks.map((b) => JSON.parse(JSON.stringify(b)) as PageBlock)
  for (const block of next) {
    if (block.type !== "project") continue
    const isCrm = block.id === "crm-iot" || /CRM-IoT/i.test(block.data.title?.en || "")
    if (!isCrm) continue
    const tone = block.data.badge?.tone
    const looksUntouched = tone === "dev" || (!block.data.badge && /🚧|In Development/u.test(block.data.description?.en || ""))
    if (!looksUntouched) continue
    block.data = { ...block.data, ...buildCrmIotData() }
    changed = true
  }
  return { blocks: next, changed }
}

export const DATENSCHUTZ_SECTION_7A = "<h3>7a. Anfrage für einen Testzugang (CRM-IoT) und Kartenauswahl</h3>\n<p>Über das Formular unter <strong>linart.club/tester</strong> können Sie einen kostenlosen Testzugang zu unserer Gastgeber-App CRM-IoT anfragen. Dabei verarbeiten wir die von Ihnen eingegebenen Angaben: Name, E-Mail-Adresse, optional Telefonnummer und Firma, Art und Anzahl Ihrer Unterkünfte, genutzte Buchungskanäle, Ihr Interesse an Automatisierung (Schlösser, Sensoren, Heizung, Klima), optional Adresse und den auf der Karte gesetzten Standort sowie Ihre Nachricht. Die IP-Adresse wird nur kurzzeitig im Arbeitsspeicher zur Missbrauchsabwehr (Begrenzung der Anfragen) genutzt und nicht gespeichert.</p>\n<p><strong>Zweck und Speicherung:</strong> Bearbeitung Ihrer Anfrage, Freischaltung des Testzugangs und Kontaktaufnahme. Die Daten werden auf unserem Server in Deutschland gespeichert und gelöscht, sobald sie dafür nicht mehr erforderlich sind, spätestens 12 Monate nach Ende der Testphase, sofern kein Vertrag zustande kommt.</p>\n<p><strong>Karte und Adresssuche:</strong> Die Karte wird erst geladen, wenn Sie auf „Karte anzeigen“, „Suchen“ oder „Mein Standort“ klicken. Dann ruft Ihr Browser Kartenkacheln und – für die Adresssuche – den Dienst Nominatim bei der OpenStreetMap Foundation (St John’s Innovation Centre, Cambridge, Vereinigtes Königreich) ab; dabei werden Ihre IP-Adresse und die Suchanfrage an die OpenStreetMap Foundation übertragen. Für das Vereinigte Königreich besteht ein Angemessenheitsbeschluss der EU-Kommission. „Mein Standort“ nutzt die Standortfunktion Ihres Browsers erst nach Ihrer Freigabe.<br>\n<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung im Formular, jederzeit widerrufbar) und Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen).</p>\n\n"

/** v1.26: Datenschutz gets section 7a (tester form, map tiles, Nominatim) and the current service hosts. */
export function applyDatenschutzV126(html: string): string {
  let next = html
  if (!next.includes("7a. Anfrage für einen Testzugang")) {
    const anchor = next.indexOf("<h3>8.")
    next = anchor >= 0 ? next.slice(0, anchor) + DATENSCHUTZ_SECTION_7A + next.slice(anchor) : next + DATENSCHUTZ_SECTION_7A
  }
  next = next
    .replace("IoT-Plattform host.linart.club", "IoT-Plattform und Gastgeber-App CRM-IoT host.crm-iot.com")
    .replace("Cloud-Speicher cloud.crm-iot.com", "Cloud-Speicher nex.crm-iot.com")
    .replace(/Stand: [A-Za-zäÄ]+ 2026/, "Stand: Oktober 2026")
  return next
}

async function runDatenschutzMigration(applied: string[]) {
  if (applied.includes(DATENSCHUTZ_V126)) return
  const page = await prisma.page.findUnique({
    where: { slug: "datenschutz" },
    include: { publishedRevision: true, draftRevision: true },
  })
  const source = page?.publishedRevision || page?.draftRevision
  if (page && source && Array.isArray(source.blocks)) {
    const blocks = (source.blocks as PageBlock[]).map((b) => JSON.parse(JSON.stringify(b)) as PageBlock)
    let changed = false
    for (const block of blocks) {
      if (block.type !== "richText") continue
      for (const lang of ["en", "de", "ru"] as const) {
        const before = block.data.content[lang] || ""
        if (!before.includes("Datenschutzerklärung")) continue
        const after = applyDatenschutzV126(before)
        if (after !== before) {
          block.data.content[lang] = after
          changed = true
        }
      }
    }
    if (changed) {
      const revision = await prisma.pageRevision.create({
        data: { pageId: page.id, title: source.title || page.title, blocks },
      })
      await prisma.page.update({
        where: { id: page.id },
        data: { publishedRevisionId: revision.id, draftRevisionId: revision.id },
      })
    }
  }
  await markAllApplied(applied, [DATENSCHUTZ_V126])
}

/**
 * v1.27: IoT Cloud card → showcase (home-screen screenshot, steps, prices from the public catalog), replacing the
 * old long text with outdated prices — only while the block still carries the original seed text. Hero gets the
 * trust strip if it has none yet.
 */
export function applyIotShowcaseV127(blocks: PageBlock[]): { blocks: PageBlock[]; changed: boolean } {
  let changed = false
  const next = blocks.map((b) => JSON.parse(JSON.stringify(b)) as PageBlock)
  for (const block of next) {
    if (block.type === "project" && (block.id === "iot-server" || (block.data.linkUrl || "").startsWith("https://host.crm-iot.com"))) {
      const en = block.data.description?.en || ""
      if (/first buyers|first Apple customers/i.test(en) && block.data.layout !== "showcase") {
        block.data = { ...block.data, ...buildIotCloudData() }
        changed = true
      }
    }
    // Private Cloud showed the site logo (black on dark, nearly invisible) → service illustration
    if (block.type === "project" && block.id === "cloud-services") {
      const url = block.data.image?.url || ""
      if (!url || /Linart-PNG.png$/i.test(url)) {
        block.data.image = { ...block.data.image, url: PRIVATE_CLOUD_IMAGE, width: 420, height: 420 }
        changed = true
      }
    }
    if (block.type === "hero" && !(block.data.highlights && block.data.highlights.length)) {
      block.data.highlights = buildTrustHighlights()
      changed = true
    }
  }
  return { blocks: next, changed }
}

/** v1.27: readable hero subtitle (was grey on grey) and a poster frame for the background video. */
async function runStyleMigration(applied: string[]) {
  if (applied.includes(STYLE_V127)) return
  const [stylesRow, themeRow] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { key: "contentStyles" } }),
    prisma.siteConfig.findUnique({ where: { key: "theme" } }),
  ])

  const styles = (stylesRow?.value || {}) as { hero?: Record<string, unknown> }
  const from = (styles.hero?.subtitleGradientFrom as string | undefined) || "#9ca3af"
  const to = (styles.hero?.subtitleGradientTo as string | undefined) || "#6b7280"
  if (from.toLowerCase() === "#9ca3af" && to.toLowerCase() === "#6b7280") {
    const value = { ...styles, hero: { ...(styles.hero || {}), subtitleGradientFrom: "#e2e8f0", subtitleGradientTo: "#7dd3fc" } }
    await prisma.siteConfig.upsert({
      where: { key: "contentStyles" },
      update: { value: value as object },
      create: { key: "contentStyles", value: value as object },
    })
  }

  const theme = (themeRow?.value || null) as { background?: Record<string, unknown> } | null
  if (theme && theme.background && !theme.background.fallbackImage && theme.background.videoUrl) {
    const value = { ...theme, background: { ...theme.background, fallbackImage: BG_POSTER } }
    await prisma.siteConfig.update({ where: { key: "theme" }, data: { value: value as object } })
  }

  await markAllApplied(applied, [STYLE_V127])
}

async function readApplied(): Promise<string[]> {
  const row = await prisma.siteConfig.findUnique({ where: { key: MIGRATIONS_KEY } })
  const value = row?.value as { applied?: unknown } | null
  return Array.isArray(value?.applied) ? (value!.applied as string[]) : []
}

async function markAllApplied(applied: string[], names: string[]) {
  const nextApplied = Array.from(new Set([...applied, ...names]))
  await prisma.siteConfig.upsert({
    where: { key: MIGRATIONS_KEY },
    update: { value: { applied: nextApplied } },
    create: { key: MIGRATIONS_KEY, value: { applied: nextApplied } },
  })
}

/**
 * Runs pending home-page migrations. Safe to call on every request: one indexed
 * read when nothing is pending.
 */
export async function runHomeMigrations(pillarsHtml: LocalizedHtml) {
  const migrations: Array<{ name: string; apply: (blocks: PageBlock[]) => { blocks: PageBlock[]; changed: boolean } }> = [
    { name: SHOWCASE_V124, apply: (blocks) => applyShowcaseV124(blocks, pillarsHtml) },
    { name: CRM_BETA_V125, apply: applyCrmBetaV125 },
    { name: IOT_SHOWCASE_V127, apply: applyIotShowcaseV127 },
  ]

  const appliedBefore = await readApplied()
  await runDatenschutzMigration(appliedBefore)
  await runStyleMigration(await readApplied())
  const applied = await readApplied()
  const pending = migrations.filter((m) => !applied.includes(m.name))
  if (pending.length === 0) return

  const page = await prisma.page.findUnique({
    where: { slug: "home" },
    include: { publishedRevision: true, draftRevision: true },
  })
  if (!page) return

  const source = page.publishedRevision || page.draftRevision
  if (!source || !Array.isArray(source.blocks)) {
    await markAllApplied(applied, pending.map((m) => m.name))
    return
  }

  let blocks = source.blocks as PageBlock[]
  let changed = false
  for (const migration of pending) {
    const result = migration.apply(blocks)
    blocks = result.blocks
    changed = changed || result.changed
  }
  if (changed) {
    const revision = await prisma.pageRevision.create({
      data: { pageId: page.id, title: source.title || page.title, blocks },
    })
    // Publish immediately and make it the draft too, so the editor opens on the migrated page.
    await prisma.page.update({
      where: { id: page.id },
      data: { publishedRevisionId: revision.id, draftRevisionId: revision.id },
    })
  }
  await markAllApplied(applied, pending.map((m) => m.name))
}
