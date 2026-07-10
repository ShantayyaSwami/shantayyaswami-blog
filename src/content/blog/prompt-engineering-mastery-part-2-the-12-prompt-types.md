---
title: "Prompt Engineering Mastery — Part 2: The 12 Prompt Types and the Copy-Paste Playbook"
date: 2026-07-10
tags: ["AI", "Prompt Engineering", "DevOps", "Productivity"]
excerpt: "There isn't one kind of prompt — there are about a dozen, and picking the right one is most of the skill. The twelve prompt types, when to reach for each, and the exact copy-paste prompts I use for AWS learning, pipeline troubleshooting, and script writing."
readTime: "12 min read"
featured: true
author: "Shantayya Swami"
image: "/images/Prompt Engineering Mastery — Part 2.png"
---

In [Part 1](/blog/prompt-engineering-mastery-part-1-stop-blaming-the-model) I made the case that prompting is a real skill and shared the skeleton I use for any serious prompt. That skeleton is the *how*. This part is the *which* and the *what* — the twelve prompt types, when to reach for each, and then the exact prompts I keep on hand so you can skip the trial and error.

Because here's the thing that took me embarrassingly long to internalise: there isn't one kind of prompt. There are roughly a dozen, each suited to a different situation, and most of the skill is reaching for the right one without thinking about it — the same way you don't consciously decide between `grep` and `awk`, you just know.

Let me walk through them in four natural families, because they group more cleanly than a flat list of twelve. Then, once the types make sense, I'll hand over the playbook — the actual prompts, ready to paste and fill in.

---

## Family 1 — How many examples do you give?

The first three types differ only in how many examples you hand the model before asking for the real thing.

**Zero-shot** is instruction only, no examples. Use it for simple, direct tasks the model already understands. *"Explain Kubernetes HPA in simple language."* No example needed — the model knows what HPA is, you just need it phrased for you. This is your default for quick lookups and explanations.

**One-shot** gives exactly one example to lock the format or style. Use it when zero-shot keeps drifting from the shape you want. *"Here's one of my LinkedIn posts. Write my AWS Mastery post in the same tone and structure."* The single example does more work than three paragraphs describing the tone ever could.

**Few-shot** gives several examples so the model can extract the pattern. Use it when you need consistency across many outputs. *"Here are three image prompts I liked. Create ten more in the same cinematic, mythological style."* The more nuanced or stylistic the task, the more the examples earn their place. This is how you get twenty outputs that feel like they came from the same hand.

The mental model: zero-shot for *known* tasks, one-shot to *fix the shape*, few-shot to *hold a pattern*.

---

## Family 2 — How do you want it to think?

The next three shape the model's reasoning rather than its examples.

**Role / persona** raises the reasoning altitude. *"Act as a principal DevOps architect and review this AI DevOps product architecture."* Assigning expertise gets you expert-level thinking instead of the internet's average take. It's the cheapest quality upgrade there is, and I use it on almost everything that matters.

**Step-by-step** forces the model to work through a problem in order instead of leaping to a conclusion. *"First identify the root cause, then list the evidence, then suggest the fix, then the prevention."* This is gold for troubleshooting, architecture, and anything with logic or math — reasoning-first genuinely reduces errors, because the model isn't guessing an answer and backfilling justification.

**Prompt chaining** splits a large workflow into stages and feeds each stage's output into the next. *"Step 1: create the outline. Step 2: expand it into a script. Step 3: turn each scene into a visual prompt."* Use it whenever a task is too big to survive as one giant prompt — which, for content pipelines and multi-step infra work, is often. Chaining also lets you steer between steps instead of discovering at the end that step one went sideways.

---

## Family 3 — How much do you want to control?

These three are about constraining the output — telling the model what to avoid, what to trust, and what shape to produce.

**Negative prompting** states what you *don't* want. *"No cartoon style, no modern elements, no real celebrity faces."* Essential for AI visuals, and useful anywhere the model keeps including something you don't want. State exclusions up front and you stop editing them out afterward.

