# UI Package Setup Guide

This repository contains a private npm package `chakraui` that is published to GitHub Packages.

## How It Works

1. **Automatic Publishing**: When you push changes to the `main` branch that affect `packages/ui/`, GitHub Actions automatically builds and publishes the package.

2. **Version Management**: To publish a new version:
   ```bash
   # Bump version (patch, minor, or major)
   ./scripts/bump-ui-version.sh patch
   
   # Or manually edit packages/ui/package.json
   
   # Commit and push
   git add packages/ui/package.json
   git commit -m "chore: bump chakraui to x.x.x"
   git push
   ```

## Using in Other Repositories

### 1. Create `.npmrc` in your other repository:

```
@donaldngai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Replace `YOUR_GITHUB_TOKEN` with a GitHub Personal Access Token (classic) with `read:packages` permission.

### 2. Add to `package.json`:

```json
{
  "dependencies": {
    "chakraui": "^1.0.0"
  }
}
```

### 3. Install:

```bash
pnpm install
```

## Local Development

In this monorepo, the UI package is linked via pnpm workspace. The main app automatically uses the local version from `packages/ui`.

To use the published version locally (for testing), you can temporarily remove it from the workspace or use `pnpm install --no-link`.

## Manual Publishing (if needed)

If you need to publish manually:

```bash
# Set up authentication (one time)
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> packages/ui/.npmrc.local

# Build and publish
pnpm ui:build
pnpm ui:publish
```

## GitHub Actions Token

The workflow uses `GITHUB_TOKEN` automatically provided by GitHub Actions. No additional secrets are needed for publishing.
