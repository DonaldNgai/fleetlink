#!/bin/bash

# Script to push changes including submodule updates
# Usage: ./scripts/push-with-submodule.sh [commit-message]

set -e

COMMIT_MSG=${1:-"chore: update submodule and main repo"}

echo "🔄 Checking for submodule changes..."

cd packages/ui

# Check if there are uncommitted changes in submodule
if ! git diff-index --quiet HEAD --; then
  echo "📝 Uncommitted changes found in packages/ui"
  read -p "Do you want to commit and push submodule changes? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "💾 Committing submodule changes..."
    git add .
    git commit -m "chore: update UI components" || echo "No changes to commit"
    
    echo "🚀 Pushing submodule to remote..."
    git push origin main || echo "Nothing to push or push failed"
  fi
fi

# Check if submodule is ahead of remote
if [ -n "$(git rev-list @{u}..HEAD 2>/dev/null)" ]; then
  echo "🚀 Submodule is ahead of remote, pushing..."
  git push origin main
fi

cd ../..

# Check if main repo has submodule reference changes
if git diff --quiet packages/ui; then
  echo "ℹ️  No submodule reference changes in main repo"
else
  echo "📝 Submodule reference changed, updating main repo..."
  git add packages/ui
  git commit -m "$COMMIT_MSG" || echo "No changes to commit"
fi

# Push main repo
echo "🚀 Pushing main repository..."
git push

echo "✅ Done!"
