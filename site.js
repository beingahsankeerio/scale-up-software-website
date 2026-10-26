/* =====================================================================
   SITE SETTINGS — edit these values, save, and re-upload site.js.
   Every page of the website uses these settings.
   Anything left empty ("") stays hidden on the page, so nothing
   unfinished ever shows to visitors.
   ===================================================================== */
var CONFIG = {
  // Main contact email (used in every email link and the demo form).
  email: "hello@scaleupsoftwares.co.uk",

  // UK phone number answered by your own AI agent, e.g. "020 3000 0000".
  // When filled in it appears in the header, hero, about, contact and footer.
  phone: "+44 7338 320828",

  // Save demo requests to your private admin page (admin.html).
  // Needs the free Upstash Redis storage + ADMIN_PASSWORD set up in Vercel (see README).
  // Until that's done, forms automatically fall back to email.
  saveLeads: true,

  // Free form backend: create a form at formspree.io and paste the ID
  // from its URL (https://formspree.io/f/THIS_PART). When set, demo
  // requests arrive in your inbox directly instead of opening the
  // visitor's email app.
  formspreeId: "",

  // Calendly / Cal.com link so visitors can pick a demo slot themselves.
  bookingUrl: "",

  // Legal details (UK companies must show these on their website).
  legalName: "Scale Up Softwares",          // e.g. "Scale Up Softwares Ltd" — exactly as on Companies House
  companyNumber: "",                       // e.g. "12345678"
  registeredIn: "England and Wales",

  // Founder — a real face builds trust.
  founderName: "",                         // e.g. "Imtiaz Hussain"
  founderUrl: "",                          // e.g. LinkedIn profile URL

  // Testimonials — the "What owners say" section appears once you add one.
  // { quote: "...", name: "Dr A. Patel", business: "BrightSmile Dental, Leeds", result: "38 out-of-hours bookings in month one" }
  testimonials: []
};

