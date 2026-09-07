# affixio

[![npm version](https://img.shields.io/npm/v/affixio.svg)](https://www.npmjs.com/package/affixio)
[![node](https://img.shields.io/node/v/affixio.svg)](https://nodejs.org)
[![licence](https://img.shields.io/npm/l/affixio.svg)](./LICENSE)

Official AffixIO Node.js SDK. **Know Your Agent (KYA)** for AI agent governance, plus self-hosted proving, post-quantum signatures, and local ops. Defaults to `https://api.affix-io.com`. Hub account tools stay at `https://hub.affix-io.com`.

## Know Your Agent (KYA)

Enrol an agent with a capability spec, authorise every tool call, and keep a PII-free proof trail. Built into `affixio` (no separate package).

```bash
npm install affixio
```

```js
import { createAgentTrust } from "affixio";

const trust = createAgentTrust({ apiKey: process.env.AFFIX_API_KEY });

const credential = await trust.enrol({
  agentId: "agent://ops-runner/prod",
  holder: "finance-platform",
  capabilities: [
    { action: "http.get", resource: "https://api.acme.com/*" },
    { action: "db.read", resource: "orders" },
  ],
});

const receipt = await trust.authorise({
  credential,
  action: "http.get",
  resource: "https://api.acme.com/orders/42",
  args: { orderId: 42 },
});

if (!receipt.allowed) throw new Error(receipt.reason);

const audit = await trust.buildAuditTrail();
```

| Surface | URL |
|---------|-----|
| Product | https://www.affix-io.com/agent-trust/ |
| Hub Billing (keys) | https://hub.affix-io.com/billing/ |
| HTTP API | `GET/POST https://api.affix-io.com/v1/agent-trust` |
| npm | https://www.npmjs.com/package/affixio |

### Local ops dashboard

Self-hosted operator UI for live licence, proofs, queue, and KYA. Binds to `127.0.0.1` by default. Does not replace Hub Billing or account sign-in.

```bash
npx affixio dashboard
# open http://127.0.0.1:8787/
npx affixio dashboard --port 8790
```

```js
import { runDashboard } from "affixio";

const { url, shutdown } = await runDashboard({ port: 8787 });
```

## Install

```bash
npm install affixio
```

Node.js 20 or newer. Store a key once:

```bash
npx affixio set-key --api-key aio_your_key
```

## Proving quick start

```bash
npx affixio prove --claim approved --offline
npx affixio menu
```

```typescript
import { AffixSDK } from "affixio";

const sdk = new AffixSDK({ apiKey: process.env.AFFIX_API_KEY! });

const proof = await sdk.prove({
  mode: "offline",
  circuitId: "simple_yesno",
  fields: { claim: "approved", required: "approved" },
});

const check = await sdk.verifyLocal("simple_yesno", proof.proof, { envelope: proof.envelope });
```

Defaults are safe: HMAC proofs, ML-DSA-65 on every proof, licence-only networking, secrets written with mode 0600.

## Why

Most verification SDKs send your data to a server. This one does not. Your host holds the data, runs the proof, signs it, and records the spend. Affix confirms your licence is active and sees nothing else.

## What runs where

| On your host | At Affix |
|--------------|----------|
| HMAC and UltraHonk proving | `GET /v1/auth/check` licence heartbeat |
| Proof verification | KYA HTTP routes when you call the API |
| ML-DSA-65 signing | |
| Tamper-evident spend journal | |
| QR and barcode issue and scan | |
| Local ops dashboard | |
| Lookups against your own databases and APIs | |

With `licenceOnly` on (the default), remote proof sync throws `LicenceOnlyError` instead of quietly reaching the network.

## Two proof modes

| Mode | Use it for | Speed |
|------|------------|-------|
| `hmac` (default) | High-throughput yes/no checks with an authenticated, signed result | sub-millisecond |
| `ultrahonk` | Real zero-knowledge proofs over bundled Noir circuits (`simple_yesno`, `yesno`) | seconds |

Verification fails closed. A truncated, tampered, or forged carrier returns `valid: false` with a reason.

## Post-quantum signing (ML-DSA-65)

Every proof is signed with ML-DSA-65 (FIPS 204) as it is created. The signing key belongs to your deployment.

```typescript
proof.signature;
sdk.exportLocalPublicKey();
```

## Double-spend control

Code uses are written to an append-only, hash-chained journal. There is no reset.

```typescript
sdk.spendStatus();
sdk.verifySpendJournal();
```

## QR and barcode carriers

Codes carry a PII-free proof. Presentment links point at your host only when you set one.

```typescript
const qr = await sdk.generateCodeFromProve({
  kind: "qr",
  maxUses: 1,
  format: "both",
  mode: "offline",
  save: { path: "./codes", sidecar: true },
  fields: { claim: "day-pass", required: "day-pass" },
});
```

## HSM and cloud KMS

```bash
npx affixio hsm status
npx affixio hsm test
```

## Data check then prove

Point the SDK at your own store, run an exact field check, then prove from that result. See examples under `examples/sql/`.

## Configuration

Operator config lives under `.affix/`. Use `npx affixio setup` or `npx affixio config`. Secrets are never printed.

Env: `AFFIX_API_KEY`, `AFFIX_API_BASE`, `AFFIX_PROOF_MODE`, `AFFIX_LICENCE_ONLY`, `AFFIX_PRESENTMENT_BASE`, `AFFIX_LOCAL_HMAC_SECRET`, `AFFIX_DASHBOARD_HOST`, `AFFIX_DASHBOARD_PORT`.

## CLI

```bash
npx affixio dashboard                           # local ops UI (KYA + live data)
npx affixio menu                                # interactive operator terminal
npx affixio setup                               # write .affix/config.json
npx affixio set-key --api-key aio_...           # store the licence key, mode 0600
npx affixio licence                             # force a licence ping
npx affixio prove --claim approved --offline
npx affixio verify-local <proof-hex>
npx affixio qr --claim approved --scans 1 --out ./codes
npx affixio barcode --claim approved --scans 5 --out ./codes
npx affixio read <payload> --sidecar ./codes --consume
npx affixio spend-status
npx affixio stats
npx affixio hsm status
npx affixio config
npx affixio pubkey
```

## Security

- Secrets under `.affix/secrets/` use mode 0600. `.affix/` is not published.
- `operatorConfig()` and `affixio config` report presence flags only.
- HSM profiles store environment variable names, never PINs or tokens.
- Tampered proofs fail closed with a reason.

## Remote sync (opt in)

```typescript
const sdk = new AffixSDK({ apiKey, licenceOnly: false, autoFlush: true });
await sdk.flushOfflineQueue();
sdk.dispose();
```

## Licence

Apache-2.0. Copyright 2026 AffixIO.

---

Keywords: Know Your Agent, KYA, AI agent governance, agent identity, local ops dashboard, zero-knowledge proof, ZKP, UltraHonk, Noir, Barretenberg, post-quantum cryptography, PQC, ML-DSA-65, FIPS 204, HMAC-SHA256, HSM, verifiable credentials, offline-first, on-premise, air-gapped, QR code, Merkle tree, AffixIO.
