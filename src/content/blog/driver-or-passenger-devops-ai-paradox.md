---
title: "Driver or Passenger? The DevOps Engineer's AI Paradox"
date: 2026-05-27
tags: ["AI", "DevOps", "Career", "SRE", "Engineering", "Terraform", "Kubernetes"]
excerpt: "The engineers using AI the most aren't always getting better — the ones using it passively are getting duller. Here's the honest self-audit every DevOps engineer should run."
readTime: "9 min read"
featured: true
author: "Shantayya Swami"
image: "/images/driver-or-passenger-devops-ai-paradox.png"
---

There's a quiet paradox running through our industry right now:

> *The better you are at using AI in your daily work, the worse you might look in an interview room that takes it away.*

When I first heard this, my instinct was to nod along. We've all seen it — the engineer who ships a Terraform module in 20 minutes with Copilot but freezes when asked to write a `for` loop on a whiteboard. The architect who designs slick Kubernetes setups with Claude but can't explain why they chose a StatefulSet over a Deployment.

But the more I sat with it, the more I think the framing is wrong. The problem isn't *using AI heavily*. The problem is **using AI passively**.

Here's the reframe I want to argue for:

> **The danger isn't using AI heavily — it's using it passively. If you treat it as a thinking partner and stay in the driver's seat, you get sharper. If you treat it as a replacement for thinking, you get duller. The interview just exposes which one you've been doing.**

Let me show you what this looks like in real DevOps work.

---

## Meet two engineers

Both have six years of experience. Both use AI heavily — probably 60–70% of their daily output flows through some AI tool. From the outside, they look identical. Same shipping velocity. Same clean-looking PRs.

But put them in a room without AI, and one of them is still dangerous. The other is lost.

Let's see why.

---

## Scenario 1: The Terraform module

**The task**: Create an S3 bucket for storing application logs.

**The passive engineer** opens their AI assistant, types *"create an S3 bucket for logs"*, accepts the suggestion, opens a PR.

```hcl
resource "aws_s3_bucket" "logs" {
  bucket = "my-app-logs"
}

resource "aws_s3_bucket_versioning" "logs" {
  bucket = aws_s3_bucket.logs.id
  versioning_configuration {
    status = "Enabled"
  }
}
```

Ships. CI passes. Merged. Done in four minutes.

**The active engineer** uses the same tool, in the same time, but their PR looks different:

```hcl
resource "aws_s3_bucket" "logs" {
  bucket = "${var.env}-${var.service}-logs"
}

resource "aws_s3_bucket_public_access_block" "logs" {
  bucket                  = aws_s3_bucket.logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id
  rule {
    id     = "expire-old-logs"
    status = "Enabled"
    expiration { days = 90 }
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
  }
}
```

Same AI. Same time. Very different output.

What did the active engineer do differently? They prompted with **context the model couldn't know**: *"logs are sensitive, retention is 90 days, we follow CIS benchmarks, here's our naming convention."* They reviewed the output against a mental checklist they've built over years — public access, encryption, lifecycle, tagging, naming. The AI did the typing. The engineer did the thinking.

> 💡 **Quick check**: When you ask AI for a Terraform module, do you provide more than one line of input? If your prompts are usually one-liners, you're probably riding shotgun.

---

## Scenario 2: The 2 AM incident

It's 2:14 AM. PagerDuty fires. Production API is returning 503s. The OpenAI status page also happens to be red — your AI tools are flaky tonight.

**The passive engineer** opens their assistant, gets timeouts, tries another one, also slow. They paste the error message into a browser, follow a Stack Overflow answer from 2019 that says "restart the pod," and start `kubectl delete pod`-ing things. The incident gets worse before it gets better.

**The active engineer** does what they've always done:

```bash
kubectl get pods -n prod | grep -v Running
kubectl describe pod failing-pod-xyz
kubectl logs failing-pod-xyz --previous
kubectl top nodes
kubectl rollout history deployment/api -n prod
```

They notice memory pressure on two nodes. They check the most recent deploy. They spot one from 90 minutes earlier that bumped the memory request from `256Mi` to `2Gi` without expanding node capacity — silent eviction storm. They roll back. Resolved in 12 minutes.

