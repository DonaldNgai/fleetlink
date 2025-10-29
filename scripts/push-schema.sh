#!/bin/bash

# This script pushes your local schema changes to the Supabase database
# Use this for code-first development

echo "📤 Pushing schema changes to Supabase..."
echo ""

pnpm drizzle-kit push

echo ""
echo "✅ Schema push complete!"
echo ""
