# TODO

- [x] Stabilize container startup (ports/URL alignment, DB wait, remove network dependency on npx).
- [x] Unify visual style (shared brand header, consistent glass surfaces, shared theme across public/admin/dashboard).
- [x] Fix small UI issues (encoding glitches, extra paddings) without a major redesign.
- [x] v1.31 (2026-10-27): brand marks for every product card, animated ColdART logo + capability cards from crm-iot.com, language switch fix under browser translation.
- [x] v1.30 (2026-10-27): LinArt Duet download page `/duet`, update feed folder, home card.
- [x] v1.24–v1.28 (2026-10-10 … 12): site audit fixes, LinArt Labs hero, showcases for IoT Cloud and CRM-IoT, ColdART, iOS apps, Kids Lab, tester form with map + admin inbox, owner notifications, OG image, robots/sitemap, security headers.

## Waiting for others

- [ ] **Tester-request notifications live** — host.crm-iot.com must put `LINART_TESTER_NOTIFY_TOKEN` into `.env.crm` (from `C:\Users\video\.linart\tester_notify_token`, needs the home network). Then send one request marked TEST and delete it from `/admin/requests`.

## Owner decisions (2026-10-12)

- **Commercial Hub stays** as a showcase: lsc-led.de is our own product.
- [ ] **Own demo server for Commercial Hub** (owner plan). When it is up: point the card to the demo, replace the text (it still says "hub.linart.club … password-protected"), switch the card from "locked" to a normal screenshot card.
- **Photo server / Private Cloud wording stays**: photo.linart.club is non-commercial and not sold; customer data of our products does not go through Cloudflare.
- [ ] **Cloud for hardware buyers** — decide the one promise (shop: "1 €/month + 10 years warranty", site DE/RU: "1 year free", site EN: nothing) and use it everywhere.
- [ ] **AI Consultant card** — show price "from €49 / month" and "14 days free, no card" like its landing page, and turn it into a showcase block?

## Next improvements (re-audit 2026-10-12: visual 6/10, copy 6/10)

- [ ] **Hero with product screenshots** (like `public/og-image.jpg`): title left, two tilted browser frames right; one accent colour (sky gradient) for the main buttons; lighter logo in the header.
- [ ] **"View Projects" as a bento grid** (2–3 columns) instead of nine full-width cards; own lucide icon per card (Bot, ShoppingCart, QrCode, Smartphone, KeyRound, Gamepad2 …).
- [ ] **Copy fixes from the re-audit** (ready EN/DE/RU texts in the session report): EN cards for AI Consultant / Smart Hub Store / Local LLM still old; DE du/Sie mix (Private Cloud, "Let's Team Up"); "Gast-Karte" → "digitale Gästemappe"; "AI trained only on your data" → "answers only from your documents"; ColdART "no logs" → "we don't inspect or store your traffic"; "Alpine air" (Spalt is in Franconia); IoT bullets "Home" / "Family" clash with tariff names; CRM: what hardware is needed and how the guest gets the code.
- [ ] **SEO per language**: server-rendered `/de` and `/ru` (or SSR by `?lang`), `<html lang>`, hreflang, translated `<title>` and description.
- [ ] Real visuals instead of placeholders: ColdART (console), LinArt ID (login screen), AI Consultant (widget answering with sources), iPhone mock-ups for the iOS apps, Local LLM (Open WebUI / GPU photo instead of stock); re-export small images at ≥ 1200 px; English QR screenshot.
- [ ] Contact block: centred cards (e-mail / messenger / book a call via the AI widget) or a short form; "Let's Team Up" text aimed at customers.
- [ ] Smart Hub Store link per language (`/de`, `/ru`).
- [ ] AI widget: dark theme, greeting with 3 suggestion chips, `aria-label`, smaller on phones so it does not cover buttons.
- [ ] Higher-resolution background video (current source is 873×480) — upload in Admin → Design & Theme.
- [ ] CSP (report-only first): allow ai.crm-iot.com, tile.openstreetmap.org, nominatim.openstreetmap.org.
- [ ] Datenschutz section 7a (tester form, map) — check with the lawyer.
- [ ] Small a11y: `name`/`id` on form fields, label for the tester textarea, Login link nested button, logo not lazy-loaded.
