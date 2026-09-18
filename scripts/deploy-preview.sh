#!/usr/bin/env bash
# Publica la vista previa en GitHub Pages (rama gh-pages).
#   ./scripts/deploy-preview.sh
set -euo pipefail

REPO="${REPO:-semimex-preview}"
USER="$(gh api user --jq .login)"
URL="https://${USER,,}.github.io/${REPO}"

echo "▸ Construyendo vista previa para ${URL}"
SITE_URL="$URL" NOINDEX=1 PREVIEW=1 node build.mjs
node scripts/basepath.mjs "/${REPO}"
node scripts/check.mjs >/dev/null || true

echo "▸ Publicando en la rama gh-pages"
touch dist/.nojekyll                 # GitHub Pages ignora carpetas con _ si falta esto
git add -f dist
TREE=$(git write-tree --prefix=dist/)
# Importante: el commit debe tener un padre que el remoto ya conozca. Si es huérfano,
# git no sabe que las imágenes ya están allá y vuelve a subir los 124 MB completos.
PARENT=$(git rev-parse -q --verify refs/heads/gh-pages || git rev-parse -q --verify HEAD || true)
if [ -n "$PARENT" ]; then
  COMMIT=$(git commit-tree "$TREE" -p "$PARENT" -m "Vista previa $(date +%F' '%H:%M)")
else
  COMMIT=$(git commit-tree "$TREE" -m "Vista previa $(date +%F' '%H:%M)")
fi
git update-ref refs/heads/gh-pages "$COMMIT"
git reset -q dist
git push -q origin gh-pages --force

echo "✓ Listo: ${URL}/"
