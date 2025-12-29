#!/usr/bin/env bash
set -euo pipefail
 
# Move to the repo root
cd "$(git rev-parse --show-toplevel)"
 
# Ensure we're not in a detached HEAD or bare repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a valid Git working tree."
  exit 1
fi

# Function to setup a submodule
setup_submodule() {
  local submodule_name=$1
  local submodule_url=$2
  
  echo "Setting up submodule: $submodule_name"
  
  # Remove existing submodule entry (if any)
  if git config --file .gitmodules --get-regexp "^submodule\.${submodule_name}\." > /dev/null 2>&1; then
    echo "Removing existing submodule config for $submodule_name..."
    git submodule deinit -f "$submodule_name" || true
    git rm -f "$submodule_name" || true
    rm -rf ".git/modules/${submodule_name}"
  fi
  
  # Clean local dir if needed
  rm -rf "$submodule_name"
  
  # Add the submodule
  echo "Adding submodule $submodule_name..."
  git submodule add -f "$submodule_url" "$submodule_name"
}

# Setup NextUtils submodule
setup_submodule "NextUtils" "git@github.com:DonaldNgai/NextUtils.git"

# Setup ChakraUI submodule
setup_submodule "ChakraUI" "git@github.com:DonaldNgai/ChakraUI.git"
 
# Sync & init
echo "Syncing and initializing all submodules..."
git submodule sync
git submodule update --init --recursive

