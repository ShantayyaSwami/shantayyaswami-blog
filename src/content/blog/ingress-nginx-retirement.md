---
title: "RIP ingress-nginx: A Practical Migration Guide for the Other 44%"
date: 2026-05-22
tags: ["Kubernetes", "ingress-nginx", "GatewayAPI", "DevOps", "SRE", "CNCF", "Traefik", "HAProxy", "EnvoyGateway", "CloudNative", "Migration", "K8s"]
excerpt: "CNCF broke the news. This post answers the question everyone's actually asking: what do I do now?"
readTime: "9 min read"
featured: true
author: "Shantayya Swami"
image: "/images/ingress-nginx-retirement-hero.png"
---

> **This Is Not a Drill:** As of March 2026, ingress-nginx is officially retired. The repository is archived and read-only. No more releases, no bug fixes, no security patches — ever. A post-retirement survey found **44% of users had no migration plan**. If you're reading this, now is the time to act.

| | |
|:--|:--|
| **CVE-2025-1974 CVSS Score** | 9.8 (Critical) |
| **Clusters Exposed at Disclosure** | 6,500+ |
| **K8s Clusters Using ingress-nginx** | ~50% |
| **Users With No Migration Plan** | 44% |

---

## 01 / Don't Panic — But Do Understand What's Happening

When the CNCF announcement dropped, confusion rippled across the community. Engineers panicked. Slack channels flooded with questions. Some thought NGINX itself was dying. Others assumed the Kubernetes Ingress API was deprecated. Neither is true.

Let's be precise about what is and isn't happening.

**What Is Retiring: ingress-nginx (the K8s controller)**

The project at `kubernetes/ingress-nginx` — the default, community-maintained Kubernetes ingress controller based on NGINX — is retired. It was maintained by 1–2 volunteers in their spare time, nights and weekends. That model was never sustainable for infrastructure sitting at the edge of thousands of production clusters.

**What Is NOT Retiring: NGINX itself**

NGINX the web server and reverse proxy is alive, well, and thriving. NGINX Inc. actively maintains **NGINX Ingress Controller** (`nginxinc/kubernetes-ingress`) and the newer **NGINX Gateway Fabric** — both are production-ready, actively supported alternatives. NGINX is not going anywhere.

**What About the Ingress API?**

The Kubernetes `Ingress` resource (`networking.k8s.io/v1`) is NOT deprecated. It still works. However, the broader Kubernetes community is clearly signalling a move toward the **Gateway API** as the long-term successor. The Ingress API handles basic HTTP routing; Gateway API handles TCP, UDP, gRPC, multi-tenancy, and more.

---

## 02 / Why Did This Happen?

This wasn't a sudden decision. It was years in the making, driven by three overlapping forces.

**Early Days — Born of necessity**  
ingress-nginx was created when the Ingress API was the only option in Kubernetes. Its flexibility and cloud-agnostic nature made it wildly popular — powering billions of requests globally.

**2022–2024 — Maintainer burnout**  
The project slowly shrank to 1–2 volunteer maintainers working after hours. Efforts to recruit new contributors failed repeatedly. Critical infrastructure held together by heroic individuals — a ticking time bomb.

**March 2025 — IngressNightmare · CVE-2025-1974 (CVSS 9.8)**  
A critical RCE vulnerability disclosed — unauthenticated attackers with network access to the admission webhook could take full control of a Kubernetes cluster with zero credentials. Wiz Research found 6,500+ clusters exposed publicly. This was the final straw.

**November 2025 — KubeCon Announcement**  
Kubernetes SIG Network and the Security Response Committee officially announced retirement at KubeCon NA 2025. Community reaction: shock, confusion, and — for 44% — inaction.

**March 2026 — Final release. Repository archived.**  
Last release on March 13, 2026 supporting K8s 1.35 and patching the final known CVE. After this — nothing. The repo is now read-only. Running it in production is a risk that grows every single day.

> *"The flexibility that made ingress-nginx a boon has become a burden that cannot be resolved. Continuing to maintain it, even with additional resources, is no longer reasonable."*  
> — Kubernetes Steering Committee, January 2026

---

## 03 / What "Retired" Actually Means for Your Cluster

If you're still running ingress-nginx today, here's the honest picture:

