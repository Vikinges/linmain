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

DEPLOY_REF="${DEPLOY_REF:-$(get_env_value DEPLOY_REF)}"
if [ -n "$DEPLOY_REF" ]; then
  echo "Checking out $DEPLOY_REF..."
  git fetch --all --tags
  git checkout "$DEPLOY_REF"
else
  echo "Pulling latest changes..."
  git pull origin master
fi

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

LINART_PORT="${LINART_PORT:-$(get_env_value LINART_PORT)}"
if [ -z "$LINART_PORT" ]; then
  LINART_PORT="8080"
fi

USE_PREBUILT_IMAGE="${USE_PREBUILT_IMAGE:-$(get_env_value USE_PREBUILT_IMAGE)}"
IMAGE_REF="${IMAGE_REF:-$(get_env_value IMAGE_REF)}"

CLEANUP_LEVEL="${CLEANUP_LEVEL:-safe}"

cat > .env <<EOF
NEXTAUTH_URL=$NEXTAUTH_URL
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
AUTH_SECRET=$AUTH_SECRET
AUTH_TRUST_HOST=true
ADMIN_EMAILS=$ADMIN_EMAILS
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
LINART_PORT=$LINART_PORT
USE_PREBUILT_IMAGE=$USE_PREBUILT_IMAGE
IMAGE_REF=$IMAGE_REF
DEPLOY_REF=$DEPLOY_REF
EOF

chmod 600 .env

mkdir -p public/uploads
chmod -R 775 public/uploads || true
if [ "$(id -u)" = "0" ]; then
  chown -R 1001:1001 public/uploads || true
fi

if [ "$USE_PREBUILT_IMAGE" = "1" ] || [ "$USE_PREBUILT_IMAGE" = "true" ]; then
  IMAGE_REF="${IMAGE_REF:-ghcr.io/vikinges/linmain:latest}"
  export IMAGE_REF
  echo "Pulling prebuilt image: $IMAGE_REF"
  docker compose --env-file .env pull web
  echo "Starting containers (no build)..."
  docker compose --env-file .env up -d --no-build
else
  echo "Building and starting containers..."
  docker compose --env-file .env up -d --build
fi

echo "Waiting for database..."
max_tries=30
count=0
until docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; do
  count=$((count + 1))
  if [ "$count" -ge "$max_tries" ]; then
    echo "ERROR: Database not ready after $((max_tries * 2))s."
    exit 1
  fi
  sleep 2
done

echo "Applying Prisma schema..."
docker compose exec -T web sh -lc "HOME=/tmp prisma db push --skip-generate --schema /app/prisma/schema.prisma"

if [ "$CLEANUP_LEVEL" != "off" ]; then
  echo "Cleaning up Docker artifacts..."
  docker container prune -f
  if [ "$CLEANUP_LEVEL" = "full" ]; then
    docker image prune -a -f
    docker volume prune -f
    docker network prune -f
  else
    docker image prune -f
  fi
  docker builder prune -f
  docker system df
fi

echo "Done. Logs: docker compose logs -f web"
