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

## Change Log

### 2026-04-13

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

*Last Updated: 2026-04-13*
