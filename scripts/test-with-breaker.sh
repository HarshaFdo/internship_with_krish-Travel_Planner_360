#!/bin/bash

echo "Testing WITH Circuit Breaker"
echo "Weather Service: DELAY=2000ms, FAIL_RATE=50%"
echo ""

for i in {1..20}; do
  echo "Request #$i:"
  START=$(date +%s%3N)
  
  RESPONSE=$(curl -s "http://localhost:3000/v2/trips/search?from=CMB&to=BKK&date=2025-12-10" \
    -w "\nHTTP_CODE:%{http_code}\nTIME:%{time_total}")
  
  HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d':' -f2)
  TIME=$(echo "$RESPONSE" | grep "TIME" | cut -d':' -f2)
  
  HAS_WEATHER=$(echo "$RESPONSE" | grep -c "weather")
  
  if [ $HAS_WEATHER -gt 0 ]; then
    echo "  Status: $HTTP_CODE | Time: ${TIME}s | Weather: ok"
  else
    echo "  Status: $HTTP_CODE | Time: ${TIME}s | Weather: degraded"
  fi
  
  sleep 0.5
done

echo ""
echo "Check circuit breaker status:"
curl -s "http://localhost:3000/v2/circuit-breaker" | jq .