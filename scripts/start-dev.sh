#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ReportAPI — Dev startup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check Node version (require 18+)
NODE_MAJOR=$(node -e "process.stdout.write(process.version.split('.')[0].replace('v',''))")
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "ERROR: Node 18+ required. Found: $(node -v)"
  exit 1
fi
echo "✓ Node $(node -v)"

# 2. Check .env.local exists
if [ ! -f ".env.local" ]; then
  echo "WARNING: .env.local not found. Copying from .env.local.example"
  cp .env.local.example .env.local
  echo "  → Edit .env.local and set NEXT_PUBLIC_API_URL before testing the demo widget"
else
  echo "✓ .env.local found"
fi

# 3. Install dependencies if node_modules is absent
if [ ! -d "node_modules" ]; then
  echo "→ Installing dependencies..."
  npm install
else
  echo "✓ node_modules present"
fi

# 4. Run tests before starting
echo ""
echo "→ Running test suite..."
npm run test:ci
echo "✓ All tests passed"

# 5. Start dev server
echo ""
echo "→ Starting Next.js dev server..."
echo ""
echo "  Local:   http://localhost:3000"
echo "  Manual test checklist printed below"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MANUAL TEST CHECKLIST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  NAVBAR"
echo "  [ ] Logo and dot visible top-left"
echo "  [ ] Features / Pricing / Docs links visible (desktop)"
echo "  [ ] 'Get API key' button top-right"
echo "  [ ] Resize to mobile: nav links hidden, logo + CTA remain"
echo ""
echo "  HERO"
echo "  [ ] Badge: 'Now in public beta'"
echo "  [ ] H1 renders with 'executive reports' in accent colour"
echo "  [ ] Two CTAs side by side: 'Start for free' and 'View docs'"
echo "  [ ] Social proof line with avatar circles visible"
echo "  [ ] Code block shows REQUEST + RESPONSE panels"
echo ""
echo "  FEATURES"
echo "  [ ] Three-step flow visible (Send / Template / Receive)"
echo "  [ ] Six feature cards in 2x3 grid (desktop)"
echo "  [ ] Cards stack to 1 column on mobile"
echo ""
echo "  PRICING"
echo "  [ ] Three cards: Starter / Growth / Enterprise"
echo "  [ ] Growth card has accent border and 'Most popular' badge"
echo "  [ ] Monthly prices: 149 / 499 / 1500"
echo "  [ ] Click 'Annual': prices change to 119 / 399 / 1200"
echo "  [ ] Click 'Monthly': prices revert"
echo ""
echo "  DEMO WIDGET"
echo "  [ ] Textarea accepts input"
echo "  [ ] 'Generate report' button present"
echo "  [ ] Output area hidden before clicking"
echo "  [ ] Paste JSON, click Generate, output appears (needs API key)"
echo "  [ ] Button shows 'Generating...' and is disabled during call"
echo ""
echo "  FOOTER"
echo "  [ ] Four columns: Brand / Product / Company / Legal"
echo "  [ ] Copyright line visible"
echo "  [ ] DPDP Compliance link present"
echo ""
echo "  CROSS-CUTTING"
echo "  [ ] Page background is dark (#0A0A0F)"
echo "  [ ] Smooth scroll when clicking nav anchor links"
echo "  [ ] Section fade-in visible on scroll (each section animates in)"
echo "  [ ] No console errors in browser DevTools"
echo "  [ ] No layout overflow on 375px viewport (iPhone SE)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev
