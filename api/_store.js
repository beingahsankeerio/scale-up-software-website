// Shared helpers for the demo-request API.
// Storage: Firebase Firestore (via firebase-admin on Vercel serverless).
// Set the FIREBASE_SERVICE_ACCOUNT environment variable in Vercel to the
// full JSON of a Firebase service-account private key. Firestore security
// rules stay locked down (deny all client access) — only this server code
// reads/writes, using the Admin SDK.

const crypto = require("crypto");

const COLLECTION = "demo_requests";

let admin = null;
let db = null;

function getDb() {
  if (db) return db;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || "";
  if (!raw) return null;
  let sa;
  try {
    sa = JSON.parse(raw);
  } catch (e) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON");
  }
  if (!admin) admin = require("firebase-admin");
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  }
  db = admin.firestore();
  return db;
}

function storeReady() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

async function saveLead(lead) {
  await getDb().collection(COLLECTION).doc(lead.id).set(lead, { merge: true });
}

async function getLead(id) {
  const snap = await getDb().collection(COLLECTION).doc(id).get();
  return snap.exists ? snap.data() : null;
}

async function listLeads() {
  const snap = await getDb()
    .collection(COLLECTION)
    .orderBy("createdAt", "desc")
    .get();
  const leads = [];
  snap.forEach((d) => leads.push(d.data()));
  return leads;
}

async function deleteLead(id) {
  await getDb().collection(COLLECTION).doc(id).delete();
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
