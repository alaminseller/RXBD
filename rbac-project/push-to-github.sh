#!/bin/bash
# ============================================================
# Push RBAC System Project to GitHub
# ============================================================
# 
# Prerequisites:
# 1. Create a new repository at: https://github.com/new
#    - Name: rbac-system-supabase
#    - Public
#    - Do NOT initialize with README
# 
# 2. Create a Classic PAT at: https://github.com/settings/tokens/new
#    - Select "Generate new token (classic)"
#    - Check "repo" scope (full control of private repositories)
#    - Copy the token
#
# 3. Run this script:
#    chmod +x push-to-github.sh
#    ./push-to-github.sh YOUR_CLASSIC_PAT_TOKEN
# ============================================================

set -e

TOKEN="${1:?Usage: $0 <GITHUB_CLASSIC_PAT>}"
REPO="rbac-system-supabase"
USER="alaminseller"

echo "🔐 Pushing RBAC System to GitHub..."

# Create the repository
echo "📦 Creating repository $REPO..."
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/user/repos" \
  -d "{\"name\":\"$REPO\",\"description\":\"🔐 Production-ready RBAC system for Supabase PostgreSQL with RLS, JWT claims sync, auto role assignment, and audit logging.\",\"public\":true}" | python3 -c "import sys,json; d=json.load(sys.stdin); print('✅ Created:', d.get('html_url','ERROR: '+d.get('message','')))"

# Initialize git and push
cd "$(dirname "$0")"

if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "🔐 Initial commit: Complete RBAC system for Supabase PostgreSQL"
    git branch -M main
fi

git remote remove origin 2>/dev/null || true
git remote add origin "https://$USER:$TOKEN@github.com/$USER/$REPO.git"
git push -u origin main

echo ""
echo "✅ Project pushed successfully!"
echo "🌐 View at: https://github.com/$USER/$REPO"
