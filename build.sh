#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
#  GRID::RUNNER — download.sh
#  Downloads all CDN dependencies into ./assets/
#  After running, open index.html (not grid-runner.html) locally.
#  No server needed — index.html works from file:// for everything
#  except task file loading (which still needs a server for fetch()).
#
#  Usage:
#    chmod +x download.sh && ./download.sh
#    python3 -m http.server 8080
#    open http://localhost:8080/
# ═══════════════════════════════════════════════════════════════════

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
A="$ROOT/assets"
mkdir -p "$A/fonts" "$A/monaco"

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║   GRID::RUNNER  —  dependency downloader  ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# ── Helper ─────────────────────────────────────────────────────────
dl() {
  local url="$1" dest="$2"
  echo "  ↓ $(basename "$dest")"
  curl -fsSL "$url" -o "$dest"
}

# ── 1. Prettier 2.8.8 ──────────────────────────────────────────────
echo "[ Prettier ]"
dl "https://unpkg.com/prettier@2.8.8/standalone.js"   "$A/prettier-standalone.js"
dl "https://unpkg.com/prettier@2.8.8/parser-babel.js" "$A/prettier-parser-babel.js"
echo ""

# ── 2. Monaco Editor 0.44.0 ────────────────────────────────────────
# Monaco ships hundreds of files; npm is the cleanest way to get them.
echo "[ Monaco Editor 0.44.0 ]"
if command -v npm &>/dev/null; then
  TMP="$(mktemp -d)"
  echo "  Installing via npm into temp dir…"
  cd "$TMP"
  npm init -y --silent >/dev/null 2>&1
  npm install --silent monaco-editor@0.44.0 >/dev/null 2>&1
  echo "  Copying min/vs → assets/monaco/"
  cp -r "$TMP/node_modules/monaco-editor/min/vs" "$A/monaco/"
  rm -rf "$TMP"
  echo "  ✓ Monaco editor ready"
elif command -v npx &>/dev/null; then
  echo "  npm not found, trying npx…"
  TMP="$(mktemp -d)"
  cd "$TMP"
  npm init -y --silent >/dev/null 2>&1
  npm install --silent monaco-editor@0.44.0 >/dev/null 2>&1
  cp -r "$TMP/node_modules/monaco-editor/min/vs" "$A/monaco/"
  rm -rf "$TMP"
  echo "  ✓ Monaco editor ready (via npx)"
else
  echo "  ⚠ npm not found — downloading monaco loader only via curl."
  echo "    For full offline support install Node.js and re-run this script."
  mkdir -p "$A/monaco/vs"
  dl "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/loader.js" \
     "$A/monaco/vs/loader.js"
  echo "  ✓ Loader only — workers will still load from CDN fallback"
fi
echo ""

# ── 3. Google Fonts — JetBrains Mono + Orbitron ────────────────────
echo "[ Fonts ]"

# Fetch CSS (Latin subset, display=swap)
JB_URL="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
OR_URL="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"

# Use a real browser UA so Google sends woff2
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 \
(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

echo "  Fetching JetBrains Mono CSS…"
JB_CSS=$(curl -fsSL -A "$UA" "$JB_URL")
echo "  Fetching Orbitron CSS…"
OR_CSS=$(curl -fsSL -A "$UA" "$OR_URL")

# Extract and download all woff2 URLs, rewrite to local paths
download_fonts_from_css() {
  local css="$1" prefix="$2"
  local i=0
  while IFS= read -r url; do
    local fname="${prefix}_${i}.woff2"
    echo "  ↓ $fname"
    curl -fsSL "$url" -o "$A/fonts/$fname"
    css="${css//$url/fonts/$fname}"
    i=$((i+1))
  done < <(echo "$css" | grep -oP 'https://[^)]+\.woff2')
  echo "$css"
}

JB_CSS_LOCAL=$(download_fonts_from_css "$JB_CSS" "jetbrains")
OR_CSS_LOCAL=$(download_fonts_from_css "$OR_CSS" "orbitron")

# Write combined local font CSS
cat > "$A/fonts.css" << FONTCSS
/* JetBrains Mono — local copy */
$JB_CSS_LOCAL

/* Orbitron — local copy */
$OR_CSS_LOCAL
FONTCSS

echo "  ✓ fonts.css written"
echo ""

# ── Summary ────────────────────────────────────────────────────────
echo "[ Done ]"
echo ""
echo "  assets/"
find "$A" -type f | sort | sed "s|$ROOT/||" | awk '{print "  " $0}'
echo ""
echo "═══════════════════════════════════════════════"
echo "  Open with local server (needed for fetch):"
echo ""
echo "    python3 -m http.server 8080"
echo "    open http://localhost:8080/"
echo ""
echo "  Or just double-click index.html for everything"
echo "  that doesn't need fetch() (all UI works offline)"
echo "═══════════════════════════════════════════════"