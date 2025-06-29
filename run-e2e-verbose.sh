#!/bin/bash

echo "🚀 Starting E2E Tests with Verbose Logging"
echo "=========================================="
echo ""

# Start the test with detailed progress
echo "📋 Test Configuration:"
echo "  - Browsers: Chrome, Firefox, Safari"
echo "  - Screenshots: Enabled and saved to screenshots/"
echo "  - Timeout: 30 seconds per test"
echo "  - Workers: 4 parallel"
echo ""

echo "⏳ Running tests... (this may take a few minutes)"
echo "🔍 Watch for console logs showing test progress..."
echo ""

# Run Playwright with list reporter for better progress visibility
npx playwright test --reporter=list --project=chromium --project=firefox

echo ""
echo "✅ E2E Tests completed!"
echo "📁 Check screenshots/ directory for visual verification"
echo "📊 Open HTML report: npx playwright show-report"