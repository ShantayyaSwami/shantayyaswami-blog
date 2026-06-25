---
title: "TLS Mastery — Part 1: Why TLS Exists & The Cryptography Behind It"
date: 2026-05-30
tags: ["TLS", "SSL", "Cryptography", "Encryption", "Hashing", "Security", "HTTPS", "Networking"]
excerpt: "Why plain HTTP is unsafe, and the cryptography foundations behind TLS: cryptography vs encryption, hashing, and symmetric vs asymmetric keys."
readTime: "8 min read"
featured: true
author: "Shantayya Swami"
image: "/images/TLS Mastery — Part 1.png"
---

This is the opening post of an 8-part **TLS Mastery** series. By the end you'll understand how HTTPS really works, how to create certificates and your own CA with OpenSSL, what the real-world bits (Let's Encrypt, revocation, formats) are, and how to secure traffic in Kubernetes.

In this part:

- The four security problems plain HTTP can't solve
- SSL vs TLS (the naming)
- Cryptography vs encryption
- Hashing, and how it differs from encryption
- Symmetric vs asymmetric encryption

---

## Why do we need TLS?

When you send data over the internet, it doesn't travel in a straight line — it hops through many networking devices before reaching the server.

```
Your Browser → Router → ISP → Internet Backbone → Web Server (bank.com)
                               ↑
                         Attacker sniffing traffic
```

For a public, read-only site that's mostly fine. But imagine logging into your **bank**. If the data travels as **plain text**, anyone on the network path can read your user ID and password.

Plain HTTP sends everything in the clear, which creates four real problems:

1. **Confidentiality** — anyone on the path can read plain-text data.
2. **Server authentication** — how do I know `bank.com` is the *real* bank, not a lookalike like `bankk.com`?
3. **Integrity** — if the bank sends `x = 1`, how do I know an attacker didn't change it to `x = 2` in transit?
4. **Client authentication** — how does the bank know the person logging in is the genuine account holder?

The industry's answer is **Transport Layer Security (TLS)**. Its older name was **SSL (Secure Sockets Layer)**, and TLS is simply the modern successor.

> **Naming note:** People say "SSL certificate", "TLS certificate", "SSL protocol", "TLS protocol" interchangeably — they mean the same thing. The technically correct modern term is **TLS**. And as we'll see in Part 3, the old SSL versions and even early TLS versions are now considered insecure and have been retired.

To understand TLS we need three building blocks: cryptography, encryption and hashing.

---

## Cryptography vs encryption

**Cryptography** is the *study* (the art and science) of protecting information so unintended recipients can't understand it. It's a **field** — not a single algorithm.

In cryptography we take readable **plain text** (e.g. `hello world`) and turn it into scrambled, unreadable **cipher text**. The word literally means "hidden writing".

**Encryption** is a concrete *process* that lives *inside* cryptography:

```
Cryptography (the field / the study)
├── Encryption (a process within it)
│   ├── Symmetric encryption
│   └── Asymmetric encryption
└── Hashing (a process within it)
```

Put simply: **cryptography defines *how* to encrypt and decrypt; encryption is the process that actually does it.**

---

## Hashing — and how it differs from encryption

Hashing is a third tool, and you use it constantly without realising.

A **hash** is a fixed-length value produced from any input. You feed data into a **hash function** and get back a scrambled, fixed-size value. The crucial difference:

- **Encryption is two-way** — encrypt, then decrypt back to the original.
- **Hashing is one-way** — once hashed, there's no way back to the original.

```
Encryption (two-way):
Plain text → [encrypt] → Cipher text → [decrypt] → Plain text

Hashing (one-way):
Plain text → [hash] → Hash value  ✗ no way back
```

Hashing isn't about sending data to be decoded later — its purposes are **secure storage** and **integrity verification**.

### Use case 1: Storing passwords

Linux never stores your password in plain text. When you set `admin123`, the system stores only its **hash** (in `/etc/shadow`).

On the next login:

1. You type `admin123`.
2. The system hashes what you typed.
3. It compares the **new hash** with the **stored hash**.
4. If they match, you're in.

The actual password is never compared — only hashes. Even someone reading `/etc/shadow` can't recover the original.

### Use case 2: Verifying file integrity

Download a binary or a PDF — how do you know it wasn't corrupted or tampered with? The publisher provides a **checksum** (a hash). After downloading, compute the hash of *your* copy and compare:

```bash
sha256sum helm-v3-linux-amd64.tar.gz   # SHA-256
sha512sum helm-v3-linux-amd64.tar.gz   # SHA-512
```

If your value matches the published one, the file is intact. Change one byte, and the hash changes completely.

> **A correctness note:** Not all hash algorithms are safe. **MD5 and SHA-1 are broken** for security purposes — collisions are practical — and should only be used for non-security checks, if at all. Prefer the **SHA-2 family (SHA-256/384/512)** or SHA-3. The numbers (256, 512) are the output length in bits.

---

## Symmetric vs asymmetric encryption

There are two broad families of encryption — and TLS uses **both together**.

### Symmetric encryption — one shared key

The **same key** encrypts and decrypts.

```
Sender ("hello world") → [encrypt with KEY] → Cipher text → [decrypt with KEY] → Receiver ("hello world")
```

- **Pro:** Fast — ideal for large amounts of data.
- **Con:** **Key distribution.** Both sides need the same key. If you send it over the network, an attacker can grab it too and decrypt everything.

### Asymmetric encryption — a key pair

You generate two mathematically related keys: a **public key** and a **private key**. The rule: **data encrypted with one key can only be decrypted with the *other* key** — never the same one.

```
Sender ("hello world") → [encrypt with PUBLIC key] → Cipher text → [decrypt with PRIVATE key] → Receiver ("hello world")
```

- The **private key** is never shared — it stays with the owner.
- The **public key** can be shared with anyone.

This is also called **public key encryption**.

- **Pro:** More secure — even if the public key is everywhere, only the private-key holder can decrypt.
- **Con:** Slower (heavier math).

### Which is better? Both.

Asymmetric is **secure but slow**; symmetric is **fast but has a key-sharing problem**. As we'll see in Part 3, TLS uses asymmetric cryptography first — to safely establish a shared secret — then switches to fast symmetric encryption for the actual data. Best of both worlds.

> **Familiar example:** SSH key-based login uses asymmetric keys. You generate `id_rsa` (private, kept with you) and `id_rsa.pub` (public, placed on servers). Think of the public key as a *lock* you put on servers; only your private key opens it.

---

## What's next in the series

You now have the core vocabulary:

- **Cryptography** is the field; **encryption** (two-way) and **hashing** (one-way) are processes within it.
- **Symmetric** = one fast shared key; **asymmetric** = a secure public/private key pair.

In **Part 2** we'll use these ideas to explain **HTTPS, certificates, Certificate Authorities (CA), and the chain of trust** — and why a raw public key isn't enough on its own.

| Part | Topic |
|:--|:--|
| **Part 1 — You are here** | Why TLS Exists & The Cryptography Behind It |
| [Part 2](/blog/tls-mastery-part-2-https-certificates-ca-pki) | HTTPS, Certificates, CAs, PKI & the 3 Certificate Types |
| Part 3 | The Handshake (Classic vs Modern), Versions & SNI |
| Part 4 | OpenSSL: Self-Signed Cert + NGINX |
| Part 5 | Build Your Own CA: Root → Intermediate → Leaf, CSR & SAN |
| Part 6 | Formats, Revocation, Let's Encrypt & HSTS |
| Part 7 | Kubernetes Ingress TLS (SSL Offloading), mTLS, Client Certs & cert-manager |
| [Part 8](/blog/tls-mastery-part-8-certificate-errors) | Common Certificate Errors & How to Fix Them |
