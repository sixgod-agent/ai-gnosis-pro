#!/bin/bash
set -e
cd /home/xy/ai-gnosis-pro
python3 scripts/fetch-history.py
git add public/history.json
if ! git diff --cached --quiet; then
    git -c user.name='cron-bot' -c user.email='cron@local' \
        commit -m "chore: auto-update lottery history $(date +%Y-%m-%d)"
    git push origin main
fi
