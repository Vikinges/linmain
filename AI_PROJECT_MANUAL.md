# Linart Main Site - AI Project Manual

## CMS / Page Editor (Summary)

- Public pages are stored in the database: Page, PageRevision, MediaAsset (see `prisma/schema.prisma`).
- Blocks are JSON: `src/lib/editor/types.ts` and `src/lib/editor/factory.ts`.
- Rendering: `src/components/editor/page-renderer.tsx`.
- Public routes: `/` uses `src/app/page.tsx`, other pages use `src/app/p/[slug]/page.tsx`.
- Admin editor: `/admin/editor` (list + global settings) and `/admin/editor/[pageId]` (block editor).
- Admin APIs: `/api/admin/pages`, `/api/admin/media`, `/api/admin/translate`.
- Site-wide settings: `/api/site-config` stores `content`, `contentStyles`, and `theme`.
- Localization: `src/lib/translations/{en,de,ru}.ts` with `src/lib/i18n-config.ts`.
- Chat: `src/components/chat/chat-box.tsx`, anti-spam in `src/lib/actions/chat.ts`.

## Quick Edits

- Homepage blocks: Admin > Editor > Home page > edit blocks.
- Portfolio rows: edit the `portfolio` block items (map/video/locked).
- Global nav/footer/social/logo/background: Admin > Editor > Global Settings.
- Media library: Admin > Editor > Media.

## Key Paths

- `src/app/page.tsx` (homepage)
- `src/app/p/[slug]/page.tsx` (public pages)
- `src/app/admin/editor/page.tsx` (editor dashboard)
- `src/app/admin/editor/[pageId]/page.tsx` (block editor)
- `src/components/editor/page-renderer.tsx` (public renderer)
- `src/components/editor/page-editor.tsx` (admin block editor)
- `src/components/editor/editor-dashboard.tsx` (admin dashboard)
- `src/lib/editor/types.ts` (block types)
- `src/lib/editor/seed.ts` (default pages)
- `prisma/schema.prisma` (Page/PageRevision/MediaAsset/SiteConfig)
- `deploy.sh` (deployment script)

## Admin Navigation

- Editor is the primary content editor.
- Legacy `/admin/content` and `/admin/appearance` redirect to `/admin/editor`.
- Sidebar should scroll if the menu exceeds screen height (see `src/components/admin/sidebar.tsx`).

## Deployment

- Run `./deploy.sh` on the VPS.
- The script pulls `master`, prompts for Google OAuth keys, writes `.env`, rebuilds Docker, and runs Prisma `db push`.
- Cleanup is controlled by `CLEANUP_LEVEL`:
  - `off`: no cleanup
  - `safe` (default): prune containers/images and builder cache
  - `full`: additionally prune volumes and networks

## Environment

- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `ADMIN_EMAILS`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `LIBRETRANSLATE_URL`, `LIBRETRANSLATE_API_KEY` (optional)

## Known Issues

- On Windows, `npm run build` can fail due to Turbopack symlink permissions. Prefer Docker for production builds.

## Change Log

### 2025-12-26
- Added DB-backed page editor with block rendering and revisions.
- Added media library and sanitize pipeline for HTML blocks.
- Added portfolio rows layout and chat block support.
- Added LibreTranslate integration for per-block translation.
- Updated translations (EN/DE/RU) and deployment cleanup options.

*Last Updated: 2025-12-26*
