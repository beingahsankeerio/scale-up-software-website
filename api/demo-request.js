// POST /api/demo-request — saves a demo request from the website form.
const { storeReady, saveLead, readBody, send, clean, crypto } = require("./_store");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });
  if (!storeReady()) return send(res, 503, { ok: false, error: "Lead storage is not set up yet" });

  const b = readBody(req);

  // Spam trap: real visitors never see or fill the "website" field.
  if (b.website) return send(res, 200, { ok: true });

  const lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "New",
    name: clean(b.name, 120),
    business: clean(b.business, 160),
    email: clean(b.email, 160),
    phone: clean(b.phone, 40),
    service: clean(b.service, 80),
    industry: clean(b.industry, 80),
    callsPerWeek: clean(b.calls_per_week || b.callsPerWeek, 40),
    message: clean(b.message, 2000),
    page: clean(b.page, 120),
  };

  if (!lead.name || !lead.business || !EMAIL_RE.test(lead.email)) {
    return send(res, 400, { ok: false, error: "Please fill in your name, business name and a valid email." });
  }

  try {
    await saveLead(lead);
    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { ok: false, error: "Could not save your request" });
  }
};
