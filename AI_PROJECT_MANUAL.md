# Linart Main Site - AI Project Manual

## 📋 Project Overview

**Project Name:** Linart Main Site  
**Owner:** Vladimir Linartas  
**Tech Stack:** Next.js 16.1.0, TypeScript, Tailwind CSS, PostgreSQL, Prisma, NextAuth  
**Purpose:** Personal portfolio and admin management system showcasing 20+ years of experience in business, content creation, and technology

---

## 🏗️ Architecture

### Technology Stack

```
Frontend:
- Next.js 16.1.0 (App Router with Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Radix UI Primitives
- React Colorful (color picker)
- Lucide React (icons)

Backend:
- Next.js API Routes
- Server Actions
- PostgreSQL Database
- Prisma ORM

Authentication:
- NextAuth.js
- Mock authentication (for Windows development)
- Future: Full OAuth integration in Docker

Deployment:
- Docker & Docker Compose
- Development: Windows (npm run dev)
- Production: Docker containers
```

### Project Structure

```
linart_main_site/
├── public/
│   ├── logo.png                    # Linart logo (dark mountain design)
│   └── uploads/                    # Future: uploaded media files
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout with fonts
│   │   ├── page.tsx                # Homepage (Vladimir Linartas portfolio)
│   │   ├── login/                  # Login page
│   │   ├── dashboard/              # User dashboard
│   │   │   ├── page.tsx            # Main dashboard with stats
│   │   │   └── settings/           # User settings
│   │   └── admin/                  # Admin panel
│   │       ├── page.tsx            # Admin dashboard
│   │       ├── appearance/         # ⭐ Theme customization
│   │       ├── analytics/          # Mock analytics
│   │       ├── content/            # Content management
│   │       ├── database/           # Database management
│   │       ├── users/              # User management
│   │       ├── chat/               # Chat messages
│   │       └── settings/           # Admin settings
│   │   └── uploads/                # Uploaded media route
│   │       ├── [...path]/route.ts  # Serves /uploads/* with range support
│   ├── components/
│   │   ├── admin/
│   │   │   ├── sidebar.tsx         # Admin navigation
│   │   │   ├── color-picker.tsx    # Color selection component
│   │   │   └── media-uploader.tsx  # Drag-and-drop file upload
│   │   ├── layout/
│   │   │   └── background-video.tsx # Background video with blur
│   │   ├── providers/
│   │   │   └── app-providers.tsx    # SessionProvider wrapper
│   │   └── ui/                     # Shadcn UI components
│   ├── lib/
│   │   ├── admin.ts               # Admin auth helpers (email/role gate)
│   │   ├── theme-config.ts         # ⭐ Theme system (colors, transparency, etc.)
│   │   ├── utils.ts                # Shared utilities
│   │   └── actions/                # Server actions
│   │       ├── auth.ts             # Authentication
│   │       └── chat.ts             # Chat functionality
│   └── styles/
│       └── globals.css             # Global styles + Tailwind
├── prisma/
│   └── schema.prisma               # Database schema
├── docker-compose.yml              # Docker configuration
├── DOCKER_GUIDE.md                 # Docker setup instructions (Russian)
└── README.md                       # Project README
```

---

## 🎨 Design System

### Brand Identity

**Logo:** Linart (mountain/peaks design)
- Black peaks graphic on top
- Three gray pillars (light, medium, dark)
- Bold "LINART" text below

**Color Scheme:** Dark Gray Professional
```css
Primary:   #4A4A4A  /* Dark Gray */
Secondary: #808080  /* Medium Gray */
Accent:    #C0C0C0  /* Light Gray */
Background: #1a1a1a /* Very Dark Gray */
```

**Typography:** 
- Font: Inter (default), Poppins, Roboto, Outfit, Space Grotesk
- Base Size: 16px (configurable)

**Visual Style:**
- Glassmorphism effects (backdrop-blur)
- Subtle gradients
- Card-based layouts
- Smooth transitions
- Dark theme throughout

---

## ⚙️ Key Features

### 1. Homepage (`/`)

**Personal Portfolio for Vladimir Linartas**

