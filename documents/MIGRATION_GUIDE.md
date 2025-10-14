# Migration Guide: V1 → V2 API

## Strangler-Fig + Expand/Contract Pattern

This guide explains the gradual migration strategy from V1 to V2.

---

## Pattern Explanation

### Strangler-Fig Pattern
We migrate **one endpoint at a time** instead of all at once:
- Currently: `/search` moves to V2
- Future: `/cheapest-route` moves to V2
- Future: `/contextual` moves to V2

### Expand/Contract Pattern
For each endpoint migration:
1. **Expand**: Add new `weather` field (V2)
2. **Migrate**: Clients switch from V1 → V2
3. **Contract**: Retire V1 after >95% adoption

---

## What are changes in V2?

### Only `/trips/search` Migrated

**V1 Response:**
```json
{
  "flights": [...],
  "hotels": [...],
  "metadata": {...}
}