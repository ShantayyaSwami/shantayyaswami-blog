---
title: "It Took a Midnight Oncall to Prove AI Isn't Replacing DevOps — Yet"
date: 2026-05-17
tags: ["DevOps", "Kubernetes", "Redis", "IncidentResponse", "SRE", "AI", "RootCauseAnalysis", "Kibana", "Prometheus"]
excerpt: "A Saturday-night oncall. A cascading Redis failure. A bottom-up investigation. And the moment I realised that no amount of LLM magic replaces an engineer who truly understands the system."
readTime: "8 min read"
featured: true
author: "Shantayya Swami"
image: "/images/human_vs_ai_hero.svg"
---

> **TL;DR:** A P2 incident caused by a network-team VM restart cascaded into Kubernetes node restarts → all Redis Cluster pod restarts → batch job failures via `QueryTimeoutException`. The restarted K8s nodes were exclusively hosting the Redis Cluster pods. Root cause required cross-team context, Kibana log correlation, K8s event analysis, and historical knowledge of a concurrent P1. AI assisted — but couldn't have *led* the investigation.

---

## The Incident at a Glance

| Field | Detail |
|:--|:--|
| **Severity** | P2 Incident |
| **Impact Window** | ~8 PM – 10 PM EST |
| **Failed Component** | Redis Cluster (All Pods) |
| **Root Cause** | Network team VM restart |

---

## The System Architecture

Three tiers, each with distinct ownership boundaries — and that ownership question is at the heart of this story.

**Layer 1 — Frontend (Your Control Zone)**  
UI / API (React + REST, K8s Pods) → API Gateway (Auth / Rate Limiting) → **Redis Cluster** (Biller-ID Cache) → PostgreSQL (Primary DB) → Prometheus + Kibana (Observability)

**Layer 2 — SWIFT Backend**  
SWIFT Core (Payment Routing) → **Batch Jobs** → Payment Gateway (External Integration)

**Layer 3 — Network Layer (Not Your Control)**  
DNS · NAT Gateway · Akamai CDN/WAF · F5 BigIP Load Balancer · **K8s Nodes (Redis)** ← *Restarted by Network Team* · K8s Nodes 1–3 (Healthy)

> **Key Architecture Insight:** Redis Cluster sits in Layer 1, but Layer 2 batch jobs cross layers to hit it for biller-ID lookups. The network team's VM restart covered all nodes running Redis Cluster pods — bringing the entire cache down at once.

---

## How the Incident Was Detected

Two complementary systems caught it:

- **Prometheus** — Metrics alerts fired on pod restarts, OOM, CPU/memory spikes.
- **Kibana + PagerDuty** — Log-based error pattern matching triggered the SRE oncall.

Here's what the error looked like in Kibana (sanitised):

```
[2024-xx-xx 20:03:14 EST] ERROR [batch-job-worker-1]    QueryTimeoutException: Redis connection timed out
[2024-xx-xx 20:03:14 EST] ERROR [batch-job-worker-1]    host: redis.frontend-layer.svc.cluster.local  port: 6379
[2024-xx-xx 20:08:45 EST] ERROR [payment-api-service]   QueryTimeoutException: Redis connection timed out

✓ ✓ ✓  errors cease after ~22:00 EST  ✓ ✓ ✓
```

---

## My Troubleshooting Approach — Bottom-Up

Developers had spotted the `QueryTimeoutException` but couldn't go deeper — K8s internals and network layers were outside their domain. That's where I stepped in.

> **Why Bottom-Up?** I don't own NAT, Akamai, or F5 BigIP — those need the network team. So I started from what I *could* fully own: Kubernetes. Find the root where you have control, escalate upward only if needed.

### Investigation Timeline

**Step 1 — Kibana: Backend & Frontend Logs**  
Errors started ~8 PM, stopped by 10 PM EST. Cross-checking the frontend workspace confirmed *all* Redis-connected services were throwing the same timeout — ruling out a batch-job bug and pointing squarely at Redis.

