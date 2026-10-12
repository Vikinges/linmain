# Linart Main Site - AI Project Manual

## LLM Rules

- Preferred language: Russian for explanations and UX guidance; keep commands/code in English.
- Keep this document updated after any change (add to Change Log, remove obsolete notes).
- Bump app version on each release: update `src/lib/app-version.ts` by +0.01.
- Do not include secrets or private tokens in docs or examples.

## CMS / Page Editor (Summary)

- Public pages are stored in the database: `Page`, `PageRevision`, `MediaAsset` (see `prisma/schema.prisma`).
- Blocks are JSON: `src/lib/editor/types.ts` and `src/lib/editor/factory.ts`.
- Rendering: `src/components/editor/page-renderer.tsx`.
- Public routes: `/` uses `src/app/page.tsx`, other pages use `src/app/p/[slug]/page.tsx`.
- Admin editor: `/admin/editor` (list + design settings) and `/admin/editor/[pageId]` (block editor).
- Admin APIs: `/api/admin/pages`, `/api/admin/media`, `/api/admin/translate`.
- Admin page APIs accept both page id and slug (fallback).
- Site-wide settings: `/api/site-config` stores `content`, `contentStyles`, and `theme`.
- Localization: `src/lib/translations/{en,de,ru}.ts` with `src/lib/i18n-config.ts`.
- Chat: `src/components/chat/chat-box.tsx`, anti-spam in `src/lib/actions/chat.ts`.

## Quick Edits

- Homepage blocks: Admin > Editor > Pages > Home > Edit blocks.
- Global theme (colors, background, font size, radius): Admin > Editor > Design & Theme.
- Global nav/footer/social/logo/background: Admin > Editor > Design & Theme.
- Media library: Admin > Editor > Media.

## Theme & Branding

- Theme values are stored in SiteConfig and applied globally.
- Theme CSS variables are set in `src/lib/theme-config.ts` and used by Tailwind in `src/app/globals.css`.
- `ThemeProvider` (`src/components/providers/theme-provider.tsx`) loads theme from `/api/site-config`.
- Public background visuals live in `src/components/layout/app-background.tsx` and `src/components/layout/background-video.tsx`.
- App version is displayed in admin footer and comes from `src/lib/app-version.ts`.

## Admin Access

- Admin access is controlled by `ADMIN_EMAILS` (comma-separated). If set, only those emails are admin.
- If `ADMIN_EMAILS` is empty, users with role `ADMIN` are allowed.

## Key Paths

- `src/app/page.tsx` (homepage)
- `src/app/p/[slug]/page.tsx` (public pages)
- `src/app/admin/editor/page.tsx` (editor dashboard)
- `src/app/admin/editor/[pageId]/page.tsx` (block editor)
- `src/components/editor/page-renderer.tsx` (public renderer)
- `src/components/editor/page-editor.tsx` (admin block editor)
- `src/components/editor/editor-dashboard.tsx` (admin dashboard + design settings)
- `src/lib/editor/types.ts` (block types)
- `src/lib/editor/seed.ts` (default pages)
- `src/lib/app-version.ts` (app version)
- `src/lib/theme-config.ts` (theme model + CSS vars)
- `src/components/providers/theme-provider.tsx` (global theme loader)
- `prisma/schema.prisma` (Page/PageRevision/MediaAsset/SiteConfig)
- `deploy.sh` (deployment script)
- `install.sh` (one-shot install)
- `docker-compose.yml` (runtime)
- `docker-compose.local.yml` (local dev)
- `scripts/local-test.ps1` (local DB + seed)
- `.github/workflows/docker.yml` (prebuilt image)

## Deployment & Updates

### VPS Info

- **IP:** `85.215.32.66`
- **App path:** `/opt/linart`
- **App port:** `3456` (port 8080 is occupied by `frps`)
- **SSH user:** `root`
- **SSH key:** local `~/.ssh/id_rsa` must be in VPS `~/.ssh/authorized_keys`

### Common Env

- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `ADMIN_EMAILS`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `LIBRETRANSLATE_URL`, `LIBRETRANSLATE_API_KEY` (optional)
- `LINART_PORT` (set to `3456` on VPS — port 8080 is taken by frps)
- `USE_PREBUILT_IMAGE`, `IMAGE_REF` (optional)
- `DEPLOY_REF` (optional checkout ref)

### Method A: VPS build (may fail on low memory)

