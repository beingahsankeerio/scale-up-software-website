// Shared helpers for the demo-request API.
// Storage: Upstash Redis (free tier) connected through Vercel → Storage / Marketplace.
// Vercel adds the connection details as environment variables automatically.

const crypto = require("crypto");

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const KEY = "demo_requests";

function storeReady() {
  return Boolean(URL_ && TOKEN);
}

async function redis(command) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.error) throw new Error("Storage error: " + (data.error || r.status));
  return data.result;
}

async function saveLead(lead) {
  await redis(["HSET", KEY, lead.id, JSON.stringify(lead)]);
}

async function getLead(id) {
  const raw = await redis(["HGET", KEY, id]);
  return raw ? JSON.parse(raw) : null;
}

async function listLeads() {
  const flat = (await redis(["HGETALL", KEY])) || [];
  const leads = [];
  for (let i = 0; i < flat.length; i += 2) {
    try { leads.push(JSON.parse(flat[i + 1])); } catch (e) { /* skip bad row */ }
  }
  leads.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return leads;
}

async function deleteLead(id) {
  return redis(["HDEL", KEY, id]);
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return {};
}

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

// Constant-time password check against the ADMIN_PASSWORD environment variable.
function isAdmin(req) {
  const expected = process.env.ADMIN_PASSWORD || "";
  const given = String(req.headers["x-admin-password"] || "");
  if (expected.length < 8 || !given) return false;
  const a = crypto.createHash("sha256").update(expected).digest();
  const b = crypto.createHash("sha256").update(given).digest();
  return crypto.timingSafeEqual(a, b);
}

function clean(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

module.exports = { storeReady, saveLead, getLead, listLeads, deleteLead, readBody, send, isAdmin, clean, crypto };
