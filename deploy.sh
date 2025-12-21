#!/bin/sh

# Stop script on error
set -e

echo "🧹 Cleaning up Docker system (removing unused images, containers, and volumes)..."
# Force prune everything to free up disk space before build
docker system prune -af --volumes

echo "⬇️ Pulling latest changes from GitHub..."
git pull origin master

echo "🚀 Building and starting containers..."
docker compose up -d --build

echo "✅ Deployment complete! Check logs with: docker compose logs -f web"
