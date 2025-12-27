# Linart - Social Portal Container

A premium, containerized social hub with glassmorphism design, admin panel, and real-time chat.

## Features
- **Public Profile**: Beautiful landing page with your social links.
- **User Dashboard**: Private area for registered users with exclusive tools and Community Chat.
- **Admin Panel**: Manage links, icons, and visibility preferences.
- **Page Editor**: Block-based editor for public pages with multi-language content.
- **Media Library**: Upload and reuse images/videos across blocks.
- **Auto Translate**: Optional LibreTranslate integration for quick translations.
- **Authentication**: Secure login via NextAuth (Social + Credentials).
- **Chat Protection**: Rate limits, cooldowns, and link checks to reduce spam.
- **Design**: Modern Glassmorphism UI using Tailwind CSS + Framer Motion.

## Getting Started

### Prerequisites
- Docker & Docker Compose

### Installation

1. Clone or download this repository.
2. Create a `.env` file based on `.env.example` (if needed, though defaults work for dev).
3. Run the following command:

```bash
docker-compose up -d --build
```

4. Open [http://localhost:8080](http://localhost:8080) (default). To use another port:

```bash
LINART_PORT=3000 docker-compose up -d --build
```

### Local Testing (Windows, Docker)
Run one command to build, start, wait for Postgres, apply Prisma, and seed test accounts:

```powershell
.\scripts\local-test.ps1
```

This uses `docker-compose.local.yml` (port 3000) and creates `.env.local` if needed.

### Deployment (production)
Use the deployment script to pull updates, build containers, and apply Prisma.
It also supports Docker cleanup to save disk space.

```bash
./deploy.sh
```

Optional cleanup mode:
```bash
# safe (default), full, or off
CLEANUP_LEVEL=full ./deploy.sh
```

### Test Accounts
For local development, use these credentials:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin`
- Access: Full admin panel + all features

**User Account:**
- Email: `user@example.com`
- Password: `user`
- Access: User dashboard + chat

To create test accounts in database:
```bash
npm run db:seed
```

### Environment Variables
The `docker-compose.yml` sets up default variables. For production, update:
- `NEXTAUTH_SECRET`: Generate a random string.
- `DATABASE_URL`: Your PostgreSQL connection string (handled by Docker internal network by default).
- `LIBRETRANSLATE_URL`: Optional translation endpoint (default https://libretranslate.com/translate).
- `LIBRETRANSLATE_API_KEY`: Optional API key for LibreTranslate.

## Project Structure
- `src/app`: Page routes (Public, Dashboard, Admin).
- `src/app/admin/editor`: Page editor UI.
- `src/components`: UI components (Glassmorphism, Chat, etc).
- `src/components/editor`: Page renderer + editor blocks.
- `src/lib`: Backend logic (Actions, Auth, DB).
- `prisma`: Database schema.

## Development
To run locally without Docker (requires Postgres running):
```bash
npm install
npx prisma generate
npm run dev
```
*(Note: Windows users may need to run generic build commands if Turbopack permissions fail).*
