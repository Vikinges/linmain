# VPS Development & Maintenance Guide

This guide is for developers maintaining the Linart Main Site on the production VPS.

## 1. Connection Info

- **Environment**: Production VPS (Ubuntu)
- **IP Address**: `85.215.32.66`
- **SSH User**: `root`
- **App Directory**: `/opt/linart`
- **Port**: `3456` (Publicly available via Nginx at `https://linart.club`)

### Prerequisites
To connect and deploy, your SSH public key must be added to `/root/.ssh/authorized_keys` on the VPS.

## 2. Deployment Workflow (The "AI-Preferred" Method)

We use a "Push-to-GitHub -> Automated-Pull" workflow to avoid building on the VPS (which has limited 4GB RAM).

### Step 1: Local Changes
1. Make your changes in the code.
2. **Mandatory**: Bump the version in `src/lib/app-version.ts` (e.g., from `1.15` to `1.16`).
3. Update the Change Log in `AI_PROJECT_MANUAL.md`.

### Step 2: Push to GitHub
```bash
git add .
git commit -m "feat/fix: descriptive message"
git push origin master
```
**Important**: Wait 3–5 minutes for GitHub Actions to finish building the Docker image and pushing it to GitHub Container Registry (GHCR).

### Step 3: Remote Update (VPS)
Run this command from your local machine (Windows PowerShell or Linux terminal) to trigger the update on the VPS:

```powershell
ssh root@85.215.32.66 "export USE_PREBUILT_IMAGE=1 && export IMAGE_REF=ghcr.io/vikinges/linmain:latest && cd /opt/linart && printf '<GOOGLE_CLIENT_ID>\n<GOOGLE_CLIENT_SECRET>\n' | ./deploy.sh"
```
*(Replace `<GOOGLE_CLIENT_ID>` and `<GOOGLE_CLIENT_SECRET>` with actual secrets from the VPS `.env` file).*

## 3. Current Critical Bug: "403 Forbidden on Media Uploads"

### Description
Users receive a `403 Forbidden` error when attempting to upload images/videos in the Admin Editor. This happens during a `POST` request to a Server Action.

### Root Cause
This is a CSRF protection mechanism in Next.js Server Actions. It compares the `Origin` header (sent by the browser) with the `Host` header (seen by the application). 
Since the app is behind an Nginx reverse proxy, there is often a mismatch (e.g., Browser sends `https://linart.club` while the app might see `localhost:3000` or `127.0.0.1:3456`).

### Progress (as of v1.16)
We have attempted to fix this by adding `allowedOrigins` to `next.config.ts`:
```typescript
experimental: {
  serverActions: {
    allowedOrigins: [
      'linart.club',
      'https://linart.club',
      // ... other variants
    ]
  }
}
```

### Next Steps (If 403 persists)
If version `1.16` does not solve the issue, the following must be checked:
1. **Nginx Headers**: Ensure Nginx passes the correct headers. The site config is at `/etc/nginx/sites-enabled/linart.club`.
   Recommended settings in `location /`:
   ```nginx
   proxy_set_header Host $host;
   proxy_set_header X-Forwarded-Host $host;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   proxy_set_header X-Forwarded-Proto $scheme;
   ```
2. **Middleware**: Check if any middleware is stripping the `Origin` header before it reaches the Server Action.
3. **Cloudflare**: The site uses Cloudflare SSL. Check if Cloudflare's "Bot Management" or "WAF" is blocking specific POST requests.

---
*Last Updated: 2026-04-19 (v1.16)*