```
# What you're running today
$ kubectl get pods -n ingress-nginx
WARNING: ingress-nginx is RETIRED and UNSUPPORTED

# What this means
⚠  New CVEs discovered      →  NOT patched
⚠  K8s 1.36+ compatibility  →  NOT guaranteed
⚠  Bug reports filed        →  NOT acknowledged
⚠  Feature requests         →  NOT considered

# If on managed K8s (AKS, GKE, EKS)
✓  Some providers extend CVE patches until late 2026
✓  Check your provider SLA — but don't use it to delay

BOTTOM LINE: Running unpatched ingress in production
is a security risk that compounds with every passing day.
```

**The Security Clock Is Ticking**

CVE-2025-1974 got patched. The *next* critical vulnerability won't be. And with ingress-nginx's architecture — particularly its use of arbitrary "snippet" annotations — the attack surface is significant. The Kubernetes Steering Committee was unusually blunt: **"Choosing to remain with ingress-nginx after retirement leaves you and your users vulnerable to attack."**

---

## 04 / Your Replacement Options — Honest Pros & Cons

None of the alternatives are direct drop-in replacements — CNCF said so explicitly. But each fits a different situation well. Here's the full breakdown.

### ⭐ Kubernetes Gateway API · The Official Successor

**Best for:** New clusters, greenfield deployments, teams investing in long-term K8s architecture.

The official, CNCF-blessed successor to the Ingress API. More expressive, role-oriented, and extensible. Supports TCP, UDP, gRPC natively. Multiple controllers implement it — Envoy Gateway, NGINX Gateway Fabric, HAProxy, Contour, Istio — giving you vendor flexibility without being locked into one implementation.

| ✅ Pros | ❌ Cons |
|:--|:--|
| Official K8s standard — future-proof | Not a drop-in — requires rethinking config |
| Multi-protocol: HTTP, TCP, UDP, gRPC | Still maturing in some edge cases |
| Role-oriented (infra vs app separation) | Steeper learning curve vs Ingress API |
| Multiple controller implementations | Need to pick a separate controller |
| Active CNCF development & community | |

---

### NGINX Gateway Fabric · Smoothest NGINX Path

**Best for:** Teams already comfortable with NGINX who want the smoothest upgrade path.

NGINX Inc.'s answer to ingress-nginx retirement. Fully Gateway API-native, actively maintained, and designed as NGINX's long-term Kubernetes strategy. If your team knows NGINX deeply and doesn't want to change paradigm, this is your smoothest path forward. Remember: NGINX is not retiring — just the community controller is.

| ✅ Pros | ❌ Cons |
|:--|:--|
| Familiar NGINX mental model | Still maturing vs ingress-nginx feature depth |
| Actively maintained by NGINX Inc. | Smaller community than Traefik or HAProxy |
| Gateway API native — future-proof | Annotations don't map 1:1 |
| Smooth conceptual migration from ingress-nginx | |

---

### Traefik v3 · Fastest Migration Path

**Best for:** Small-to-medium clusters, dev-centric platforms, teams that want quick wins and a nice UI.

Traefik offers the most painless annotation-level migration — its NGINX provider supports ~80% of common ingress-nginx annotations without changes. If you need to migrate fast and buy time for a proper Gateway API move later, Traefik is your bridge. Comes with a built-in dashboard and automatic Let's Encrypt out of the box.

| ✅ Pros | ❌ Cons |
|:--|:--|
| NGINX annotation compatibility plugin | Lower raw throughput vs HAProxy |
| Built-in dashboard & Let's Encrypt | Less suited to extreme high-traffic production |
| Easy to operate, great for dev platforms | Some complex NGINX configs don't translate |
| Gateway API support in v3 | |
| Fast to get running | |

---

### HAProxy Ingress · Best Raw Performance

**Best for:** High-traffic production, financial services, latency-sensitive workloads, teams needing bulletproof stability.

HAProxy has decades of production battle-hardening behind it. Zero-downtime config reloads, native HTTP/3, and HAProxy's legendary statistics page give you deep observability. Supports both Ingress and Gateway API. The HAProxy Kubernetes Gateway variant is natively Gateway API-aligned for teams ready to go all-in on the new standard.

| ✅ Pros | ❌ Cons |
|:--|:--|
| Best raw throughput & latency | Steeper learning curve |
| Zero-downtime config reloads | Annotation migration requires more work |
| Exceptional built-in observability | HAProxy config model is a different paradigm |
| HTTP/3 native support | |
| Supports Ingress & Gateway API | |

---

### Envoy Gateway · Modern Traffic Management

**Best for:** Teams adopting Gateway API from scratch, modern microservices needing mTLS, JWT, rate limiting without a full mesh.

Built on Envoy Proxy — the same data plane powering Istio — but without the full service mesh overhead. First-class Gateway API support, mTLS, JWT validation, and rate limiting built-in. A natural on-ramp if you're considering Istio later. Vendor-neutral and CNCF-backed.