**Reference-text prompting** grounds the answer in a source you provide. *"Use only the attached PDF. If the answer isn't in it, say 'not found.'"* This is the single biggest lever against hallucination. When accuracy matters more than fluency — a runbook, a config, a doc you must not misquote — paste the source and pin the model to it.

**Output-format prompting** decides the shape before the model does. *"Give the answer as a table with columns: concept, when to use, example."* Or as YAML, a checklist, a roadmap, a Terraform block. You'll use the result directly instead of reformatting it by hand.

---

## Family 4 — Refine and create

The last three cover improving existing work and generating media.

**Critique / refinement** points the model at something you already have. *"Review this script for flow, emotional impact, factual safety, and retention."* Or a code review, or a prompt review. You're not asking it to create — you're asking it to make your draft sharper, and being specific about the criteria is what makes the critique useful instead of vague praise.

**Image / video prompting** describes a visual in enough detail that the model can render what you actually pictured. *"Describe the subject, background, era, lighting, camera, mood, style, aspect ratio — and what to avoid."* Vague in, generic out; the detail is the difference between "a person on a bike" and the specific shot in your head.

**Audio prompting** does the same for sound. *"Cinematic background music: low strings, soft tabla, sacred mood, 45 seconds."* Type, mood, instruments, duration.

---

## The simple rule for choosing in the moment

You won't run through four families every time you open a chat. Over a few weeks the choice becomes reflex, but until it does, this is the cheat-sheet version:

- Quick answer → **zero-shot**
- Match a style → **one-shot**
- Consistent quality across many outputs → **few-shot**
- Expert-level help → **persona**
- Complex or multi-step task → **step-by-step**
- Large workflow → **prompt chaining**
- Accuracy from a document → **reference-text**
- AI images or video → **visual-detail + negative prompt**
- Avoiding mistakes → ask for assumptions, checks, and limitations

And underneath all of them sits the golden rule from Part 1: **clear goal + context + constraints + format = better output.** Every one of the twelve types is a variation on giving the model less to guess about.

---

## The copy-paste prompt playbook

Knowing the twelve types is the theory. Here's the practice — the prompts I actually keep on hand, ready to paste and fill in.

None of these are clever. They're just the Part 1 skeleton wearing different clothes for different jobs — which is exactly the point. Once the structure is muscle memory, you stop writing prompts from scratch and start filling in slots.

### A. For serious technical learning

When I want to genuinely master a topic — not skim it — I use this. The persona sets the altitude, the context tells the model what I already know so it doesn't waste time on basics, and the numbered tasks force real depth instead of a Wikipedia summary.

```text
Act as a senior AWS Solutions Architect and DevOps mentor.

Goal:
Help me master AWS VPC deeply, to Solutions Architect Professional level.

Context:
I'm a Principal DevOps engineer with Jenkins, Kubernetes, Terraform,
AWS, Azure DevOps, ArgoCD, and Datadog experience.

Task:
1. Explain VPC from basics to advanced.
2. Show how subnets, route tables, NAT Gateway, IGW, NACL, SG,
   VPC endpoints, Transit Gateway, and PrivateLink connect.
3. Give a real enterprise architecture example.
4. Give interview questions.
5. Give a hands-on Terraform assignment.

Output format:
Sections, text diagrams, and practical examples.
```

Swap "VPC" for whatever you're studying. The shape holds for EKS internals, IAM, observability, anything.

### B. For troubleshooting pipeline failures

This is the one I reach for most. It does something subtle: it forces the model to *classify* the failure before fixing it, which stops it from confidently proposing a DevOps fix for what's actually a developer bug. Note the delimited input — the logs go inside the quotes so the model treats them as evidence, not instructions.

```text
Act as an enterprise DevOps incident investigator.

Context:
Our pipeline flow is GitHub/Bitbucket -> Jenkins/Azure DevOps ->
SonarQube -> Nexus -> Terraform -> AWS -> Kubernetes -> ArgoCD ->
Datadog -> Slack/Jira.

Issue:
"""
[paste error logs here]
"""

Task:
1. Identify the most likely root cause.
2. Classify it: DevOps, developer, infra, security, or dependency issue.
3. Give a quick fix.
4. Give a permanent fix.
5. Suggest how an AI DevOps agent could detect this next time.

Output format:
Table with columns: Root Cause, Evidence, Fix, Owner, Prevention.
```

