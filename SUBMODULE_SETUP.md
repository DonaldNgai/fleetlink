# Git Submodule Setup Guide

This repository uses a git submodule for the UI package, allowing it to be shared across multiple repositories without using npm/pnpm packages.

## Quick Start

### For Repository Maintainers

1. **Create the UI package repository on GitHub:**
   - Create a new repository: `ChakraUI`
   - Make it private (or public)
   - **Don't initialize with any files**

2. **Set up the UI package as a separate repo:**
   ```bash
   ./scripts/setup-ui-submodule.sh https://github.com/DonaldNgai/ChakraUI.git
   ```

3. **Convert to submodule in this repo:**
   ```bash
   # Remove from main repo tracking
   git rm -r --cached packages/ui
   rm -rf packages/ui
   
   # Add as submodule
   git submodule add https://github.com/DonaldNgai/ChakraUI.git packages/ui
   
   # Commit
   git add .gitmodules packages/ui
   git commit -m "chore: convert UI package to git submodule"
   ```

### For Developers Cloning This Repo

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/DonaldNgai/fleetlink.git

# Or if already cloned
git submodule update --init --recursive
```

### For Other Repositories Using This UI Package

```bash
# Add as submodule
git submodule add https://github.com/DonaldNgai/ChakraUI.git packages/ui

# Initialize
git submodule update --init --recursive

# Add to package.json
# "dependencies": {
#   "chakraui": "file:./packages/ui"
# }

# Install
pnpm install
```

## Updating the UI Package

### Making Changes

1. **Work directly in the submodule:**
   ```bash
   cd packages/ui
   # Make your changes
   git add .
   git commit -m "feat: add new component"
   git push origin main
   ```

2. **Update the submodule reference in main repo:**
   ```bash
   cd ..
   git add packages/ui
   git commit -m "chore: update UI package submodule"
   git push
   ```

### Pulling Latest Changes

```bash
# Update submodule to latest
cd packages/ui
git pull origin main
cd ..

# Or update from main repo
git submodule update --remote packages/ui
git add packages/ui
git commit -m "chore: update UI package submodule"
```

## Benefits of Submodule Approach

✅ **No npm/pnpm registry needed** - Works with just git  
✅ **Version control** - Each repo pins to a specific commit  
✅ **Easy sharing** - Clone the submodule repo in any project  
✅ **Independent development** - UI package can be developed separately  
✅ **Still supports npm** - Can also publish to GitHub Packages if needed  

## Troubleshooting

### Submodule shows as modified but no changes

```bash
cd packages/ui
git status
# If it shows modified, you might need to:
git submodule update --init --recursive
```

### Submodule is empty

```bash
git submodule update --init --recursive
```

### Want to remove submodule

```bash
git submodule deinit packages/ui
git rm packages/ui
rm -rf .git/modules/packages/ui
```