- `./deploy.sh` pulls `master`, prompts Google keys, writes `.env`, builds Docker, waits for DB, runs Prisma `db push`.
- Cleanup is controlled by `CLEANUP_LEVEL`:
  - `off`: no cleanup
  - `safe` (default): prune containers/images and builder cache
  - `full`: additionally prune volumes and networks

### Method B: Prebuilt image (recommended for low memory)

- Build and push image via GitHub Actions (GHCR).
- On VPS: `USE_PREBUILT_IMAGE=1 IMAGE_REF=ghcr.io/vikinges/linmain:latest ./deploy.sh`.

### Method C: Local build + tar + docker load (recommended, tested on 2026-04-13)

This is the recommended method for our 4GB VPS. Build runs on your local PC, image is transferred as a tar file, loaded and started on VPS. No OOM risk.

#### Prerequisites (one-time setup)

1. Docker Desktop must be running on your PC.
2. Your local SSH key (`~/.ssh/id_rsa.pub`) must be added to VPS `~/.ssh/authorized_keys`:
   ```bash
   # On VPS:
   echo "<contents of your id_rsa.pub>" >> ~/.ssh/authorized_keys
   ```
3. Verify SSH works from your PC:
   ```powershell
   ssh root@85.215.32.66 "echo OK"
   ```

#### Step 1 — Build image locally (PowerShell on PC)

```powershell
cd d:\Code\linart_main_site
docker buildx build --platform linux/amd64 -t linart-web:local --load .
```

- `--platform linux/amd64` — required, VPS runs Linux x64
- `--load` — loads image into local Docker (not just build cache)
- Build takes ~2-3 min on first run, faster on subsequent (layer cache)

#### Step 2 — Save and upload to VPS (PowerShell on PC)

```powershell
docker save -o linart-web.tar linart-web:local
scp .\linart-web.tar root@85.215.32.66:/opt/linart/linart-web.tar
Remove-Item .\linart-web.tar -Force
```

- Tar is ~160MB, upload takes ~1-2 min depending on connection
- Local tar is deleted after upload to save disk space

#### Step 3 — Load and restart on VPS (SSH bash)

```bash
cd /opt/linart && \
docker compose --env-file .env down && \
docker load -i linart-web.tar && \
IMAGE_REF=linart-web:local docker compose --env-file .env up -d --no-build && \
docker compose --env-file .env exec -T web sh -lc "HOME=/tmp prisma db push --skip-generate --schema /app/prisma/schema.prisma" && \
rm -f /opt/linart/linart-web.tar && \
echo "DEPLOY OK"
```

- `down` — stops old containers (DB is also stopped briefly, ~5s downtime)
- `docker load` — imports image from tar file
- `IMAGE_REF=linart-web:local` — tells compose to use the locally loaded image
- `prisma db push` — applies any schema changes (safe if no changes)
- tar is deleted from VPS after successful deploy

#### Step 4 — Verify

```bash
ssh root@85.215.32.66 "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
```

Expected output:
```
NAMES        STATUS         PORTS
linart_web   Up N seconds   0.0.0.0:3456->3000/tcp
linart_db    Up N minutes   0.0.0.0:5432->5432/tcp
```

Site is live at: `http://85.215.32.66:3456`

#### All-in-one (Steps 1–2 combined, PowerShell)

```powershell
cd d:\Code\linart_main_site
docker buildx build --platform linux/amd64 -t linart-web:local --load .
docker save -o linart-web.tar linart-web:local
scp .\linart-web.tar root@85.215.32.66:/opt/linart/linart-web.tar
Remove-Item .\linart-web.tar -Force
```

Then SSH to VPS and run Step 3.

### Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `npm run build` fails on Windows | Turbopack symlink permissions | Use Docker build (Method C) |
| `Permission denied` on scp/ssh | SSH key not in authorized_keys | Add `~/.ssh/id_rsa.pub` to VPS `authorized_keys` |
| Port already in use | Port 8080 taken by frps | Use port 3456 (`LINART_PORT=3456` in `/opt/linart/.env`) |
| OOM during build on VPS | Low RAM | Use Method C (local build) |
| `docker load` slow | Large image (~160MB) | Normal, wait 1-2 min |

## Local Testing

- PowerShell: `.\scripts\local-test.ps1` (builds DB, runs prisma push + seed).
- Local compose: `docker compose -f docker-compose.local.yml up -d`.
- Dev server: `npm run dev` (uses Next dev).

## Admin Navigation

- Editor is the primary content editor.
- Legacy `/admin/content` and `/admin/appearance` redirect to `/admin/editor`.
- Sidebar should scroll if the menu exceeds screen height (see `src/components/admin/sidebar.tsx`).

