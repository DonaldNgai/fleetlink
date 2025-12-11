#!/bin/bash

# Script to set up the UI package as a separate git repository
# Usage: ./scripts/setup-ui-submodule.sh [repo-url]

set -e

REPO_URL=${1:-"https://github.com/DonaldNgai/ChakraUI.git"}
UI_DIR="packages/ui"

echo "🚀 Setting up UI package as separate git repository..."

# Check if we're in the right directory
if [ ! -d "$UI_DIR" ]; then
  echo "❌ Error: $UI_DIR directory not found"
  exit 1
fi

cd "$UI_DIR"

# Check if git is already initialized
if [ -d ".git" ]; then
  echo "⚠️  Git repository already initialized in $UI_DIR"
  read -p "Do you want to continue? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
else
  echo "📦 Initializing git repository..."
  git init
  git branch -M main
fi

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
  echo "⚠️  Remote 'origin' already exists"
  CURRENT_URL=$(git remote get-url origin)
  echo "Current URL: $CURRENT_URL"
  read -p "Do you want to update it to $REPO_URL? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git remote set-url origin "$REPO_URL"
  fi
else
  echo "🔗 Adding remote repository..."
  git remote add origin "$REPO_URL"
fi

# Add all files
echo "📝 Staging files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
  echo "ℹ️  No changes to commit"
else
  echo "💾 Creating initial commit..."
  git commit -m "Initial commit: FleetLink UI package"
fi

# Ask about pushing
read -p "Do you want to push to remote? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🚀 Pushing to remote..."
  git push -u origin main
  echo "✅ Successfully pushed to $REPO_URL"
else
  echo "ℹ️  Skipping push. Run 'git push -u origin main' when ready."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Remove packages/ui from main repo: git rm -r --cached packages/ui"
echo "2. Add as submodule: git submodule add $REPO_URL packages/ui"
echo "3. Commit: git commit -m 'chore: convert UI package to git submodule'"