| ✅ Pros | ❌ Cons |
|:--|:--|
| Gateway API native from day one | Not for teams avoiding Envoy complexity |
| mTLS, JWT, rate limiting built-in | Higher resource footprint than Traefik |
| Envoy data plane — proven at scale | Smaller community vs NGINX/Traefik |
| Smooth path to service mesh adoption | |

---

### Kong Kubernetes Gateway · Full API Gateway

**Best for:** Teams needing full API gateway features — auth, rate limiting, plugins — not just traffic routing.

Kong goes beyond ingress control into full API gateway territory. If you need JWT/OAuth2, OPA/WASM extensibility, advanced rate limiting, and developer portal capabilities, Kong bundles it all. Heavier to operate than pure ingress controllers, but a powerful upgrade if your use case demands it.

| ✅ Pros | ❌ Cons |
|:--|:--|
| Full API gateway — not just routing | Heavier and more complex to operate |
| JWT, OAuth2, rate limiting out of box | Overkill if you just need traffic routing |
| Rich plugin ecosystem | Enterprise features behind paid tier |
| Gateway API support | |

---

## 05 / Which One Should You Choose? The Decision Matrix

Stop overthinking it. Match your situation to the right tool:

| Your Situation | Complexity | Pick This |
|:--|:--|:--|
| New cluster, greenfield setup | Medium | Gateway API + Envoy Gateway |
| Already using NGINX, want smoothest path | Low–Medium | NGINX Gateway Fabric |
| Need fast migration, small–medium cluster | Low | Traefik v3 |
| High-traffic production, latency-critical | Medium–High | HAProxy Ingress |
| Need full API gateway (auth, plugins, rate limiting) | High | Kong |
| Planning service mesh adoption later | Medium | Envoy Gateway or Contour |
| On AKS / GKE / EKS managed cluster | Low | Cloud-native Gateway API (provider's implementation) |
| On-prem, enterprise, regulated environment | Medium–High | HAProxy or NGINX Gateway Fabric |

---

## 06 / How to Start Your Migration — Right Now

Don't boil the ocean. Here's a pragmatic, phased approach that works for most teams.

**1. Audit your current ingress-nginx usage**  
Run `kubectl get ingress --all-namespaces` and catalogue every ingress resource, annotation, and custom snippet. This is your migration scope.

**2. Check if you're on a managed cluster**  
AKS, GKE, and EKS may have extended CVE coverage until late 2026. Check your provider SLA — it buys planning time, not an excuse to delay.

**3. Choose your replacement based on the decision matrix above**  
When in doubt: Traefik for speed, NGINX Gateway Fabric for familiarity, HAProxy for performance, Gateway API for the long term.

**4. Run both controllers in parallel first**  
Deploy the new controller with a new `ingressClassName`. Migrate low-risk services first. Validate. Then progressively cut over. Never hard-switch all at once in production.

**5. Update your manifests and CI/CD pipelines**  
Replace `kubernetes.io/ingress.class: nginx` annotations with the new controller's class. Update Helm values. Test in staging first.

**6. Decommission ingress-nginx**  
Once all services are migrated and validated, remove ingress-nginx cleanly. Don't leave zombie deployments running.

> **Pro Tip: Use Traefik as a Bridge**  
> If you're not ready to commit to Gateway API yet but need to migrate quickly, Traefik's NGINX annotation compatibility plugin lets you run with minimal config changes today — and migrate to Gateway API at your own pace later. Best of both worlds for teams under time pressure.

---

## 07 / The Real Takeaway

ingress-nginx served the Kubernetes community faithfully for years — powering billions of requests across data centres and home labs worldwide. Its retirement is not a failure. It's the natural evolution of an ecosystem that has grown far beyond what two volunteers could sustainably maintain.

The Kubernetes networking story has matured significantly. Gateway API is richer, more secure, more expressive, and built for the multi-protocol, multi-tenant world that most organisations operate in today. This retirement is the ecosystem doing the responsible thing — forcing a migration that should have happened gradually, but better late than never.

> **If You're in the 44% — Start This Week**  
> You don't need to complete the migration this week. You need to *start* it. Run the audit. Pick your replacement. Deploy it in a test namespace. The longer you wait, the more vulnerabilities go unpatched and the more pressure you'll face when the next critical CVE drops — and it will.

---

> *"ingress-nginx gave Kubernetes its wings. Gateway API will take it further. The engineers who migrate now will own the next decade of K8s networking."*  
> — Shantayya Swami
