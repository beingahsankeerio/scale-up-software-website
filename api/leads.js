// /api/leads — private. Requires the x-admin-password header to match ADMIN_PASSWORD.
//   GET              → list all demo requests (newest first)
//   PATCH  {id, status, note} → update status / private note
//   DELETE ?id=...   → delete one request
const { storeReady, getLead, saveLead, listLeads, deleteLead, readBody, send, isAdmin, clean } = require("./_store");

const STATUSES = ["New", "Contacted", "Demo booked", "Won", "Lost"];

module.exports = async (req, res) => {
  if (!process.env.ADMIN_PASSWORD) return send(res, 503, { ok: false, error: "ADMIN_PASSWORD is not set in Vercel yet" });
  if (!isAdmin(req)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down password guessing
    return send(res, 401, { ok: false, error: "Wrong password" });
  }
  if (!storeReady()) return send(res, 503, { ok: false, error: "Lead storage is not connected yet" });

  try {
    if (req.method === "GET") {
      return send(res, 200, { ok: true, leads: await listLeads(), statuses: STATUSES });
    }
    if (req.method === "PATCH") {
      const b = readBody(req);
      const lead = await getLead(clean(b.id, 80));
      if (!lead) return send(res, 404, { ok: false, error: "Not found" });
      if (b.status !== undefined) {
        if (!STATUSES.includes(b.status)) return send(res, 400, { ok: false, error: "Unknown status" });
        lead.status = b.status;
      }
      if (b.note !== undefined) lead.note = clean(b.note, 2000);
      lead.updatedAt = new Date().toISOString();
      await saveLead(lead);
      return send(res, 200, { ok: true, lead });
    }
    if (req.method === "DELETE") {
      const id = clean((req.query && req.query.id) || new URL(req.url, "http://x").searchParams.get("id"), 80);
      if (!id) return send(res, 400, { ok: false, error: "Missing id" });
      await deleteLead(id);
      return send(res, 200, { ok: true });
    }
    return send(res, 405, { ok: false, error: "Method not allowed" });
  } catch (e) {
    return send(res, 500, { ok: false, error: "Storage error" });
  }
};
