#!/bin/bash
# Run all project tests (Unit + E2E)
set -e

echo "🚀 Starting local test suite..."

echo "📦 Step 0: Installing dependencies..."
docker compose -f docker-compose.dev.yaml run --rm app npm ci

echo "📦 Step 1: Bringing up the environment..."
# Start the database and app containers in detached mode
docker compose -f docker-compose.dev.yaml up -d mariadb app

echo "⏳ Waiting for the app to be ready..."
# Wait up to 30 seconds for the app to start responding on port 8473
for i in {1..30}; do
  if curl -s http://localhost:8473 > /dev/null; then
    echo "✅ App is up and running!"
    break
  fi
  echo "Waiting for app to start..."
  sleep 2
done

echo "🧪 Step 2: Running Unit tests with coverage..."
docker compose -f docker-compose.dev.yaml run --rm app npm run test:coverage

echo "🎭 Step 3: Running Playwright E2E tests..."
docker compose -f docker-compose.dev.yaml run --rm e2e npm run test:ui

echo "✅ All tests passed successfully! You are safe to commit and push."
