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

### Common Env

- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `ADMIN_EMAILS`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `LIBRETRANSLATE_URL`, `LIBRETRANSLATE_API_KEY` (optional)
- `LINART_PORT` (default 8080)
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

### Method C: Local build + tar + docker load (recommended for 4GB VPS)

- Build locally, `docker save` to tar, upload to VPS, then `docker load`.
- Start with `docker compose up -d --no-build`.
- Remove the tar after successful load to save disk.

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

### 2025-12-28

- Added theme controls in admin (colors, background, font size, radius) and global theme loader.
- Improved editor page selection UX and page id/slug fallback in admin APIs.
- Added app version constant (`src/lib/app-version.ts`) displayed in admin footer.
- Updated deployment options: prebuilt image + local tar workflow.
- Default port set to 8080; added install script and local test script.

### 2025-12-26

- Added DB-backed page editor with block rendering and revisions.
- Added media library and sanitize pipeline for HTML blocks.
- Added portfolio rows layout and chat block support.
- Added LibreTranslate integration for per-block translation.
- Updated translations (EN/DE/RU) and deployment cleanup options.

*Last Updated: 2025-12-28*
