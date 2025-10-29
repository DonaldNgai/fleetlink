#!/bin/bash

# This script generates migration SQL files from schema changes
# Use this to create versioned migrations

echo "📝 Generating migration files..."
echo ""

pnpm drizzle-kit generate

echo ""
echo "✅ Migration files generated!"
echo "📋 Check lib/db/migrations/ for the new migration files"
echo ""
echo "💡 To apply migrations, run:"
echo "   pnpm drizzle-kit migrate"
echo ""