The active engineer used AI just as heavily as the passive one during the day. But the *patterns* of investigation — the muscle memory of "describe → logs → events → recent changes" — stayed sharp because they always asked the AI **"explain why"** instead of just **"give me the command."**

> 💭 **Reflection prompt**: When was the last time you debugged a real issue with your AI tools intentionally switched off? Not because they were down — because you wanted to know if you still could.

---

## Scenario 3: The architecture interview

The interviewer says: *"Walk me through how you'd design a multi-region, active-active deployment of our payment service. Use the whiteboard."*

**The passive engineer** has built three of these in their last job. With AI help, the designs were excellent. But asked to whiteboard it cold, they remember *what* they built, not *why*. They draw boxes — "load balancer here, DB there" — but stumble on the hard questions:

- How do you handle write conflicts in the database?
- Why active-active over active-passive?
- What's your RPO target, and how does it shape your replication strategy?
- How do failover and DNS interact?

**The active engineer** has built one. They worked closely with AI through the whole design. But every time the AI suggested something, they asked: *"What's the tradeoff?" "What breaks if we don't do this?" "What's a simpler version that still meets the SLA?"*

In the interview, they draw the same boxes — but when the interviewer drills in, they have answers. Not memorized answers. *Earned* ones, because they treated each AI interaction as a chance to understand, not just to ship.

The whiteboard didn't expose a lack of skill. It exposed a lack of intentionality.

---

## How to stay in the driver's seat

This is not an anti-AI piece. I'd be the last person to tell you to turn off Copilot or Claude. The productivity gains are real, and the engineers ignoring AI in 2026 are going to be left behind. But there's a difference between *leveraging* AI and *depending* on it.

Here's a self-audit I run on myself. Try it honestly:

- [ ] Can I explain **why** the code my AI gave me works, not just **what** it does?
- [ ] When AI suggests a resource, command, or pattern, do I know what it's replacing or what alternatives exist?
- [ ] Have I pushed back on AI output and been right? (You should — it's wrong constantly, especially on cloud IAM, networking, and anything new enough to be post-cutoff.)
- [ ] When I prompt, do I provide context, constraints, and goals — or just verbs?
- [ ] In the last 30 days, have I solved at least one real problem end-to-end without AI, just to keep the muscle alive?
- [ ] Can I read a Kubernetes manifest, Terraform plan, or CI pipeline that *someone else* wrote — without piping it to AI for a summary first?
- [ ] When AI gives me a bash command with `sudo`, `rm`, `chmod -R`, or `| sh`, do I read it before running it?

If you're checking most of these, you're driving. You can use AI as heavily as you want — you're getting sharper, not duller.

If you're checking few of them, no judgment. But recognize the trajectory.

---

## The honest interview answer

So when an interviewer asks *"How do you use AI in your work?"* — what should you say?

**The bad answer is hiding it**: *"Oh, I prefer to write things myself."* Nobody believes you, and even if they did, they're not sure they want someone who refuses leverage.

**The bad answer is also bragging about volume**: *"I use AI for 90% of my code."* That tells them you might be a typist with good prompts.

**The good answer is specific**:

> *"I use AI heavily for boilerplate, exploring unfamiliar APIs, drafting Terraform, and rubber-ducking architecture decisions. I review every line, and I push back when it's wrong — which is often, especially on IAM and networking. The things I don't outsource to it are: tradeoff judgments, production incident response, and any design decision that touches security or cost. I think of it as a very fast, very confident junior engineer who needs supervision."*

That answer tells the interviewer you're in the driver's seat. The whiteboard test then becomes a chance to *prove it*, not a trap that exposes you.

---

## Closing Thoughts

AI is not the threat. **Passive engineering is the threat**, and AI just makes it cheaper than ever to be passive.

The engineers who will own the next decade aren't the ones using AI the most. They're the ones using it most *intentionally* — as a collaborator who needs supervision, not a replacement that needs trust.

Stay in the driver's seat. Your future self — the one being interviewed, the one paged at 2 AM, the one being asked to defend an architecture choice in a room full of skeptics — will thank you.

---

*If this resonated, share it with one engineer on your team and ask them: where are we driving, and where are we just along for the ride?*

---

> *"Use AI as heavily as you want — but stay in the driver's seat. Passive use makes you duller; intentional use makes you sharper. The 2 AM incident and the whiteboard interview will reveal which one you've been doing."*