(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ Apply site settings ============ */
  var OLD_EMAIL = "hello@scaleupsoftwares.co.uk";
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function show(key, on) { each('[data-show="' + key + '"]', function (el) { el.hidden = !on; }); }

  each('a[href^="mailto:"]', function (a) {
    a.href = a.getAttribute("href").replace(OLD_EMAIL, CONFIG.email);
    if (a.textContent.trim() === OLD_EMAIL) a.textContent = CONFIG.email;
  });
  each("[data-email-link]", function (a) { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; });

  var phone = (CONFIG.phone || "").trim();
  if (phone) {
    var tel = "tel:" + phone.replace(/[^\d+]/g, "").replace(/^0/, "+44");
    each("[data-phone-text]", function (el) { el.textContent = phone; });
    each("[data-phone-link]", function (el) { el.href = tel; el.hidden = false; });
  }
  show("phone", !!phone);

  each("[data-legal-name]", function (el) { el.textContent = CONFIG.legalName; });
  each("[data-registered-in]", function (el) { el.textContent = CONFIG.registeredIn; });
  each("[data-company-number]", function (el) { el.textContent = CONFIG.companyNumber; });
  show("companyNumber", !!CONFIG.companyNumber);

  if (CONFIG.founderName) {
    each("[data-founder-name]", function (el) { el.textContent = CONFIG.founderName; });
    each("[data-founder-link]", function (el) {
      if (CONFIG.founderUrl) { el.href = CONFIG.founderUrl; }
      else { el.removeAttribute("href"); el.removeAttribute("target"); }
    });
  }
  show("founder", !!CONFIG.founderName);

  if (CONFIG.bookingUrl) each("[data-booking-link]", function (el) { el.href = CONFIG.bookingUrl; });
  show("booking", !!CONFIG.bookingUrl);

  var tList = document.getElementById("testimonialList");
  if (tList) (CONFIG.testimonials || []).forEach(function (t) {
    var fig = document.createElement("figure");
    fig.className = "testimonial";
    if (t.result) { var r = document.createElement("div"); r.className = "result"; r.textContent = t.result; fig.appendChild(r); }
    var q = document.createElement("blockquote"); q.textContent = "\u201C" + t.quote + "\u201D"; fig.appendChild(q);
    var c = document.createElement("figcaption");
    var n = document.createElement("strong"); n.textContent = t.name || ""; c.appendChild(n);
    c.appendChild(document.createTextNode(t.business || "")); fig.appendChild(c);
    tList.appendChild(fig);
  });
  show("testimonials", (CONFIG.testimonials || []).length > 0);

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (CONFIG.formspreeId && document.getElementById("formNote")) {
    document.getElementById("formNote").textContent = "We'll reply within one working day to arrange your demo. We only use your details to respond to this request — see our privacy policy.";
  }

  // Structured data for Google (business name, address, contact).
  var ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Scale Up Softwares",
    "legalName": CONFIG.legalName,
    "url": "https://www.scaleupsoftwares.co.uk/",
    "logo": "https://www.scaleupsoftwares.co.uk/logo.png",
    "email": CONFIG.email,
    "description": "AI receptionists for UK businesses: AI voice calling agents, WhatsApp booking agents and website chatbots.",
    "address": { "@type": "PostalAddress", "streetAddress": "128 City Road", "addressLocality": "London", "postalCode": "EC1V 2NX", "addressCountry": "GB" },
    "areaServed": "GB"
  };
  if (phone) ld.telephone = phone;
  if (CONFIG.founderName) ld.founder = { "@type": "Person", "name": CONFIG.founderName };
  var ldTag = document.createElement("script");
  ldTag.type = "application/ld+json";
  ldTag.textContent = JSON.stringify(ld);
  document.head.appendChild(ldTag);

  if (document.getElementById("transcript")) {
/* ============ Sample call console ============ */
  var SCENARIOS = {
    dental: {
      outcome: "Check-up booked for Thursday, 9:40am. Confirmation text sent, and a hygiene recall reminder added for six months' time.",
      lines: [
        { who: "agent", name: "AI Agent · BrightSmile Dental", text: "Good afternoon, BrightSmile Dental — you're speaking with our virtual assistant. How can I help you today?" },
        { who: "caller", name: "Caller", text: "Hi, I need to book a check-up. Thursday morning if you've got anything?" },
        { who: "agent", name: "AI Agent", text: "Of course. On Thursday I have 9:40 or 11:15 with Dr Patel. Which suits you better?" },
        { who: "caller", name: "Caller", text: "9:40 please. It's under the name Priya Shah." },
        { who: "agent", name: "AI Agent", text: "You're booked in, Priya — Thursday at 9:40 for a check-up with Dr Patel. I've texted a confirmation to this number, with a reminder the day before. Anything else?" },
        { who: "caller", name: "Caller", text: "That's everything, thanks!" }
      ]
    },
    restaurant: {
      outcome: "Table for four booked for Friday, 7:30pm, window seat noted. Confirmation and a reminder sent by text.",
      lines: [
        { who: "agent", name: "AI Agent · Olive & Vine", text: "Good evening, Olive and Vine — this is the virtual assistant. How can I help?" },
        { who: "caller", name: "Caller", text: "Can I book a table for four this Friday evening?" },
        { who: "agent", name: "AI Agent", text: "Certainly. Friday we have 6:15 or 7:30 available. Do you have a preference?" },
        { who: "caller", name: "Caller", text: "7:30. And could we get a window seat if possible?" },
        { who: "agent", name: "AI Agent", text: "Done — table for four, Friday at 7:30 under your name, window seat requested. I've sent a text confirmation. If your plans change, just reply to that text and I'll update the booking." }
      ]
    },
    estate: {
      outcome: "Viewing booked for Saturday, 11:00am. Buyer details and the property reference logged for the agent, confirmation sent.",
      lines: [
        { who: "agent", name: "AI Agent · Hartley Estates", text: "Hello, Hartley Estates — you're through to our virtual assistant. How can I help you?" },
        { who: "caller", name: "Caller", text: "I'm calling about the three-bed on Maple Road — is it still available?" },
        { who: "agent", name: "AI Agent", text: "Yes, the Maple Road property is still available at £465,000. Would you like to arrange a viewing?" },
        { who: "caller", name: "Caller", text: "Yes please — Saturday morning if you can." },
        { who: "agent", name: "AI Agent", text: "I've booked you in for Saturday at 11:00. Can I take your name and confirm this is the best number for the viewing confirmation?" },
        { who: "caller", name: "Caller", text: "Tom Weaver, and yes, this number's fine." },
        { who: "agent", name: "AI Agent", text: "All set, Tom. You'll get a text now with the address and Saturday 11 o'clock confirmed. Our negotiator will meet you there." }
      ]
    }
  };

  var transcript = document.getElementById("transcript");
  var outcome = document.getElementById("outcome");
  var outcomeText = document.getElementById("outcomeText");
  var playBtn = document.getElementById("playBtn");
  var playLabel = document.getElementById("playLabel");
  var playIcon = document.getElementById("playIcon");
  var recDot = document.getElementById("recDot");
  var callTimer = document.getElementById("callTimer");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".scenario-tabs button"));
  var current = "dental";
  var timers = [];
  var clockTimer = null;
  var playing = false;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
  }
  function later(fn, ms) { timers.push(setTimeout(fn, reduced ? 30 : ms)); }
  function fmt(s) { return (s < 10 ? "0" : "") + s; }
  function stopClock() { recDot.classList.remove("live"); }

  function resetConsole() {
    clearTimers();
    playing = false;
    stopClock();
    callTimer.textContent = "00:00";
    transcript.innerHTML = "";
    outcome.classList.remove("show");
    playBtn.disabled = false;
    playIcon.textContent = "▶";
    playLabel.textContent = "Play sample call";
    var lines = SCENARIOS[current].lines;
    lines.forEach(function (line) {
      var div = document.createElement("div");
      div.className = "msg " + line.who;
      var sp = document.createElement("span");
      sp.className = "speaker";
      sp.textContent = line.name;
      div.appendChild(sp);
      div.appendChild(document.createTextNode(""));
      div.dataset.text = line.text;
      transcript.appendChild(div);
    });
  }

  function typeLine(el, text, done) {
    if (reduced) { el.lastChild.textContent = text; done(); return; }
    var i = 0;
    el.classList.add("caret-on");
    var span = el.lastChild;
    span.textContent = "";
    el.querySelector(".speaker").insertAdjacentHTML("afterend", "");
    var caretHost = el;
    caretHost.classList.add("typing");
    var step = function () {
      i += 2;
      span.textContent = text.slice(0, i);
      if (i < text.length) {
        timers.push(setTimeout(step, 16 + Math.random() * 22));
      } else {
        caretHost.classList.remove("typing");
        done();
      }
    };
    step();
  }

  function play() {
    if (playing) return;
    resetConsole();
    playing = true;
    playBtn.disabled = true;
    playIcon.textContent = "●";
    playLabel.textContent = "Call in progress…";
    recDot.classList.add("live");
    var secs = 0;
    clockTimer = setInterval(function () {
      secs++;
      callTimer.textContent = fmt(Math.floor(secs / 60)) + ":" + fmt(secs % 60);
    }, 1000);

    var msgs = Array.prototype.slice.call(transcript.querySelectorAll(".msg"));
    var delay = 500;
    msgs.forEach(function (el, idx) {
      later(function () {
        el.classList.add("show");
        transcript.scrollTop = transcript.scrollHeight;
        typeLine(el, el.dataset.text, function () {});
      }, delay);
      delay += reduced ? 60 : 900 + el.dataset.text.length * 26;
      if (idx === msgs.length - 1) {
        later(function () {
          outcomeText.textContent = SCENARIOS[current].outcome;
          outcome.classList.add("show");
          playing = false;
          stopClock();
          if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
          playBtn.disabled = false;
          playIcon.textContent = "↻";
          playLabel.textContent = "Replay sample call";
        }, delay + 500);
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
      tab.setAttribute("aria-selected", "true");
      current = tab.dataset.scenario;
      resetConsole();
    });
  });
  playBtn.addEventListener("click", play);
  resetConsole();

  }

  if (document.getElementById("billingToggle")) {
/* ============ Pricing billing toggle ============ */
  var billingToggle = document.getElementById("billingToggle");
  var optMonthly = document.getElementById("optMonthly");
  var optAnnual = document.getElementById("optAnnual");
  function applyBilling() {
    var annual = billingToggle.getAttribute("aria-checked") === "true";
    optMonthly.classList.toggle("on", !annual);
    optAnnual.classList.toggle("on", annual);
    document.querySelectorAll(".plan .amount").forEach(function (el) {
      el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
    });
    document.querySelectorAll(".plan .billed").forEach(function (el) {
      el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
    });
  }
  billingToggle.addEventListener("click", function () {
    var annual = billingToggle.getAttribute("aria-checked") === "true";
    billingToggle.setAttribute("aria-checked", annual ? "false" : "true");
    applyBilling();
  });
  applyBilling();

  }

  if (document.getElementById("callsPerWeek")) {
/* ============ Missed-call calculator ============ */
  var callsEl = document.getElementById("callsPerWeek");
  var missedEl = document.getElementById("missedPct");
  var valueEl = document.getElementById("avgValue");
  var callsOut = document.getElementById("callsOut");
  var missedOut = document.getElementById("missedOut");
  var valueOut = document.getElementById("valueOut");
  var lossMonth = document.getElementById("lossMonth");
  var lossYear = document.getElementById("lossYear");
  var gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

  function calc() {
    var calls = parseInt(callsEl.value, 10);
    var missed = parseInt(missedEl.value, 10);
    var val = parseInt(valueEl.value, 10);
    callsOut.textContent = calls;
    missedOut.textContent = missed + "%";
    valueOut.textContent = gbp.format(val);
    var weeklyLoss = calls * (missed / 100) * 0.5 * val;
    var monthRounded = Math.round((weeklyLoss * 52) / 12);
    lossMonth.textContent = gbp.format(monthRounded);
    lossYear.textContent = gbp.format(monthRounded * 12);
  }
  [callsEl, missedEl, valueEl].forEach(function (el) {
    el.addEventListener("input", calc);
  });
  calc();

  }

  if (document.getElementById("demoForm")) {
/* ============ Demo request form ============ */
  try {
    var qs = new URLSearchParams(location.search).get("service") || document.body.getAttribute("data-default-service");
    var selQ = document.getElementById("inService");
    if (qs && selQ) Array.prototype.forEach.call(selQ.options, function (o) { if (o.text === qs) selQ.value = qs; });
  } catch (e) {}
  Array.prototype.forEach.call(document.querySelectorAll("[data-service]"), function (a) {
    a.addEventListener("click", function () {
      var sel = document.getElementById("inService");
      if (sel) sel.value = a.getAttribute("data-service");
    });
  });
  var form = document.getElementById("demoForm");
  var success = document.getElementById("formSuccess");
  var summary = document.getElementById("successSummary");
  var EMAIL = CONFIG.email;

  function val(id) { return document.getElementById(id).value.trim(); }

  function buildRequest() {
    var lines = [
      "Demo request — Scale Up Softwares",
      "--------------------------------",
      "Name: " + val("inName"),
      "Business: " + val("inBusiness"),
      "Email: " + val("inEmail"),
      "Phone / WhatsApp: " + (val("inPhone") || "—"),
      "Service: " + val("inService"),
      "Type of business: " + val("inIndustry"),
      "Calls per week: " + val("inVolume"),
      "Notes: " + (val("inMessage") || "—")
    ];
    return lines.join("\n");
  }

  function validate() {
    var ok = true;
    var checks = [
      { field: "f-name", valid: val("inName").length > 0 },
      { field: "f-business", valid: val("inBusiness").length > 0 },
      { field: "f-email", valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("inEmail")) }
    ];
    checks.forEach(function (c) {
      document.getElementById(c.field).classList.toggle("invalid", !c.valid);
      if (!c.valid) ok = false;
    });
    return ok;
  }
  ["inName", "inBusiness", "inEmail"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      document.getElementById(id.replace("in", "f-").toLowerCase().replace("fname", "f-name").replace("fbusiness", "f-business").replace("femail", "f-email")).classList.remove("invalid");
    });
  });

  function copyText(text, btn) {
    var done = function () {
      var old = btn.textContent;
      btn.textContent = "Copied ✓";
      setTimeout(function () { btn.textContent = old; }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  document.getElementById("copyBtn").addEventListener("click", function () {
    copyText(buildRequest(), this);
  });
  document.getElementById("copyBtn2").addEventListener("click", function () {
    copyText(summary.textContent, this);
  });
  document.getElementById("againBtn").addEventListener("click", function () {
    success.classList.remove("show");
    form.style.display = "";
    if (CONFIG.bookingUrl) document.getElementById("bookingAlt").hidden = false;
    form.reset();
  });

  var errElInit = document.getElementById("formError");
  var errDefault = errElInit ? errElInit.innerHTML : "";

  function showThanks() {
    document.getElementById("successTitle").textContent = "Thanks — your demo request is in";
    document.getElementById("successText").textContent = "We'll be in touch within one working day to arrange your demo. Here's a copy of what you sent:";
    form.style.display = "none";
    var alt = document.getElementById("bookingAlt"); if (alt) alt.hidden = true;
    success.classList.add("show");
    success.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }

  function mailtoFallback(subject, body) {
    var href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    form.style.display = "none";
    var alt = document.getElementById("bookingAlt"); if (alt) alt.hidden = true;
    success.classList.add("show");
    success.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    var mailLink = document.createElement("a");
    mailLink.href = href;
    mailLink.style.display = "none";
    document.body.appendChild(mailLink);
    mailLink.click();
    document.body.removeChild(mailLink);
  }

  function sendFormspree(payload) {
    return fetch("https://formspree.io/f/" + encodeURIComponent(CONFIG.formspreeId), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); });
  }

  if (CONFIG.saveLeads && document.getElementById("formNote")) {
    document.getElementById("formNote").textContent = "We'll reply within one working day to arrange your demo. We only use your details to respond to this request — see our privacy policy.";
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!validate()) {
      var firstBad = form.querySelector(".field.invalid input");
      if (firstBad) firstBad.focus();
      return;
    }
    var body = buildRequest();
    summary.textContent = body;
    var subject = "Demo request — " + val("inBusiness");
    var errEl = document.getElementById("formError");
    errEl.hidden = true;
    errEl.innerHTML = errDefault;
    var hp = form.querySelector('input[name="website"]');
    var payload = {
      _subject: subject, name: val("inName"), business: val("inBusiness"), email: val("inEmail"),
      _replyto: val("inEmail"), phone: val("inPhone"), service: val("inService"), industry: val("inIndustry"),
      calls_per_week: val("inVolume"), message: val("inMessage"),
      page: ({ "": "Homepage", "index.html": "Homepage", "ai-voice-agents.html": "AI Voice Agents", "whatsapp-booking-agents.html": "WhatsApp Booking Agents", "website-chatbots.html": "Website Chatbots" })[location.pathname.split("/").pop()] || location.pathname, website: hp ? hp.value : ""
    };
    var submitBtn = form.querySelector('button[type="submit"]');
    var oldLabel = submitBtn.textContent;
    function busy(on) { submitBtn.disabled = on; submitBtn.textContent = on ? "Sending…" : oldLabel; }

    // Plan B when our own storage isn't available: Formspree if set up, otherwise the email app.
    function fallback() {
      if (CONFIG.formspreeId) {
        return sendFormspree(payload).then(showThanks).catch(function () { errEl.hidden = false; });
      }
      mailtoFallback(subject, body);
    }

    if (!CONFIG.saveLeads) { busy(true); Promise.resolve(fallback()).then(function () { busy(false); }); return; }

    busy(true);
    fetch("/api/demo-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (d) {
        if (res.ok && d.ok) {
          if (CONFIG.formspreeId) sendFormspree(payload).catch(function () {}); // optional email copy
          showThanks();
          return;
        }
        if (res.status === 400 && d.error) {
          errEl.textContent = d.error;
          errEl.hidden = false;
          return;
        }
        return fallback();
      });
    }).catch(function () {
      return fallback();
    }).then(function () { busy(false); });
  });
}

  })();