Content:
- Hero section with badge: "20+ Years of Experience"
- Headline: "VLADIMIR LINARTAS"
- Subtitle: "Entrepreneur • Creator • Developer"
- Description: "Transforming ideas into reality through innovation in business, content creation, and technology"
- CTA buttons: "View My Work", "Contact Me"
- Social links: LinkedIn, YouTube

Three Pillars Section:
1. **Business**: 20+ years managing multi-profile companies
2. **Content Creation**: Engaging video storytelling
3. **Tech Development**: Electronics and software product development

Features:
- Background video support with blur effect
- Responsive design
- Social media integration
- Dynamic theme application

### 2. Admin Theme System (`/admin/appearance`)

**Full visual customization through admin panel**

**Colors Tab:**
- Primary, Secondary, Accent, Background color pickers
- Live hex code editing
- Visual preview

**Background Tab:**
- Video Upload: Drag-and-drop for MP4/WebM (max 100MB)
- Or Video URL input
- Fallback Image Upload: Drag-and-drop for images (max 10MB)
- Blur Amount: 0-100px slider
- Opacity: 0-100% slider

**Typography Tab:**
- Font family selection (Inter, Poppins, Roboto, Outfit, Space Grotesk)
- Base font size: 12-20px slider

**Components Tab:**
- Menu Transparency: 0-100%
- Cards Transparency: 0-100%
- Buttons Transparency: 0-100%
- Border Radius: 0-50px
- Border Width: 0-5px

**Persistence:**
- Saves to browser localStorage
- Key: `linart-theme`
- Auto-applies on page load
- Save/Reset buttons

### 3. User Dashboard (`/dashboard`)

**Vibrant user statistics and activity**

Features:
- Welcome banner with gradient
- Stats cards:
  - Total Views (blue gradient)
  - Link Clicks (purple gradient)
  - Messages (orange gradient)
  - Active Links (green gradient)
- "Your Links" section with service icons
- "Recent Activity" feed
- "Community Chat" placeholder

### 4. User Settings (`/dashboard/settings`)

Sections:
- **Profile**: Name, Email, Bio, Website
- **Notifications**: Email, Messages, Weekly Reports (toggles)
- **Security**: Password change
- **Appearance**: Dark mode, Compact view

### 5. Admin Panel (`/admin`)

**Navigation:**
- Dashboard (overview)
- Users & Groups
- Chat Messages
- Analytics
- Content
- Database
- **Appearance** ⭐
- Settings

**Quick Access:**
- Home Page (/)
- User Dashboard (/dashboard)

### 6. Authentication

**Current:** NextAuth (Credentials + optional Google)
- Credentials uses Prisma user email/password
- Google provider enabled only when GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
- Admin access requires a valid session (server-side guard on /admin)
- Admin allowlist: ADMIN_EMAILS (comma-separated) or role ADMIN
 - Session includes `isAdmin` flag for client UI gating
 - Root layout wraps app in SessionProvider

---

## 🔧 Configuration Files

### `theme-config.ts`

Defines theme structure and defaults:

```typescript
interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  transparency: {
    menu: number      // 0-100
    cards: number     // 0-100
    buttons: number   // 0-100
  }
  background: {
    videoUrl: string
    blurAmount: number  // 0-100
    opacity: number     // 0-100
    fallbackImage: string
  }
  typography: {
    fontFamily: string
    fontSize: number
  }
  borders: {
    radius: number
    width: number
  }
}
```

Default theme uses dark gray color scheme matching Linart logo.

### `docker-compose.yml`

Services:
- `web`: Next.js application
- `db`: PostgreSQL database

Auth-related env vars (set in the shell or .env for Docker):
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- AUTH_SECRET
- AUTH_TRUST_HOST
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
- ADMIN_EMAILS

Uploads:
- Host volume mounted to `/app/public/uploads` for persistence

### `prisma/schema.prisma`

Database models:
- User
- Link
- ChatMessage
- (Future: Media, Theme settings in DB)

---

## 🚀 Development Workflow

### Local Development (Windows)

```bash
# Install dependencies
npm install

# Run development server (Turbopack)
npm run dev

# Access at http://localhost:3000
```

