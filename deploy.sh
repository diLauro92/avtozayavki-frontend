#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo "Есть незакоммиченные изменения. Деплой остановлен."
  git status --short --untracked-files=no
  exit 1
fi

echo "→ Обновляю код"
LOCK_BEFORE=$(git rev-parse HEAD:package-lock.json)
git pull --ff-only
LOCK_AFTER=$(git rev-parse HEAD:package-lock.json)

if [[ "$LOCK_BEFORE" != "$LOCK_AFTER" ]]; then
  echo "→ package-lock.json изменился, ставлю зависимости"
  npm ci
fi

echo "→ Сборка"
npm run build

echo "✓ Готово: $(git log --oneline -1)"