## Known Issues

- Low-memory VPS builds may fail (OOM). Use prebuilt image or local tar method.
- On Windows, `npm run build` can fail due to Turbopack symlink permissions. Prefer Docker for production builds.
- Port 80 is often occupied on VPS. Use `LINART_PORT=8080` and reverse proxy (nginx) for `linart.club`.

## Home Page Structure

The home page blocks are defined in `src/lib/editor/seed.ts` and rendered in order:

1. **hero** — HeroBlock — trust strip (`highlights`: Servers in Bavaria · GDPR by design · own hardware, no US cloud · self-hosted AI, editable in the block editor) and the "LinArt Labs" positioning (badge "Hosted in Bavaria · No US cloud", one promise, CTAs → `#projects` / `#contact`)
2. **iot-server** — ProjectBlock, layout **showcase** — Linart IoT Cloud: real home-screen screenshot (`public/assets/iot-cloud-home.jpeg`, test account, family names / town / door warning hidden in the DOM only), 3 steps, prices from the public catalog (`/api/plans`: free 1 device, home from €12/year, developers from €49/year). CTA → host.crm-iot.com/tarife, secondary → iOS app. Badge: Live
3. **crm-iot** — ProjectBlock, layout **showcase** — CRM-IoT host app for rentals (open beta, free for testers): text + 3 "how it works" steps, real host-calendar screenshot (`public/assets/crm-iot-host-calendar.jpeg`) in a browser frame; CTA "Request free tester access" → `/tester` (form, see below) — tester access is unlocked by hand; secondary → host guide in the visitor's language (`secondaryLink.urlByLang`: `/manuals/app/{en/,ru/}rentals-host.html`). The copy shows the price after the beta (€15 per unit / month, €160 / year — public in host.crm-iot.com `/api/plans` since v4.55.0). Badge: pilot (blue) "Open beta · free for testers"
4. **cloud-services** — ProjectBlock — Immich + Nextcloud (nex.crm-iot.com) + ColdArt/GitLab/RustDesk; main CTA = mailto invite, secondary = /login. Badge: Live
5. **coldart** — ProjectBlock — ColdART remote access & zero trust (zerotrust.crm-iot.com; free remote-support sessions + commercial control plane)
6. **portfolio** — PortfolioBlock — cards: AI Consultant (first), Smart Hub Store, QR Generator, **NFC QR Business Card 3D Maker (iOS)**, **Smart Home IoT Dashboard (iOS)**, LinArt ID, Commercial Hub, Local LLM lab
7. **entertainment** — PortfolioBlock — title "Kids Lab": Monster Apocalypse (monst.crm-iot.com) and Boat Shutter (boat.crm-iot.com), browser games built by the kids, free
8. **about** — RichTextBlock — the personal story that used to be the hero + the three "pillars"
9. **callout** — CtaBlock — "Let's Team Up" (button "Contact us" → `#contact`)
10. **contact** — ContactBlock — vladimir@linart.club, Spalt / Bavaria

Project blocks (`project`) render as dark gradient feature cards. `layout: "showcase"` (v1.25) puts the text and the numbered `steps` side by side and shows the image full width below in a browser-window frame whose address bar shows `showcaseUrl`; use it for wide product screenshots. Each has an optional `badge` (label + tone: live / pilot / dev / soon / none — blocks without one show the legacy green "Live") and an optional `secondaryLink` (second button). Both are editable in the admin block editor.

The **Community Chat** block was removed from the home page in v1.24 (login-only chat on a showcase page; the AI consultant widget covers visitor questions). The `chat` block type, `ChatBox` and `/admin/chat` still exist and the dashboard keeps its chat.

### Live-content migrations (`src/lib/editor/migrations.ts`)

The home page is edited in the DB, so content fixes cannot ship as seed changes alone. `runHomeMigrations()` is called from `ensureDefaultPages()` on every request; it reads `SiteConfig["homeMigrations"].applied` and applies each pending migration once, writing a new `PageRevision` that is published and set as draft. Migrations run in order and share one new revision: `v1.24-showcase`, then `v1.25-crm-iot-beta` (turns the CRM-IoT card into the showcase layout, only while it still has the "In development" badge). `v1.24-showcase` fixes anchors/labels/contact, strips dead hosts (host.linart.club, cloud.crm-iot.com), adds the ColdART block, the two iOS app cards, LinArt ID, Kids Lab and the About block, and removes the chat block. To re-run a migration on a server, delete its name from the `applied` array in that SiteConfig row.

