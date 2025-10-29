#!/bin/bash

# This script pulls the latest schema from your Supabase database
# and generates TypeScript schema files

echo "🔍 Pulling schema from Supabase database..."
echo ""

# Use drizzle-kit pull to generate schema from database
pnpm drizzle-kit pull

echo ""
echo "✅ Schema pull complete!"
echo ""
echo "📋 The schema has been generated in lib/db/migrations/"
echo ""
echo "⚠️  To update your working schema:"
echo "  1. Review the generated files in lib/db/migrations/"
echo "  2. Copy new table definitions to the appropriate file in lib/db/schema/"
echo "     - User/team tables → lib/db/schema/users.ts"
echo "     - Equipment tables → lib/db/schema/equipment.ts"
echo "     - New category? Create a new file in lib/db/schema/"
echo "  3. Update lib/db/schema/index.ts to export from your new schema file"
echo "  4. Add query functions to lib/db/queries/ (organized by domain)"
echo ""
echo "💡 Tip: For code-first development, define tables in schema/ and run:"
echo "   pnpm drizzle-kit push"
echo ""
