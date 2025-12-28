#!/bin/sh
set -e

INSTALL_DIR="${INSTALL_DIR:-/opt/linart}"
REPO_URL="${REPO_URL:-https://github.com/Vikinges/linmain.git}"

if [ ! -d "$INSTALL_DIR/.git" ]; then
  mkdir -p "$INSTALL_DIR"
  if [ -n "$(ls -A "$INSTALL_DIR" 2>/dev/null)" ]; then
    echo "ERROR: $INSTALL_DIR is not empty."
    exit 1
  fi
  echo "Cloning repo into $INSTALL_DIR..."
  git clone "$REPO_URL" "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"
chmod +x deploy.sh
./deploy.sh
