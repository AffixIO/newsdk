#!/usr/bin/env node
/**
 * Composite GitHub Action verifier. Uses the bundled Sectigo intermediate so
 * api.affix-io.com verifies even when the host does not send a full chain.
 */
import { existsSync, readFileSync } from "node:fs";
import https from "node:https";
import tls from "node:tls";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const actionDir = dirname(fileURLToPath(import.meta.url));
const caPath = join(actionDir, "sectigo-r36.pem");

function loadCa() {
  const bundle = [...tls.rootCertificates];
  if (existsSync(caPath)) {
    bundle.push(readFileSync(caPath, "utf8"));
  }
  return bundle;
}

function requestJson(url, { method = "GET", headers = {}, body } = {}) {
  const parsed = new URL(url);
  return new Promise((resolvePromise, reject) => {
    const req = https.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: `${parsed.pathname}${parsed.search}`,
        method,
        headers,
        ca: loadCa(),
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json;
          try {
            json = JSON.parse(text);
          } catch {
            json = { raw: text };
          }
          resolvePromise({ status: res.statusCode || 0, json });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function resolveProof(raw) {
  const value = String(raw || "").trim();
  if (!value) throw new Error("proof input is empty");
  if (existsSync(value)) {
    const text = readFileSync(resolve(value), "utf8").trim();
    try {
      const parsed = JSON.parse(text);
      if (parsed.proof) return String(parsed.proof);
    } catch {
      /* treat as raw proof hex */
    }
    return text;
  }
  return value;
}

async function main() {
  const apiKey = process.env.AFFIX_API_KEY;
  const apiBase = (process.env.AFFIX_API_BASE || "https://api.affix-io.com").replace(/\/$/, "");
  const circuitId = process.env.AFFIX_CIRCUIT_ID || "yesno";
  const proof = resolveProof(process.env.AFFIX_PROOF);

  if (!apiKey) {
    console.error("api_key input is required");
    process.exit(1);
  }

  const body = JSON.stringify({ proof });
  const { status, json } = await requestJson(`${apiBase}/v1/circuits/${encodeURIComponent(circuitId)}/verify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
    body,
  });

  const valid = json.valid === true || json.verified === true;
  if (status < 200 || status >= 300 || !valid) {
    console.error("Proof verification failed");
    console.error(JSON.stringify(json, null, 2));
    process.exit(1);
  }

  console.log("Proof verified");
  console.log(JSON.stringify({ circuit_id: circuitId, valid: true, status }, null, 2));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
