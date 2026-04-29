#!/bin/bash
# Fetch latest lottery data from liuhebao.net
# Run this during CI build to keep data fresh

set -e

API_URL="https://liuhebao.net/api/getLotteryData.php"
OUTPUT_DIR="$(dirname "$0")/../src/data"
OUTPUT_FILE="$OUTPUT_DIR/lotteryData.json"

mkdir -p "$OUTPUT_DIR"

echo "Fetching lottery data..."
curl -s -L -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  "${API_URL}?_=$(date +%s)000" \
  -o "$OUTPUT_FILE"

if [ ! -s "$OUTPUT_FILE" ]; then
  echo "ERROR: Failed to fetch data"
  exit 1
fi

# Validate JSON
python3 -c "import json; json.load(open('$OUTPUT_FILE'))" 2>/dev/null || {
  echo "ERROR: Invalid JSON received"
  exit 1
}

RECORDS=$(python3 -c "
import json
data = json.load(open('$OUTPUT_FILE'))
hk = [d for d in data['lottery_data'] if d['code'] == 'hk'][0]
print(len(hk['history']))
")

echo "OK: Fetched $RECORDS history records"
echo "Saved to $OUTPUT_FILE"
