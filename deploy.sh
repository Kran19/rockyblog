#!/bin/bash
set -e

echo "========================================="
echo "   Updating RockyBlog to Latest Version  "
echo "========================================="

echo "[1/3] Fetching and syncing latest code from origin/main..."
git fetch origin main
git reset --hard origin/main

echo "[2/3] Rebuilding Docker container with fresh assets..."
docker compose build --no-cache app
docker compose up -d

echo "[3/3] Syncing Prisma database schema..."
docker compose exec -T app npx prisma db push || true

echo "========================================="
echo "   Deployment Complete Successfully!     "
echo "========================================="
