# V2 Rollout Plan

## Objective
Gradually migrate clients from V1 to V2 API using CANARY pattern. The plan prioritizes stability, user experience, and data- driven ddecision making at each phase

---

## Rollout Strategy: Canary Deployement

### What Canary Deployemet Does?

It gradually shofys traffic from v1 to v2:
- Start with a small percentage of users (5%)
- Monitor for errors and performance
- Gradually increase percentage
- Rollback instantly if issues detected

### Why I use Canary?
- Can Catch issues before affecting all users
- Instant rollback capability
- Testing with live traffic
- Low risk, data-driven decisions

---

## Timeline & Milestones

### Phase 1: Internal Testing (Week 1)
**Traffic Split:** 0% V2 (internal only)

**Actions:**
- Deploy V2 to staging environment
- Internal team tests all endpoints
- Load testing with 1000 concurrent users
- Circuit breaker testing with failure scenarios
- Document any issues

**Success Criteria:**
- Circuit breaker opens after 50% failures over 20 requests
- Circuit breaker enters HALF_OPEN after 30s cooldown
- Circuit breaker closes after 5 successful probes
- Fallback response returned when circuit is OPEN
- Flights + Hotels always returned (degraded weather only)

**Rollback Trigger:**
- Circuit breaker doesn't open when needed
- Circuit breaker stuck in OPEN state
- Fights/Hotels not returned with degrade weather

---

### Phase 2: Canary - 5% Traffic (Week 2)
**Traffic Split:** 5% V2 / 95% V1

**Users:** ~100 real users from beta program

**Deployment:**
- 95% traffic -> v1(/v1/trips/search)
- 5% traffic -> v2(/v2/trips/search)

**Expected Perfomance**
| Scenario   | Latency     | Status      |
|------------|-------------|-------------|
| Error Rate | 2100ms      | Acceptable  |
| P95 Latency| 75ms        |Fast-fallback| 
|Success Rate| 2000ms      | Recovery phase| 

**Monitoring:**
- Error rate V2 vs V1
- Response time comparison
- Weather data quality
- Circuit breaker state transitions
- User feedback

**Metrics to Track:**
| Metric     | V1 Baseline | V2 Target | Alert Threshold |
|------------|-------------|-----------|-----------------|
|Failure Rate| 0.5%        | ≤ 0.5%    | > 1%            |
| Flight availabel| 100%   |100%       | <99%            |
| Hotels availabel| 100%   |100%       | <99%            |
| Weather availabel| 100%  |40%(normal), ~60%(degraded)| Monitor|
|circuit state| N/A        | Mostly CLOSED| OPEN > 5min  |

**Actions if Issues Found:**
- If error rate > 1% → Rollback immediately
- If latency > 300ms → Investigate, don't proceed
- If weather data incorrect → Fix and redeploy
- If circuit breaker broken → Fix and redeploy

**Success Criteria:**
- Circuit breaker opens after~10-15 requests (50% fail rate detected)
- Circuit breaker closes after 5 successful requests in HALF_OPEN
- Zero critical errors for 3+ days
- Error rate ≤ 0.5%
- Latency within target
- Positive user feedback (if surveyed)

---

### Phase 3: Early Adoption - 25% Traffic (Week 3-4)
**Traffic Split:** 25% V2 / 75% V1

**Users:** ~500 real users

**Deployment:**
- 75% traffic -> V1
- 25% traffic -> V2

**Monitoring Under Load:**
- Peak load testing (25% of peak traffic on V2)
- Database query performance
- Cache hit rates
- Regional performance differences

**Success Criteria**
- All phase 2 criteria still fulfill
- Circuit breaker state transition logged correctly
- No stuck circuits
- User complains <5

--- 

### Phase 4: Mainstram - 50% Traffic (week5)
**Trafic Split:** 50% V2 / 50% V1

**Users:** ~1000 real users

**Metric Comparison at 50/50:**
| Metric     | V1 Baseline | V2 Target | Status |
|------------|-------------|-----------|--------|
| Error Rate | 0.5%        | 0.5%      | Same   |
|  Average Latency| 100ms  | 1087ms    | Higher |
|User Satisfaction| 95%    | 90%       | Monitor|

**Actions:**
- A/B testing: Compare user behavior V1 vs V2
- Perfomance comparison at 50/50 split

**Success Criteria:**
- All phase 3 criteria fulfill
- 50/50 split stable for 24+ hours
- No cascading failures
- User feedback positive on weather feature

---

### Phase 5: 75% Traffic (week 6)
**Trafic Split:** 75% V2 / 25% V1

**Users:**~1500 real users 

**Deployement:**
- 25% traffic -> V1
- 75% traffic -> V2

**Actions:**
- Monitor remaining V1 users for feedback
- Prepare V1 deprecation notice
- Start notifying V1 clients about migration path
- Prepare rollback plan just in case
- Gather feedback on weather data quality

**Success Criteria:**
- All Phase 4 criteria met
- 75% traffic on V2 stable
- No unexpected circuit breaker issues
- Ready for final phase

---

### Phase 6: Pre-Completion - 95% Traffic (Week 7)
**Traffic Split:** 95% V2 / 5% V1

**Users:** ~1,800 real users

**Deployment:**
- 5% traffic -> V1
- 95% traffic -> V2

**Actions:**
- Only 5% on V1 for test/fallback users
- Prepare for V1 retirement announcement
- Final testing of rollback procedures
- Documentation for V1 deprecation
- Circuit breaker behavior verification

**Success Criteria:**
- 95% traffic on V2 stable for 5+ days
- No errors, performance nominal
- Circuit breaker operating normally
- Ready for final phase

---

### Phase 7: Completion - 100% V2 (Week 8)
**Traffic Split:** 100% V2 / 0% V1

**Users:** All users on V2

**Deployment:**
- 0% traffic V1
- 100% traffic V2

**Actions:**
- Remove V1 from load balancer
- Announce V1 deprecation end-of-life
- Archive V1 code
- Get successful migration.

**Success Criteria:**
- 100% traffic on V2
- 0 V1 requests
- All systems are stable
- No rollback needed
- Circuit breaker operating normally

---

### Instant Rollback Procedure and Monitoring & Metrics

### Key Performance Indicators (KPIs)

**If ANY point issues occurred, immediately rollback and Measure the adoption Rate:**
# Immediate rollback to V1
```bash
Load Balancer:
  V2 percentage = 0%
  V1 percentage = 100%

# Time to execute: < 1 minute
# Affected users: Those on V2 get rerouted to V1**
```bash
   GET /metrics
   
   Target: Increasing V2 percentage  continuously.

