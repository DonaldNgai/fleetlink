# Quick Start: UI Package Publishing

## How It Works

✅ **Automatic Publishing on Push**: When you push changes to `main` that affect `packages/ui/`, GitHub Actions automatically:
1. Builds the package
2. Publishes it to GitHub Packages
3. Makes it available for `pnpm install` in other repos

## Publishing a New Version

### Option 1: Use the script (recommended)
```bash
./scripts/bump-ui-version.sh patch   # 1.0.0 → 1.0.1
./scripts/bump-ui-version.sh minor   # 1.0.0 → 1.1.0
./scripts/bump-ui-version.sh major   # 1.0.0 → 2.0.0

git add packages/ui/package.json
git commit -m "chore: bump chakraui to x.x.x"
git push
```

### Option 2: Manual version bump
```bash
# Edit packages/ui/package.json and change the version
git add packages/ui/package.json
git commit -m "chore: bump chakraui to x.x.x"
git push
```

## Using in Other Repositories

### 1. Create `.npmrc` in your other repo:
```
@donaldngai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=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
```

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

### 4. Use in your code:
```tsx
import { Button, Card, CardHeader } from 'chakraui';
```

## Local Development

In this repo, you can continue using:
```tsx
import { Button } from 'chakraui';
```

The workspace automatically links the local package. No changes needed!

## Troubleshooting

- **Package not found**: Make sure `.npmrc` is set up correctly in the consuming repo
- **Authentication error**: Verify your GitHub token has `read:packages` permission
- **Version not updating**: Check that you've committed and pushed the version change
