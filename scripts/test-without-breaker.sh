#!/bin/bash

echo "Testing WITHOUT Circuit Breaker"
echo "Weather Service: DELAY=2000ms, FAIL_RATE=50%"
echo ""

for i in {1..20}; do
  echo "Request #$i:"
  curl -s "http://localhost:3000/v2/trips/search?from=CMB&to=BKK&date=2025-12-10" > /dev/null
  echo ""
done

echo ""
echo "Baseline test complete - check aggregator logs"

# chmod +x scripts/test-without-breaker.sh
# ./scripts/test-without-breaker.sh