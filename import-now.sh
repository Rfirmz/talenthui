#!/bin/bash

echo "🚀 Starting TalentHui Data Import..."
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials first."
    exit 1
fi

# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

echo "✅ Environment variables loaded"
echo "📊 Importing candidates from CSV..."
echo ""

node scripts/import-candidates.js "/Users/rafaelfirme/Downloads/Talent Hui Database - Consolidated (Mat).csv" 1000

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Import completed successfully!"
    echo ""
    echo "🎉 Next steps:"
    echo "1. Start your dev server: npm run dev"
    echo "2. Visit: http://localhost:3000/profiles"
    echo "3. You should see real candidates now!"
    echo ""
else
    echo ""
    echo "❌ Import failed. Please check the error messages above."
    exit 1
fi