**Anchors:** the renderer puts `id="projects"` on the first project/portfolio block, so hero and nav "View Projects" links always resolve; every other section gets `id={block.id}` (`#contact` is fixed).

To reset the home page to the current seed (e.g. after code changes), delete the page from DB — on next request `ensureDefaultPages()` recreates it:
```bash
cd /opt/linart && docker compose --env-file .env exec -T db psql -U postgres -d linart -c "DELETE FROM \"PageRevision\"; DELETE FROM \"Page\";"
```
Then visit the site — it auto-recreates from seed on first request.

### Drag-and-Drop in Admin Editor
Already implemented via `@dnd-kit/core` + `@dnd-kit/sortable` in `src/components/editor/page-editor.tsx`.
Use the `GripVertical` handle (⠿) on each block to drag and reorder. No extra setup needed.

## Tester requests (CRM-IoT open beta)

- **Owner notification:** after saving, `src/lib/tester-notify.ts` POSTs the request to host.crm-iot.com `/api/integrations/linart/tester-request` (Bearer token), which sends an e-mail to OPERATOR_EMAIL and a push to the owner. Env on the VPS: `TESTER_NOTIFY_URL`, `TESTER_NOTIFY_TOKEN` (passed through `docker-compose.yml`; empty = off; 5 s timeout, never blocks the form). The token lives only in the VPS `.env`, in host.crm-iot.com `.env.crm` (`LINART_TESTER_NOTIFY_TOKEN`) and in `C:\Users\video\.linart\tester_notify_token` on the owner's laptop — never paste it into chats or commits.

- Public form: `/tester` (`src/app/tester/page.tsx` → `src/components/tester/tester-form.tsx` inside `PublicPage` via `renderExtra`). EN/DE/RU; `?lang=de|en|ru` in any public URL picks the language (used by links from host.crm-iot.com).
- Asks: name, e-mail, phone, company, what is rented (flat / house / hotel / boarding / rooms / vehicle / sauna), units, channels, **location** (address search via OSM Nominatim, "use my location", or a click on the map; the pin is draggable; the address is filled back from the pin) and **"Would you like to use our automation in your hotel or rental?"** — smart locks, air-quality sensors, heating control, AC control, or software only.
- The map (`src/components/tester/linart-map.tsx`, Leaflet + OpenStreetMap tiles darkened by `.linart-dark-tiles` in `globals.css`) loads only after a click (privacy). CARTO basemaps need an API key now — do not switch back without one.
- API: `POST /api/tester-request` (route handler; honeypot + min fill time + 5 requests/hour per IP in memory + one request per e-mail per 10 min; IP is not stored). Validation shared in `src/lib/tester-request.ts` (no Prisma import — used by client code).
- Storage: Prisma model `TesterRequest` → **deploy must run `prisma db push`** (Method C step 3 does).
- Admin: `/admin/requests` ("Tester requests" in the sidebar) — all requests as pins on a map coloured by status (new / contacted / granted / declined), list with interests and channels, status select, internal note, delete. `GET /api/admin/tester-requests`, `PATCH|DELETE /api/admin/tester-requests/[id]`.
- No e-mail notification yet (the app has no SMTP) — check the admin page.

## Legal Pages & Compliance (German Law)

Legal pages are auto-created by `ensureStaticPage()` in `seed.ts` on first startup.
They are **NOT overwritten** on subsequent restarts — admin edits persist.

| Page | URL | Auto-created | Required by |
|------|-----|-------------|-------------|
| Impressum | `/p/impressum` | ✅ Yes | DDG § 5 — mandatory for any German commercial/professional site |
| Datenschutz | `/p/datenschutz` | ✅ Yes | DSGVO Art. 13/14 — mandatory for all sites processing EU user data |

Footer links to both pages are in `src/components/editor/public-page.tsx` (always visible, all languages).

### Which services need their own legal pages?

Each subdomain running as an independent service must have its own Impressum and Datenschutz reachable within max 2 clicks.

| Service | URL | Impressum needed? | Datenschutz needed? | Notes |
|---|---|---|---|---|
| Main site | linart.club | ✅ Done | ✅ Done | Covered by `/p/impressum`, `/p/datenschutz` |
| IoT Platform | host.crm-iot.com (host.linart.club is retired, returns 530) | ✅ Yes | ✅ Yes | Separate service — add own legal footer |
| QR Generator | qr.linart.club | ✅ Yes | ✅ Yes | Separate service — add own legal pages |
| Photo cloud | photo.linart.club | ✅ Yes | ✅ Yes | Immich — add legal or restrict to invited users only |
| Nextcloud | cloud.crm-iot.com | ✅ Yes | ✅ Yes | Add legal pages if non-admin users access it |
| Commercial Hub | hub.linart.club | ⚠️ Yes | ⚠️ Yes | Password-protected lowers risk but doesn't remove obligation |
| CRM-IoT platform | crm-iot.com | ✅ Yes | ✅ Yes | B2B + paid — also needs AGB and Widerrufsbelehrung |
| Minecraft map | embedded | — | — | Embedded iframe within linart.club — covered by main policy |

