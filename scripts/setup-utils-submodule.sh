#!/bin/bash

# Script to set up the next-utils package as a git submodule
# This converts the packages/next-utils directory into its own git repository

set -e

UTILS_DIR="packages/next-utils"
REPO_URL="https://github.com/DonaldNgai/NextUtils.git"

echo "Setting up next-utils as a git submodule..."

# Check if the directory exists
if [ ! -d "$UTILS_DIR" ]; then
  echo "Error: $UTILS_DIR does not exist"
  exit 1
fi

# Check if it's already a git repository
if [ -d "$UTILS_DIR/.git" ]; then
  echo "Warning: $UTILS_DIR is already a git repository"
  echo "Skipping git initialization..."
else
  # Initialize git repository in the utils package
  cd "$UTILS_DIR"
  git init
  git add .
  git commit -m "Initial commit: Next.js utilities package"
  
  # Add remote (create the repo on GitHub first if it doesn't exist)
  git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
  
  # Create and push to main branch
  git branch -M main
  echo "Ready to push. Run: cd $UTILS_DIR && git push -u origin main"
  cd ../..
fi

# Remove the directory from main repo (if not already done)
if git ls-files --error-unmatch "$UTILS_DIR" >/dev/null 2>&1; then
  echo "Removing $UTILS_DIR from main repository..."
  git rm -r --cached "$UTILS_DIR" 2>/dev/null || true
fi

# Add as submodule
if [ ! -f ".gitmodules" ] || ! grep -q "$UTILS_DIR" .gitmodules 2>/dev/null; then
  echo "Adding $UTILS_DIR as a submodule..."
  git submodule add "$REPO_URL" "$UTILS_DIR" || {
    echo "Note: Submodule might already exist or repo needs to be created on GitHub first"
  }
else
  echo "Submodule already configured in .gitmodules"
fi

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create the repository on GitHub: $REPO_URL"
echo "2. If not already pushed, run: cd $UTILS_DIR && git push -u origin main"
echo "3. If submodule wasn't added, run: git submodule add $REPO_URL $UTILS_DIR"
echo "4. Commit the .gitmodules file: git add .gitmodules && git commit -m 'Add next-utils submodule'"
