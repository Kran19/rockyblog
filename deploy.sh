#!/bin/bash
set -e

echo "========================================="
echo "   Updating RockyBlog to Latest Version  "
echo "========================================="

echo "[1/3] Pulling latest code from main branch..."
git pull origin main

echo "[2/3] Rebuilding Docker containers..."
docker compose up -d --build

echo "========================================="
echo "   Deployment Complete Successfully!     "
echo "========================================="