### What's still missing legally

| Item | Priority | When needed |
|---|---|---|
| **AGB** (Terms of Service) | ⚠️ High | Required once payment flow exists (IoT subscriptions, smart lock sales) |
| **Widerrufsbelehrung** | ⚠️ High | Right of withdrawal (14 days) for B2C digital services — add at checkout |
| Cookie Banner | ℹ️ Not yet | Only needed if tracking/analytics cookies are added (currently none) |
| Legal pages per subdomain | ⚠️ Medium | Each subdomain service needs its own Impressum + Datenschutz |

### Key legal facts to remember

- **Applicable law**: DDG (Digitale-Dienste-Gesetz, replaces TMG since 2024) — use DDG in all texts, not TMG
- **Privacy regulation**: DSGVO + TDDDG (formerly TTDSG for cookies)
- **Hosting provider**: 1&1 IONOS SE, Elgendorfer Str. 57, 56410 Montabaur — must be named in Datenschutz with AVV note (Art. 28 DSGVO)
- **IoT/computation server**: Own server in Bavaria, Germany — separate from IONOS web hosting
- **Supervisory authority (Bavaria)**: BayLDA, Promenade 27, 91522 Ansbach, www.lda.bayern.de
- **Steuernummer**: NOT published — not mandatory, sensitive data; publish only if you get a Umsatzsteuer-ID (VAT ID)
- **EU OS Platform link**: Required in Impressum since we offer services to consumers — https://ec.europa.eu/consumers/odr/
- **YouTube embeds**: Must be mentioned in Datenschutz; use `youtube-nocookie.com` domain

## Change Log

### 2026-10-12 (v1.27) — IoT showcase, trust strip, SEO, hardening, owner notifications

- IoT Cloud card → showcase (live home screen, steps, current prices); Private Cloud gets a service illustration instead of the site logo (`public/assets/private-cloud.jpeg`); hero trust strip; hero subtitle gradient #e2e8f0 → #7dd3fc (was grey on grey); background video poster `public/assets/bg-poster.jpg` (first frame). Live content via migrations `v1.27-iot-showcase-trust` and `v1.27-hero-style-poster` (SiteConfig contentStyles / theme, only when still on the old defaults).
- SEO: Open Graph / Twitter image `public/og-image.jpg` (1200×630, `summary_large_image`), `src/app/robots.ts`, `src/app/sitemap.ts`.
- Security headers in `next.config.ts`: HSTS (no includeSubDomains — other *.linart.club hosts are separate servers), nosniff, Referrer-Policy, X-Frame-Options SAMEORIGIN, Permissions-Policy (geolocation and microphone only for self). No CSP yet.
- Tester requests notify the owner by e-mail + push through host.crm-iot.com (see "Tester requests").
- VPS: `.env` now has `IMAGE_REF=linart-web:local` (backups in `/opt/linart/backups/`), so a plain `docker compose up` keeps the current site.

### 2026-10-10 (v1.26) — tester request form with map

- **Deployed 2026-10-11** (Method C, only the `web` container recreated: `IMAGE_REF=linart-web:local docker compose --env-file .env up -d --no-build web`, then `prisma db push`). DB dump before the deploy: `/opt/linart/backups/linart-2026-10-11-pre-v1.26.sql.gz`. Rollback image still on the VPS: `ghcr.io/vikinges/linmain:latest` (v1.22). Note: `.env` on the VPS still says `IMAGE_REF=ghcr.io/vikinges/linmain:latest` — always pass `IMAGE_REF=linart-web:local` on the command line, or a plain `docker compose up` brings back v1.22.