**Known Issues on Windows:**
- Some Turbopack errors with complex pages
- Use mock authentication
- File uploads use blob URLs (temporary)

**Solutions:**
- Simplified admin pages (mocks for analytics, content, database)
- Background video component handles errors gracefully
- Future features require Docker for full functionality

### Docker Development (Recommended for Full Features)

```bash
# Build and start containers
docker-compose up -d --build

# Access at http://localhost:3000

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

**Docker Benefits:**
- Full database functionality
- Real authentication
- File uploads persist
- More stable than Windows Turbopack

---

## 📝 Component Library

### Admin Components

**`<ColorPicker>`** - Color selection with visual picker and hex input
```tsx
<ColorPicker
  label="Primary Color"
  color="#8b5cf6"
  onChange={(c) => setColor(c)}
/>
```

**`<MediaUploader>`** - Drag-and-drop file upload with preview
```tsx
<MediaUploader
  accept="video/mp4,video/webm"
  maxSize={100}
  type="video"
  onUrlChange={(url) => setVideoUrl(url)}
/>
```

### Layout Components

**`<BackgroundVideo>`** - Background video with blur and fallback
```tsx
<BackgroundVideo
  videoUrl="/path/to/video.mp4"
  blurAmount={20}
  opacity={50}
  fallbackImage="/fallback.jpg"
/>
```

### UI Components (Shadcn)

All standard Shadcn components available:
- Button, Card, Input, Label
- Slider, Tabs, Switch, Separator
- Popover, Dialog, etc.

---

## 🎯 Common Tasks

### Adding a New Admin Page

1. Create page: `src/app/admin/newpage/page.tsx`
2. Add route to `src/components/admin/sidebar.tsx`:
```tsx
{
  label: "New Page",
  icon: IconName,
  href: "/admin/newpage",
  color: "text-color-500",
  description: "Description"
}
```
3. Import icon from `lucide-react`

### Customizing Theme from Code

```typescript
import { saveTheme, loadTheme } from '@/lib/theme-config'

const newTheme = {
  ...loadTheme(),
  colors: {
    primary: '#custom',
    // ...
  }
}