**Step 2 — Headlamp: Redis Cluster Health**  
Service showed healthy. No deployment changes. But pod restarts across all cluster pods were timestamped exactly at 8 PM. Something took every pod down simultaneously.

**Step 3 — `kubectl describe pod`: Dead End**  
Restart reason: `Unknown` on every pod. No OOM. No probe failures. Prometheus metrics clean. The simultaneous unknown restarts across all cluster pods were the tell — this wasn't an app issue.

**Step 4 — Human Context: Manual Restart?**  
Asked the SRE: "Did your team restart the Redis pods around 8 PM?" — no info; the colleague who handled last night's P1 was asleep at 4 AM in the US. Hit a wall. Time to pivot.

**Step 5 — The JIRA Ticket: Root Cause Found**  
The SRE recalled a concurrent P1 around the same time involving network VM restarts. We pulled the JIRA ticket — the VM list included the K8s nodes where all Redis Cluster pods were running. Node names matched exactly. **Root cause confirmed.**

---

## Root Cause — Cascade Chain

```
Network Team P1
    ↓
VM Restart (Redis-only K8s Nodes)
    ↓
All K8s Nodes (Redis) Restarted
    ↓
All Redis Cluster Pods Evicted
    ↓
QueryTimeoutException
    ↓
Batch Job Failures
```

The Redis Cluster pods were spread across multiple nodes — but the VM restart list happened to include every one of them, taking the entire cache offline at once.

---

## Request Flows — Normal vs Incident

**Normal Flow:**  
Client → DNS/NAT → Akamai → F5 BigIP → Ingress/API GW → Service (K8s) → SWIFT Backend → Payment GW ✅

**Incident Flow (Batch Job Path):**  
Client → DNS/NAT → Akamai → F5 BigIP → SWIFT Batch Job → **Redis Cluster ⚠️ (All Pods Down — Node Restart)** 🔥 Timeout

---

## Where AI Helped — and Where It Couldn't

I use Copilot and LLMs regularly. But this triage made the limits crystal clear.

**What the Human Engineer Did:**
- Held full system context from memory
- Connected P1 and P2 across teams
- Matched node names from `kubectl describe` to the network ticket
- Asked the right person the right question
- Chose bottom-up approach based on ownership boundaries

**What AI Could Assist With:**
- Summarising Kibana log output
- Suggesting `kubectl` commands quickly
- Drafting the incident report
- Pattern matching within a log snippet

> **The Partial Input Problem:** AI works on what you feed it. During live triage, information arrives in fragments. At the start I didn't know about the P1, the VM restarts, or which nodes Redis was on. An AI fed partial context mid-investigation would have given confidently wrong answers. The engineer's job is to *gather and connect* that context first.

> *"It is not AI that will replace DevOps engineers. It is the DevOps engineer who uses AI effectively who will replace the one who doesn't."*  
> — Shantayya Swami

---

## Key Takeaways

**1. Dual Alerting Pays Off**  
Prometheus for metrics. Kibana + PagerDuty for logs. Neither alone gives the full picture.

**2. Choose Your Troubleshooting Direction Deliberately**  
Start where you have ownership and visibility. Bottom-up here because K8s was mine — the network layer wasn't.

**3. Infrastructure Changes Need Blast Radius Mapping**  
Map VMs to running workloads before any restart. A checklist here would have prevented this cascade entirely.

**4. Cross-Team Context Is Gold**  
The breakthrough came from a JIRA ticket for a completely separate P1. No tool surfaces that — only a human asking the right question does.

**5. AI Is a Force Multiplier, Not a Replacement**  
Use it to move faster once you understand the problem. Don't expect it to understand the problem for you.

---

> *"Whatever progress AI makes — agentic AI, LLMs, autonomous agents — the engineer who truly understands their system will always be the one who knows which question to ask, which ticket to pull, and which node name to remember."*  
> — Shantayya Swami