- New `/tester` form for CRM-IoT tester access with a map pin for the property and the question about automation (locks, air-quality sensors, heating, AC); admin inbox `/admin/requests` with all pins on a map (see "Tester requests"). CRM-IoT card CTA → `/tester` (owner decision 2026-10-10: testers contact us, access is unlocked by hand).
- CRM-IoT card: host guide link per visitor language (EN/RU manuals live on host.crm-iot.com since v4.55.0), "(DE)" removed; price after the beta in the copy.
- Datenschutz: new section 7a (tester form, map, Nominatim), §14 hosts fixed (host.crm-iot.com, nex.crm-iot.com), "Stand: Oktober 2026" — seed + live migration `v1.26-datenschutz-tester` (`runDatenschutzMigration`). Section 7a should be checked by the lawyer like the rest of the page.
- Public pages: the UI language is now an external store (`useSyncExternalStore`) — no more hydration error for DE/RU visitors; `?lang=` support; `/favicon.ico` rewritten to `/logo.png`.
- Prisma: new model `TesterRequest` (needs `prisma db push` on deploy). New dependency `leaflet` (+ `@types/leaflet`).

### 2026-10-10 (v1.25) — CRM-IoT open beta

- CRM-IoT is live and free for testers. The home card becomes a **showcase**: badge "Open beta · free for testers", new EN/DE/RU copy built from the host manual (Today/Calendar/Bookings, door codes that keep working offline, guest card, cleaning & eco), 3 numbered steps (calendar → door code → guest & cleaner), a real screenshot of the host calendar in a browser frame. CTA "Request free tester access" → e-mail with a prefilled subject and three questions (owner decision: testers contact us, access is unlocked by hand — a self-registered account has no rentals workspace), secondary → host guide.
- Screenshot taken from the prod test account with test data; the sidebar (account e-mail) was hidden and the "E2E" prefix removed from unit names in the DOM only, nothing was changed on the server.
- Project blocks: new optional `layout` ("side" | "showcase"), `showcaseUrl`, `steps[]` — editable in the block editor (layout select, frame address, add/remove steps) and auto-translated.
- `runHomeMigrations` now runs a list of migrations in order and writes one revision; new migration `v1.25-crm-iot-beta` (`applyCrmBetaV125`). The dry-run script applies both.
- The rental price is not shown on the site: the Vermietung plan is not in the public `/api/plans` catalog yet.

### 2026-10-10 (v1.24) — showcase refresh after the site audit

- **Metadata:** real `<title>`/description/Open Graph/Twitter cards in `src/app/layout.tsx` (was "Create Next App"); favicon now `src/app/icon.png` (= public/logo.png); `<html lang>` follows the chosen UI language; `scroll-smooth`; `font-sans` (Geist) finally applied to `<body>`.
- **Renderer:** scroll-in animations via `src/components/editor/reveal.tsx` (framer-motion `whileInView`, respects `prefers-reduced-motion`); hover lift/glow on project and portfolio cards; project images now show on mobile (above the text); `sizes` on portfolio images; locked cards show a blurred image behind the lock; image-less portfolio cards get an icon tile instead of "Media not set."; empty portfolio sections are skipped.
- **Project blocks:** new optional `badge` (label + tone) and `secondaryLink` fields (`src/lib/editor/types.ts`), editable in the block editor, auto-translated with the rest of the block. The hard-coded green "Live" is now only the fallback.
- **Public page:** `#projects` anchor always resolves (first product block); mobile header no longer overlaps (brand text and Login hidden below `sm`, Login moved to the footer); soft colour glows behind the glass; language switcher shows EN/DE/RU text instead of flag emoji (Windows renders flags as letters); footer links ≥44 px tall with better contrast.
- **Background:** gradient underlay is always present (no black flash before the video), `poster`/`preload="metadata"` on the video.
- **Chat:** polling 3 s → 15 s and paused in background tabs.
- **Content migration `v1.24-showcase`** (see "Live-content migrations" above): LinArt Labs hero, ColdART block, iOS app cards (NFC QR Business Card 3D Maker, Smart Home IoT Dashboard), LinArt ID card, Kids Lab (Monster Apocalypse, Boat Shutter) instead of the dead Minecraft map, About block, Community Chat removed, callout button relabelled "Contact us", contact block filled (vladimir@linart.club, Spalt), CRM-IoT "🚧" paragraph replaced by the orange "In development" badge, Private Cloud links fixed (nex.crm-iot.com, zerotrust, git; `**markdown**` → `<strong>`), Smart Hub Store DE/RU texts and "Zum Shop / В магазин" labels, QR Generator proper RU/DE, AI Consultant and Local LLM cards localised, AI Consultant moved to the first card.
- **Seed/translations:** same defaults for fresh installs; brand name "LinArt Labs" (was "LInArt"); dead `ensureHomeHasQrProject` removed; `host.linart.club` → `host.crm-iot.com`.
- New static assets in `public/assets/`: App Store artwork for both apps and screenshots of the two games.

