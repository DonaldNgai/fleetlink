# Quick Start: Git Submodule Setup

## Current Status

The UI package is set up in `packages/ui/` and is ready to be converted to a git submodule.

## Step-by-Step Setup

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ChakraUI`
3. Make it **private** (or public)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### 2. Push UI Package to New Repo

Run the setup script:

```bash
./scripts/setup-ui-submodule.sh https://github.com/DonaldNgai/ChakraUI.git
```

Or manually:

```bash
cd packages/ui
git init
git add .
git commit -m "Initial commit: FleetLink UI package"
git branch -M main
git remote add origin https://github.com/DonaldNgai/ChakraUI.git
git push -u origin main
```

### 3. Convert to Submodule in This Repo

```bash
# From the main repo root
git rm -r --cached packages/ui
rm -rf packages/ui

git submodule add https://github.com/DonaldNgai/ChakraUI.git packages/ui

git add .gitmodules packages/ui
git commit -m "chore: convert UI package to git submodule"
git push
```

### 4. Update package.json (if needed)

The main repo can keep `workspace:*` for pnpm workspace, but other repos using the submodule should use:

```json
{
  "dependencies": {
    "chakraui": "file:./packages/ui"
  }
}
```

## Using in Other Repositories

```bash
# Add submodule
git submodule add https://github.com/DonaldNgai/ChakraUI.git packages/ui

# Initialize
git submodule update --init --recursive

# Add to package.json
# "chakraui": "file:./packages/ui"

# Install
pnpm install
```

## Updating the UI Package

### Making Changes

```bash
cd packages/ui
# Make changes
git add .
git commit -m "feat: your changes"
git push origin main
cd ../..
git add packages/ui
git commit -m "chore: update UI submodule"
```

### Pulling Latest

```bash
git submodule update --remote packages/ui
git add packages/ui
git commit -m "chore: update UI submodule"
```

## Benefits

✅ **No npm registry needed** - Pure git solution  
✅ **Easy sharing** - Clone in any repo  
✅ **Version control** - Pin to specific commits  
✅ **Independent development** - Separate repo for UI  
✅ **Still supports npm** - Can publish to GitHub Packages too  

## Files Created

- `packages/ui/.gitignore` - Git ignore for UI package
- `packages/ui/.gitattributes` - Line ending configuration
- `packages/ui/README.md` - Package documentation
- `packages/ui/SETUP_SUBMODULE.md` - Detailed setup guide
- `packages/ui/USAGE.md` - Usage instructions
- `packages/ui/.github/workflows/publish.yml` - Auto-publish to npm (optional)
- `scripts/setup-ui-submodule.sh` - Automated setup script
- `SUBMODULE_SETUP.md` - Main setup guide