The "how would an AI agent catch this" step is optional, but I keep it in — it quietly builds a backlog of automation ideas every time something breaks.

### C. For content and script writing

Prompting isn't only a work tool. This is the template behind high-retention video scripts — cinematic without being cheesy, and explicitly fenced against the two things AI loves to do wrong here: invent private emotions and make unsupported claims.

```text
Act as a documentary scriptwriter for high-retention YouTube videos.

Goal:
Create a 10-minute value-based script on [topic / person].

Audience:
English-speaking viewers interested in transformation, discipline,
career growth, and life lessons.

Tone:
Cinematic, emotional, research-backed. Not cheesy, not motivational
shouting.

Task:
1. Start with a strong hook.
2. Build the story in scenes.
3. Avoid fabricated private emotions or unsupported claims.
4. Include a practical lesson for students, engineers, and creators.
5. End with an emotional closing.

Output format:
Clean, TTS-ready script with pauses and scene headings.
```

### D. The meta-move: ask AI to improve your prompt

This is the one that made me better fastest. When you're not sure how to ask, don't guess — hand your rough prompt to the model and ask it to engineer a better one. You learn the patterns by watching what it changes.

```text
Review my prompt below and improve it using prompt engineering
best practices.

My goal:
[what I want]

Current prompt:
"""
[paste prompt]
"""

Improve it for:
1. clarity
2. output quality
3. reduced hallucination
4. better structure
5. better visual or technical detail

Give me:
- the improved prompt
- why it's better
- an optional advanced version
```

Use this whenever you catch yourself unsure how to phrase something. Over time you'll need it less, because you'll have absorbed the moves.

## Your ten-point pre-send checklist

Before you send anything that matters, run down this list. It sounds tedious; it takes ten seconds once it's a habit, and it fixes the vast majority of weak prompts:

1. Did I define the role?
2. Did I explain the goal?
3. Did I give enough context?
4. Did I paste the input clearly inside quotes or tags?
5. Did I specify the output format?
6. Did I say what to avoid?
7. Did I provide examples where they'd help?
8. Did I ask for practical steps, not just theory?
9. Did I ask for a verification or quality check?
10. Did I mention audience, tone, and length?

Most bad answers I get trace back to skipping three or four of these.

## The master prompt to rule them all

If you only save one thing from this entire series, save this. It's the general-purpose template — the skeleton from Part 1, tuned to force the model to think about gaps and assumptions before answering, and to close with something you can act on:

```text
Act as an expert in [domain].

I want to achieve:
[goal]

My context:
[background, skill level, audience, business/career/content situation]

Here is my input:
"""
[paste content / code / script / problem / data]
"""

Please do the following:
1. Understand the goal.
2. Identify missing information or assumptions.
3. Give the best possible answer.
4. Make it practical and directly usable.
5. Include examples.
6. Mention risks, mistakes, or limitations.
7. Give a final checklist or next steps.

Output format:
[table / roadmap / bullets / script / YAML / Terraform / prompt / checklist]

Tone:
Clear, practical, mentor-like. No unnecessary jargon.

Avoid:
Generic advice, unsupported claims, hallucination, and
over-complicated explanations.
```

This single structure carries me across DevOps questions, AWS study, AI video work, YouTube scripts, trading notes, blog drafts, and product architecture. Different domain, same skeleton.

## Where this leaves us

Two parts, and it really does reduce to one idea: **stop treating AI like a search box and start engineering the ask.** A prompt is a blueprint. Pick the right type for the job. Give the model less to guess about. Run the checklist. Reuse the master prompt.

The tools will keep changing — new models, new features, new names every few months. This skill won't go stale, because it's not about any one tool. It's about thinking clearly enough to say exactly what you want. That's a good habit to build regardless of what the AI on the other end happens to be.

That's the series. If you build your own template library out of these, you'll feel the difference within a week — I did.
