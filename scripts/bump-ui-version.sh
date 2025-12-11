#!/bin/bash

# Script to bump the version of the UI package
# Usage: ./scripts/bump-ui-version.sh [patch|minor|major]

VERSION_TYPE=${1:-patch}
PACKAGE_JSON="packages/ui/package.json"

if [ ! -f "$PACKAGE_JSON" ]; then
  echo "Error: $PACKAGE_JSON not found"
  exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./$PACKAGE_JSON').version")
echo "Current version: $CURRENT_VERSION"

# Bump version using npm version command
cd packages/ui
npm version $VERSION_TYPE --no-git-tag-version
cd ../..

# Get new version
NEW_VERSION=$(node -p "require('./$PACKAGE_JSON').version")
echo "New version: $NEW_VERSION"

echo ""
echo "Version bumped from $CURRENT_VERSION to $NEW_VERSION"
echo "Commit and push to trigger automatic publishing:"
echo "  git add packages/ui/package.json"
echo "  git commit -m 'chore: bump chakraui to $NEW_VERSION'"
echo "  git push"