### 2026-08-16 (v1.23)

- New admin section **Plugins** (`/admin/plugins`): install and edit third-party `<script>` embeds — chat widgets, analytics, pixels — without a code change or a redeploy. Name, script URL, attribute pairs (`data-client` = `105`), enable/disable, hide-on-paths, hide-selector, and a live preview of the resulting tag.
- Stored in `SiteConfig` under the key `plugins` instead of a new table, so no Prisma migration is needed (`prisma db push` cannot be run on the server from here, and the VPS has 848 MB RAM). The list is a handful of rows — exactly what the existing key/value store is for.
- `src/lib/plugins.ts` holds types and pure helpers and must stay free of Prisma: client components import from it, so a Prisma import would land in the browser bundle. DB access lives in `src/lib/plugins-store.ts`.
- The root layout now reads the DB. `/login`, `/register`, `/dashboard` render statically, so the read is wrapped in try/catch — without it the production build (which has no database) would fail.
- Migration is transparent: until an admin presses Save, the list falls back to `AI_CONSULTANT_CLIENT_ID`, so the widget survives the upgrade untouched. After the first save the DB wins and the env var is ignored.
- `src/components/chat/ai-consultant.tsx` replaced by the generic `src/components/chat/site-plugins.tsx`.
- Script URLs are restricted to `http:`/`https:` (a `javascript:` URL would otherwise be injectable), and a rejected plugin returns an error instead of being dropped silently.

### 2026-08-16 (v1.22)

- The consultant widget now mounts into a **shadow root**, so the old hide rule (`.lac-btn` / `.lac-panel`) no longer reached it and the chat button would have covered the editor on `/admin/*`.
- `src/components/chat/ai-consultant.tsx` now hides the shadow **host** instead — `<div data-linart-widget="…">` sits in the light DOM. The old `.lac-*` selectors are kept for cached pre-shadow copies of `widget.js`.
- linart.club points at site **105** again (its own knowledge base), not the account site 27.

### 2026-08-15 (v1.21)

- Integrated the LinArt AI Consultant online chat widget (`src/components/chat/ai-consultant.tsx`, mounted in `src/app/layout.tsx`).
- Widget script is loaded from the consultant backend (`https://ai.crm-iot.com/widget.js`) with `data-client` / `data-api`; hidden on `/admin/*` so it does not overlap the editor UI.
- Config via runtime env: `AI_CONSULTANT_CLIENT_ID` (empty = widget disabled) and `AI_CONSULTANT_API_URL`; wired through `docker-compose.yml` and `deploy.sh` (which rewrites `.env` on every deploy).
- `data-client` is a **site id**, and sites are rows in the consultant's own `clients` table (`role='site'`, `parent_id` = account); the primary site *is* the account. linart.club uses **105**, a child site with its own knowledge base, separate from the account site **27** ("LinArt Support AI"). Each site carries its own `AssistantConfig` — name, accent, logo, greeting, tone, `allowed_origins`, booking — so 105 must be configured in the portal on its own; as of 2026-08-16 it still returns platform defaults. The id is not a secret (it ships in the `<script>` tag), so `deploy.sh` and `docker-compose.yml` both fall back to `105`; env still overrides.
- Only `/` and `/p/[slug]` are `force-dynamic`, so they pick the id up at request time. Any statically rendered route bakes the build-time value — irrelevant today (those are `/login`, `/register`, `/dashboard`), but relevant if a public static page is added.
- Verified 2026-08-16: `GET /api/assistant/105/public` returns the tenant config for site 105.
- Consultant sources: <https://git.crm-iot.com/linart-labs/linart-ai-consultant> (local clone: `D:\Code\Ai consultant`). Origin control is `backend/services/widget_guard.py::origin_allowed`, enforced inside the POST handlers (`chat.py`, `conversations.py`, `stt.py`) — **not** at the CORS layer, so a preflight probe proves nothing. An empty `allowed_origins` means "allow everything", which is why site 105 currently answers linart.club. Set it to `linart.club` in the portal so the widget cannot be embedded elsewhere.
- Datenschutz: added §9 "KI-Chat / Online-Beratung" to `DATENSCHUTZ_HTML` in `src/lib/editor/seed.ts` (sections renumbered, Stand → August 2026). `ensureStaticPage` never overwrites an existing page, so the **live** `/p/datenschutz` must be updated by hand in `/admin/editor`.
- No third-country transfer: answers come from a self-hosted open-source LLM (`BASE_MODEL` default `mistralai/Mistral-7B-Instruct-v0.3`, served over an OpenAI-compatible endpoint on own infrastructure), speech-to-text from self-hosted faster-whisper, translation from the same local model. No external AI provider is called.
- Open item (consultant backend, not this repo): chat retention is **not** automated. `POST /api/admin/clients/{id}/purge-logs` only deletes `chat_logs`; the `conversations` / `messages` / `leads` / `appointments` tables have no purge path and no cron (`backend/worker.py` schedules only `refresh_urls_task`). §9 therefore states a criteria-based retention instead of a fixed period — a concrete "90 days" claim requires implementing an automatic purge first.
- App version bumped to 1.21.

