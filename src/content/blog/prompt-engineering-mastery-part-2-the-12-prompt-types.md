---
title: "Prompt Engineering Mastery — Part 2: The 12 Prompt Types and When to Use Each"
date: 2026-07-10
tags: ["AI", "Prompt Engineering", "DevOps", "Productivity"]
excerpt: "There isn't one kind of prompt — there are about a dozen, and picking the right one is most of the skill. A DevOps-first tour of the twelve prompt types, with a simple rule for choosing in the moment."
readTime: "9 min read"
featured: true
author: "Shantayya Swami"
image: "/images/Prompt Engineering Mastery — Part 2.png"
---

In [Part 1](/blog/prompt-engineering-mastery-part-1-stop-blaming-the-model) I made the case that prompting is a real skill and shared the skeleton I use for any serious prompt. That skeleton is the *how*. This part is the *which*.

Because here's the thing that took me embarrassingly long to internalise: there isn't one kind of prompt. There are roughly a dozen, each suited to a different situation, and most of the skill is reaching for the right one without thinking about it — the same way you don't consciously decide between `grep` and `awk`, you just know.

Let me walk through them in four natural families, because they group more cleanly than a flat list of twelve.

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

## What's next

Knowing the twelve types is the theory. In **Part 3** I'll hand over the practice — the actual copy-paste prompts I keep on hand for AWS learning, pipeline troubleshooting, YouTube script writing, and the meta-move of asking AI to improve my own prompts — plus a ten-point pre-send checklist and one master prompt you can reuse for almost anything.

That's the part you'll bookmark. See you there.
