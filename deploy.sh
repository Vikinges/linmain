#!/bin/sh
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

get_env_value() {
  local key="$1"
  if [ -f .env ]; then
    sed -n "s/^${key}=//p" .env | tail -n 1
  fi
}

echo "Pulling latest changes..."
git pull origin master

printf "Google Client ID: " >&2
read -r GOOGLE_CLIENT_ID
printf "Google Client Secret: " >&2
if [ -t 0 ] && command -v stty >/dev/null 2>&1; then
  stty -echo
  read -r GOOGLE_CLIENT_SECRET
  stty echo
  printf "\n" >&2
else
  read -r GOOGLE_CLIENT_SECRET
fi

if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
  echo "ERROR: Google Client ID/Secret required."
  exit 1
fi

NEXTAUTH_URL="${NEXTAUTH_URL:-$(get_env_value NEXTAUTH_URL)}"
if [ -z "$NEXTAUTH_URL" ]; then
  NEXTAUTH_URL="https://linart.club"
fi

NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-$(get_env_value NEXTAUTH_SECRET)}"
if [ -z "$NEXTAUTH_SECRET" ]; then
  if command -v openssl >/dev/null 2>&1; then
    NEXTAUTH_SECRET="$(openssl rand -base64 32)"
  else
    NEXTAUTH_SECRET="$(python - <<'PY'
import secrets, base64
print(base64.b64encode(secrets.token_bytes(32)).decode())
PY
)"
  fi
fi

ADMIN_EMAILS="${ADMIN_EMAILS:-$(get_env_value ADMIN_EMAILS)}"
if [ -z "$ADMIN_EMAILS" ]; then
  ADMIN_EMAILS="linartvlad@gmail.com"
fi

AUTH_SECRET="${AUTH_SECRET:-$(get_env_value AUTH_SECRET)}"
if [ -z "$AUTH_SECRET" ]; then
  AUTH_SECRET="$NEXTAUTH_SECRET"
fi

cat > .env <<EOF
NEXTAUTH_URL=$NEXTAUTH_URL
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
AUTH_SECRET=$AUTH_SECRET
AUTH_TRUST_HOST=true
ADMIN_EMAILS=$ADMIN_EMAILS
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
EOF

chmod 600 .env

mkdir -p public/uploads
chmod -R 775 public/uploads || true
if [ "$(id -u)" = "0" ]; then
  chown -R 1001:1001 public/uploads || true
fi

echo "Building and starting containers..."
docker compose --env-file .env up -d --build

echo "Applying Prisma schema..."
docker compose exec -T web sh -lc "HOME=/tmp npx -y prisma@5.22.0 db push --skip-generate --schema /app/prisma/schema.prisma"

echo "Done. Logs: docker compose logs -f web"
