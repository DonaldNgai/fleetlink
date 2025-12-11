# Git Submodule Workflow Guide

## Important: Submodules Don't Auto-Push

When you push the main repository, **it does NOT automatically push changes in the submodule**. The main repo only tracks a commit reference to the submodule.

## Workflow for Making Changes

### Scenario 1: Changes Only in Main Repo

```bash
# Make changes in main repo
git add .
git commit -m "your message"
git push
# ✅ This works normally
```

### Scenario 2: Changes in Submodule (packages/ui)

```bash
# 1. Make changes in packages/ui
cd packages/ui
# ... make your changes ...

# 2. Commit and push in submodule
git add .
git commit -m "feat: add new component"
git push origin main

# 3. Go back to main repo
cd ../..

# 4. Update submodule reference in main repo
git add packages/ui
git commit -m "chore: update UI submodule"
git push
```

### Scenario 3: Changes in Both

```bash
# Option A: Manual (recommended for learning)
# 1. Push submodule first
cd packages/ui
git add .
git commit -m "feat: your changes"
git push origin main
cd ../..

# 2. Then push main repo
git add .
git add packages/ui  # Update submodule reference
git commit -m "chore: update submodule and main changes"
git push

# Option B: Use helper script
./scripts/push-with-submodule.sh "your commit message"
```

## Helper Script

Use the provided script to automate the workflow:

```bash
./scripts/push-with-submodule.sh "your commit message"
```

This script will:
1. Check for uncommitted changes in submodule
2. Commit and push submodule if needed
3. Update submodule reference in main repo
4. Push main repo

## Common Issues

### Submodule Shows as Modified

If `git status` shows `packages/ui` as modified but you haven't changed anything:

```bash
# This usually means the submodule is on a different commit
cd packages/ui
git status
# If you see "Your branch is ahead of 'origin/main'", push it:
git push origin main
cd ../..
git add packages/ui
git commit -m "chore: update submodule reference"
```

### Submodule is Empty After Clone

```bash
git submodule update --init --recursive
```

### Want to Update Submodule to Latest

```bash
cd packages/ui
git pull origin main
cd ../..
git add packages/ui
git commit -m "chore: update submodule to latest"
git push
```

## Best Practices

1. **Always push submodule first** before pushing main repo
2. **Use descriptive commit messages** for submodule changes
3. **Update main repo reference** after submodule push
4. **Use the helper script** for convenience
5. **Check submodule status** with `git submodule status`

## Quick Reference

```bash
# Check submodule status
git submodule status

# Update submodule to latest
git submodule update --remote packages/ui

# Push submodule
cd packages/ui && git push origin main && cd ../..

# Update main repo reference
git add packages/ui && git commit -m "chore: update submodule" && git push
```