### 2026-04-19 (v1.16)

- Added origins with `https://` protocol to `allowedOrigins` in `next.config.ts`.
- App version bumped to 1.16.

### 2026-04-19 (v1.15)

- Expanded `allowedOrigins` in `next.config.ts` to include `www` versions and wildcard subdomains to fix persistent 403 Forbidden errors on media uploads surfacing in production.
- App version bumped to 1.15.

### 2026-04-19 (v1.14)

- Fixed 403 Forbidden error on media uploads by adding `allowedOrigins` to `next.config.ts`.
- App version bumped to 1.14.

### 2026-04-13 (v1.13)

- Added `/p/impressum` and `/p/datenschutz` pages — auto-created on first startup via `ensureStaticPage()` in `seed.ts`.
- Legal texts comply with DDG (not outdated TMG), DSGVO, TDDDG.
- IONOS named as hosting provider with Art. 28 DSGVO AVV note; Steuernummer removed (not mandatory, sensitive).
- Added SSL/TLS section, explicit "no analytics" statement, YouTube embed disclosure, BayLDA complaint authority.
- Impressum footer links added to `public-page.tsx` (always visible, all languages).
- Copyright year updated to 2026 in EN/DE/RU translations.
- Fixed Home Page Structure docs (block order was outdated).
- Added Legal Pages & Compliance section to this manual (per-subdomain obligations table, missing items checklist, key legal facts).
- App version bumped to 1.13.

### 2026-04-13 (v1.12)

- Added 5 new home page sections: IoT server (featured first), Entertainment, CRM-IoT, Private Cloud.
- IoT server (host.linart.club) moved to top — pricing plans + welcome message for first hardware buyers.
- Entertainment section: Minecraft map + community chat grouped together.
- CRM-IoT: B2B rental automation description + "in development" notice + smart lock request CTA.
- Private Cloud: Immich + Nextcloud with Bavaria/Alpine server humor note.
- Translations updated in EN/RU/DE for all new sections.
- App version bumped to 1.12.
- Full deployment to VPS completed via Method C (local build + tar).
- SSH key added to VPS authorized_keys for passwordless deploy from PC.
- Port changed from 8080 to 3456 (8080 occupied by frps on VPS).
- Deployment & Updates section rewritten with full step-by-step instructions.

### 2025-12-28

- Added theme controls in admin (colors, background, font size, radius) and global theme loader.
- Improved editor page selection UX and page id/slug fallback in admin APIs.
- Added editor page picker + missing page id guard for the block editor.
- Added QR Generator portfolio item to default seed with cover asset (`public/assets/qr-generator-cover.svg`).
- Made homepage nav show Dashboard when a user is logged in to avoid re-auth prompts.
- Auto-append QR Generator to the Home portfolio when missing (keeps published in sync if no draft).
- Added Project Highlight block type and auto-inserted QR highlight on Home when missing.
- Hardened editor navigation (fallback to direct link if router push fails).
- Showed app version on the public homepage footer.
- Replaced editor page selector with native dropdown + direct navigation to fix non-clickable list.
- Removed auto QR highlight block; QR now stays only in portfolio to avoid duplicate info.
- Switched editor Open/Edit navigation to use `?open=<pageId>` query fallback.
- Made `/admin/editor` a client wrapper that reads `?open=` (avoids server searchParams quirks).
- Bumped app version to 1.11.
- Added VPS one-liners with current IP and path.
- Added app version constant (`src/lib/app-version.ts`) displayed in admin footer.
- Updated deployment options: prebuilt image + local tar workflow.
- Default port set to 8080; added install script and local test script.

### 2025-12-26

- Added DB-backed page editor with block rendering and revisions.
- Added media library and sanitize pipeline for HTML blocks.
- Added portfolio rows layout and chat block support.
- Added LibreTranslate integration for per-block translation.
- Updated translations (EN/DE/RU) and deployment cleanup options.

*Last Updated: 2026-04-19 (v1.16)*