saveTheme(newTheme)
```

### Adding New Color/Setting

1. Update `ThemeConfig` interface in `theme-config.ts`
2. Add to `defaultTheme`
3. Update `themeToCssVariables` function
4. Add UI controls in `admin/appearance/page.tsx`

---

## 🐛 Troubleshooting

### Background Video Error

**Issue:** Console shows "Failed to load background video"

**Solution:** This is normal when no video is uploaded. Warning only shows if videoUrl exists but fails to load.

### Appearance Settings Not Saving

**Issue:** Changes don't persist after refresh

**Solution:** 
- Check browser localStorage for `linart-theme` key
- Verify `saveTheme()` is called on save button click
- Clear cache and reload

### Upload Not Working

**Issue:** File upload doesn't show

**Solution:**
- Verify `MediaUploader` component is imported
- Check `accept` prop matches file type
- File creates blob URL (temporary in dev mode)

### Uploads Return 404

**Issue:** `GET /uploads/*.mp4` returns 404 even when the file exists.

**Solution:**
- Route handler serves uploads from disk: `src/app/uploads/[...path]/route.ts`
- Ensure the host path `public/uploads` is mounted into the container
- Verify permissions allow the app user to read files

### Google OAuth "invalid_client"

**Issue:** Google sign-in shows `invalid_client`

**Likely Causes:**
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set inside the container
- OAuth client type is not "Web application"
- Redirect URI missing: `https://<domain>/api/auth/callback/google`

**Fix:**
- Rotate secret in Google Cloud and update Docker env
- Rebuild container after updating env

### Sidebar Button Missing

**Issue:** Don't see Appearance button

**Solution:**
- Scroll down in sidebar
- Check `src/components/admin/sidebar.tsx` has Appearance route
- Verify icon import (`Palette` from lucide-react)

---

## 📦 Dependencies

### Core
```json
{
  "next": "16.1.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5"
}
```

### UI
```json
{
  "@radix-ui/react-slider": "^1.1.2",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-popover": "^1.0.7",
  "@radix-ui/react-switch": "^1.0.3",
  "@radix-ui/react-separator": "^1.0.3",
  "react-colorful": "^5.6.1",
  "lucide-react": "latest"
}
```

### Database
```json
{
  "@prisma/client": "latest",
  "prisma": "latest"
}
```

---

## 🔐 Security Notes

**Current State (Development/Prod):**
- NextAuth with Credentials and optional Google
- Admin access enforced server-side on /admin
- Server actions that modify data require admin session
- Theme persists in localStorage (client-side only)

**Production Recommendations:**
- Use strong AUTH_SECRET and rotate regularly
- Restrict ADMIN_EMAILS to a short allowlist
- Add rate limiting for auth endpoints
- Move theme settings to database

---

## 🎨 Future Enhancements

### Media Management System
- Upload logo to `/public/logo.png`
- Upload photos and videos to database
- Image optimization
- CDN integration

### Links Management
- CRUD for social links
- Custom icons
- Drag-and-drop reordering
- Visibility toggles

### Advanced Theme Features
- Multiple theme presets
- Export/Import themes
- Animation speed controls
- Font file uploads
- Real-time preview mode

### Content Management
- Blog post creation
- Portfolio projects
- Case studies
- Testimonials

---

## 📞 Support & Contact

**Project Owner:** Vladimir Linartas
- LinkedIn: https://linkedin.com/in/vladimir-linartas
- Website: http://localhost:3000 (production TBD)

**Documentation:**
- Docker Guide: `/DOCKER_GUIDE.md` (Russian)
- Troubleshooting: `/TROUBLESHOOTING.md` (Critical fixes)
- This Manual: `/AI_PROJECT_MANUAL.md`

---

## 🔄 Change Log

### 2025-12-21
- Added admin-only gate for /admin layout and server actions
- Made Google provider optional (only when env is set)
- Login page hides Google button if provider is unavailable
- Fixed login page provider typing to avoid next-auth ClientSafeProvider export error
- Homepage admin/dashboard links now require an authenticated session
- Docker image sets writable uploads directory
- Docker base image installs OpenSSL so Prisma can generate/use correct engines on Alpine
- Docker compose expects auth env vars and mounts uploads volume
- Deploy script prompts for Google OAuth credentials, writes .env, and runs Prisma db push
- Deploy script pins Prisma CLI to v5 to avoid Prisma 7 schema URL validation errors
- Deploy script skips Prisma generate inside container to avoid missing generator files
- Runtime image includes Prisma schema for db push
- Added /uploads route handler to serve uploaded media with range support

### 2025-12-20
- ✅ Created theme customization system
- ✅ Added background video support
- ✅ Implemented media uploader (drag-and-drop)
- ✅ Redesigned homepage with Linart branding
- ✅ Updated to dark gray color scheme
- ✅ Added logo integration
- ✅ Changed experience from 15+ to 20+ years
- ✅ Enhanced business/tech descriptions

### Earlier
- ✅ Initial Next.js setup
- ✅ Admin panel with sidebar
- ✅ User dashboard and settings
- ✅ Mock authentication
- ✅ Docker configuration
- ✅ Prisma database setup

---

## 📚 AI Integration Notes

**For AI Assistants:**

This project uses:
- Server Components by default (no 'use client' unless needed)
- App Router (not Pages Router)
- TypeScript strict mode
- Tailwind for styling (no CSS modules)

**When Making Changes:**
1. Always check `task.md` for current work status
2. Update documentation after significant changes
3. Test in both dev mode (npm run dev) and Docker
4. Maintain dark gray color scheme
5. Follow glassmorphism design patterns
6. Keep locale storage keys consistent
7. Use server actions for data mutations
8. Prefer builtin Next.js features over external libs

**Key Files to Remember:**
- Theme: `src/lib/theme-config.ts`
- Admin Auth: `src/lib/admin.ts`
- Homepage: `src/app/page.tsx`
- Admin: `src/components/admin/sidebar.tsx`
- Appearance: `src/app/admin/appearance/page.tsx`

---

*Last Updated: 2025-12-21 by AI Assistant*
*Keep this manual updated with each significant change!*
