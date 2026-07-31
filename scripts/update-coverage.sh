#!/bin/sh
set -e

# The tests are run automatically before this script via npm hook
# Reading coverage summary...
COVERAGE_JSON="coverage/coverage-summary.json"

if [ ! -f "$COVERAGE_JSON" ]; then
  echo "Coverage summary not found at $COVERAGE_JSON. Exiting gracefully."
  exit 0
fi

PCT=$(node -e "console.log(Math.floor(require('./' + '$COVERAGE_JSON').total.lines.pct))")

# Update README.md
sed -i -E "s|!\[Coverage\]\(https://img\.shields\.io/badge/Coverage-[0-9]*%25-yellow\.svg\)|![Coverage](https://img.shields.io/badge/Coverage-${PCT}%25-yellow.svg)|g" README.md

echo "✅ Coverage badge updated to ${PCT}%"
