#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BUILD_DIR="$ROOT/build"
BUILD_CMS_DIR="$ROOT/build-cms"
RELEASE_DIR="$ROOT/release"
NAME="kubatorix-site"

# Общие исключения (dev, git, тесты)
COMMON_EXCLUDES=(
  --exclude 'node_modules'
  --exclude '.git'
  --exclude 'build'
  --exclude 'build-cms'
  --exclude 'release'
  --exclude 'test-results'
  --exclude 'playwright-report'
  --exclude 'screenshots'
  --exclude '.claude'
  --exclude '.vscode'
  --exclude 'секции'
  --exclude '*.zip'
  --exclude '*.tar.gz'
  --exclude '.DS_Store'
)

# Только для CMS: без npm/playwright и dev-скриптов
CMS_EXCLUDES=(
  "${COMMON_EXCLUDES[@]}"
  --exclude 'package.json'
  --exclude 'package-lock.json'
  --exclude 'yarn.lock'
  --exclude 'playwright.config.js'
  --exclude 'check_story.mjs'
  --exclude 'scripts/'
  --exclude 'README.md'
  --exclude '.gitignore'
  --exclude 'js/main-backup.js'
)

echo "→ Сборка build/ (для разработки, с package.json) …"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
rsync -a "${COMMON_EXCLUDES[@]}" ./ "$BUILD_DIR/"

echo "→ Сборка build-cms/ (готово для CMS, только статика) …"
rm -rf "$BUILD_CMS_DIR"
mkdir -p "$BUILD_CMS_DIR"
rsync -a "${CMS_EXCLUDES[@]}" ./ "$BUILD_CMS_DIR/"

mkdir -p "$RELEASE_DIR"

echo "→ Архив build/ без node_modules …"
(
  cd "$BUILD_DIR"
  zip -rq "$RELEASE_DIR/${NAME}-no-node_modules.zip" .
)

echo "→ Архив build-cms/ (для CMS) …"
(
  cd "$BUILD_CMS_DIR"
  zip -rq "$RELEASE_DIR/${NAME}-cms.zip" .
)

echo "→ Архив с node_modules …"
zip -rq "$RELEASE_DIR/${NAME}-with-node_modules.zip" . \
  -x '.git/*' \
  -x 'build/*' \
  -x 'build-cms/*' \
  -x 'release/*' \
  -x 'test-results/*' \
  -x 'playwright-report/*' \
  -x 'screenshots/*' \
  -x '.claude/*' \
  -x '.vscode/*' \
  -x 'секции/*' \
  -x '*.zip' \
  -x '*.tar.gz' \
  -x '.DS_Store'

echo ""
echo "Готово:"
echo "  Dev-билд:  $BUILD_DIR/          (npm run serve:root из корня или файлы как есть)"
echo "  CMS-билд:  $BUILD_CMS_DIR/      (npm run serve:cms)"
echo "  ZIP dev:   $RELEASE_DIR/${NAME}-no-node_modules.zip"
echo "  ZIP CMS:   $RELEASE_DIR/${NAME}-cms.zip"
echo "  ZIP full:  $RELEASE_DIR/${NAME}-with-node_modules.zip"
du -sh "$BUILD_DIR" "$BUILD_CMS_DIR" "$RELEASE_DIR"/*.zip
