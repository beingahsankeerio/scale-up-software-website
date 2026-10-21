/* Scale Up Softwares — website chatbot.
   Self-contained widget: answers common questions and captures demo requests
   into the same lead store as the website form (POST /api/demo-request).
   No external dependencies. Loaded on public pages only. */
(function () {
  "use strict";
  if (window.__suChatbot) return;
  window.__suChatbot = true;

  var ACCENT = "#0a66e8";
  var EMAIL = "hello@scaleupsoftwares.co.uk";

  var SERVICES = {
    voice: {
      label: "AI Voice Calling Agents",
      page: "ai-voice-agents.html",
      text: "Our <b>AI voice agents</b> answer your phone 24/7, book appointments straight into your diary and send you a summary of every call. You keep your existing number. Plans from <b>£99/month</b>, setup included."
    },
    whatsapp: {
      label: "WhatsApp AI Booking Agents",
      page: "whatsapp-booking-agents.html",
      text: "Our <b>WhatsApp booking agents</b> reply to customers in seconds with your real availability — they book, rebook and get reminders, so no-shows drop. Priced to your business — ask for a quote."
    },
    chatbot: {
      label: "Website Chatbots",
      page: "website-chatbots.html",
      text: "Our <b>website chatbots</b> are trained on your website: they answer visitors day and night, capture their details and book them in-chat. Priced to your business — ask for a quote. (This chat is a small taste of one!)"
    }
  };

  var PRICING_TEXT =
    "Voice agent plans (setup included, rolling monthly, cancel any time):<br>" +
    "• <b>Starter — £99/mo</b>: 200 call minutes (about 70–100 calls), diary booking, call summaries by email<br>" +
    "• <b>Growth — £199/mo</b>: 500 minutes, text confirmations &amp; reminders, urgent-call transfer, monthly report<br>" +
    "• <b>Complete — £349/mo</b>: 1,000 minutes, multiple locations/numbers, priority support<br>" +
    "Annual billing = two months free. WhatsApp agents and chatbots are quoted to your business.";

  /* ---------- styles ---------- */
  var css = [
    ".sucb-btn{position:fixed;right:18px;bottom:18px;z-index:99990;display:flex;align-items:center;gap:9px;background:" + ACCENT + ";color:#fff;border:none;border-radius:999px;padding:13px 18px;font:600 15px/1 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;cursor:pointer;box-shadow:0 8px 24px rgba(6,32,80,.35);transition:transform .15s ease,box-shadow .15s ease}",
    ".sucb-btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(6,32,80,.4)}",
    ".sucb-btn svg{width:22px;height:22px;flex:none}",
    ".sucb-dot{position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#e8a33d;border:2px solid #fff}",
    ".sucb-teaser{position:fixed;right:18px;bottom:84px;z-index:99990;background:#fff;color:#0b1830;border:1px solid #d6deea;border-radius:14px;padding:11px 14px;font:500 14px/1.35 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;box-shadow:0 10px 30px rgba(6,32,80,.22);max-width:250px;cursor:pointer}",
    ".sucb-teaser b{color:" + ACCENT + "}",
    ".sucb-panel{position:fixed;right:18px;bottom:18px;z-index:99991;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100dvh - 36px));background:#fff;border-radius:18px;box-shadow:0 18px 50px rgba(6,32,80,.35);display:none;flex-direction:column;overflow:hidden;font:400 15px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0b1830}",
    ".sucb-panel.open{display:flex}",
    ".sucb-head{background:linear-gradient(135deg,#0a66e8,#0750c0);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:11px}",
    ".sucb-head img{width:36px;height:36px;border-radius:9px;background:#fff;padding:2px}",
    ".sucb-head .t{font-weight:700;font-size:16px;line-height:1.2}",
    ".sucb-head .s{font-size:12.5px;opacity:.9;display:flex;align-items:center;gap:6px}",
    ".sucb-head .s i{width:8px;height:8px;border-radius:50%;background:#37d67a;display:inline-block}",
    ".sucb-x{margin-left:auto;background:rgba(255,255,255,.16);border:none;color:#fff;width:32px;height:32px;border-radius:9px;font-size:17px;cursor:pointer;line-height:1}",
    ".sucb-msgs{flex:1;overflow-y:auto;padding:14px 12px;background:#f5f7fb;display:flex;flex-direction:column;gap:9px}",
    ".sucb-m{max-width:84%;padding:9px 12px;border-radius:14px;word-wrap:break-word;overflow-wrap:anywhere}",
    ".sucb-m.bot{background:#fff;border:1px solid #dfe6f2;border-bottom-left-radius:4px;align-self:flex-start}",
    ".sucb-m.user{background:" + ACCENT + ";color:#fff;border-bottom-right-radius:4px;align-self:flex-end}",
    ".sucb-m a{color:" + ACCENT + ";font-weight:600}",
    ".sucb-m.user a{color:#fff}",
    ".sucb-typing{align-self:flex-start;background:#fff;border:1px solid #dfe6f2;border-radius:14px;padding:11px 14px;display:none;gap:5px}",
    ".sucb-typing span{width:7px;height:7px;border-radius:50%;background:#9db8dd;animation:sucb-b 1s infinite}",
    ".sucb-typing span:nth-child(2){animation-delay:.15s}.sucb-typing span:nth-child(3){animation-delay:.3s}",
    "@keyframes sucb-b{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}",
    ".sucb-chips{display:flex;flex-wrap:wrap;gap:7px;padding:10px 12px 2px;background:#f5f7fb}",
    ".sucb-chip{background:#fff;border:1.5px solid " + ACCENT + ";color:" + ACCENT + ";border-radius:999px;padding:7px 13px;font:600 13.5px/1 system-ui,sans-serif;cursor:pointer}",
    ".sucb-chip:hover{background:" + ACCENT + ";color:#fff}",
    ".sucb-form{display:flex;gap:8px;padding:11px 12px;border-top:1px solid #e3eaf5;background:#fff}",
    ".sucb-in{flex:1;border:1.5px solid #cfd9ea;border-radius:11px;padding:10px 12px;font:400 15px/1.3 system-ui,sans-serif;color:#0b1830;outline:none;min-width:0}",
    ".sucb-in:focus{border-color:" + ACCENT + "}",
    ".sucb-send{background:" + ACCENT + ";color:#fff;border:none;border-radius:11px;padding:0 16px;font:600 15px system-ui,sans-serif;cursor:pointer}",
    ".sucb-note{font-size:11.5px;color:#8494ad;text-align:center;padding:0 12px 9px;background:#fff}",
    "@media (max-width:480px){.sucb-panel{right:8px;bottom:8px;height:calc(100dvh - 16px)}.sucb-btn span.lbl{display:none}.sucb-btn{padding:14px}}"
  ].join("\n");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- dom ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  var btn = el("button", "sucb-btn");
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 20l1.1-5.3A8.5 8.5 0 1 1 21 11.5Z" fill="currentColor" opacity=".25"/><path d="M8 10h8M8 13.5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
    '<span class="lbl">Chat with us</span>';
  var dot = el("span", "sucb-dot");
  btn.appendChild(dot);

  var teaser = el("div", "sucb-teaser", "Questions about our AI agents? <b>Chat with us</b> 👋");
  teaser.style.display = "none";

  var panel = el("section", "sucb-panel");
  panel.setAttribute("aria-label", "Chat with Scale Up Softwares");
  var head = el("div", "sucb-head");
  head.innerHTML =
    '<img src="/logo-mark.png" alt="" width="36" height="36" />' +
    '<div><div class="t">Scale Up Assistant</div><div class="s"><i></i>Online — replies instantly</div></div>';
  var xBtn = el("button", "sucb-x", "✕");
  xBtn.setAttribute("aria-label", "Close chat");
  head.appendChild(xBtn);
  var msgs = el("div", "sucb-msgs");
  var typing = el("div", "sucb-typing", "<span></span><span></span><span></span>");
  var chips = el("div", "sucb-chips");
  var form = el("form", "sucb-form");
  var input = el("input", "sucb-in");
  input.type = "text";
  input.placeholder = "Type your message…";
  input.setAttribute("aria-label", "Type your message");
  input.autocomplete = "off";
  var send = el("button", "sucb-send", "Send");
  send.type = "submit";
  form.appendChild(input);
  form.appendChild(send);
  var note = el("div", "sucb-note", "Demo requests go straight to our team.");
  panel.appendChild(head);
  panel.appendChild(msgs);
  panel.appendChild(typing);
  panel.appendChild(chips);
  panel.appendChild(form);
  panel.appendChild(note);

  document.body.appendChild(btn);
  document.body.appendChild(teaser);
  document.body.appendChild(panel);

  /* ---------- conversation ---------- */
  var lead = {};
  var state = "idle"; // idle | bk_name | bk_business | bk_contact | bk_service
  var greeted = false;

  function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }
  function addMsg(cls, html) {
    var m = el("div", "sucb-m " + cls, html);
    msgs.appendChild(m);
    scrollDown();
    return m;
  }
  function addUser(text) {
    var m = el("div", "sucb-m user");
    m.textContent = text;
    msgs.appendChild(m);
    scrollDown();
  }
  function setChips(list) {
    chips.textContent = "";
    list.forEach(function (c) {
      var b = el("button", "sucb-chip", c.label);
      b.type = "button";
      b.addEventListener("click", function () { handleUserText(c.value || c.label, true); });
      chips.appendChild(b);
    });
  }
  function botSay(html, chipList, delay) {
    typing.style.display = "flex";
    scrollDown();
    setTimeout(function () {
      typing.style.display = "none";
      addMsg("bot", html);
      if (chipList) setChips(chipList);
    }, delay == null ? 550 : delay);
  }

  var MAIN_CHIPS = [
    { label: "Our services" },
    { label: "Pricing" },
    { label: "Book a free demo" },
    { label: "Contact us" }
  ];
  var SERVICE_CHIPS = [
    { label: "AI voice agents", value: "Tell me about AI voice agents" },
    { label: "WhatsApp booking", value: "Tell me about WhatsApp booking agents" },
    { label: "Website chatbots", value: "Tell me about website chatbots" },
    { label: "Book a free demo" }
  ];

  function greet() {
    if (greeted) return;
    greeted = true;
    botSay("Hi there 👋 I'm the Scale Up assistant. I can explain our AI agents, share pricing, or book you a <b>free demo</b> built around your business. What would you like?", MAIN_CHIPS, 300);
  }

  function startBooking() {
    state = "bk_name";
    lead = {};
    setChips([]);
    botSay("Great choice — the demo is free, with no obligation. First, what's your name?");
  }

  function finishBooking() {
    state = "idle";
    setChips([]);
    botSay("Sending your request…", null, 200);
    var payload = {
      name: lead.name || "",
      business: lead.business || "",
      email: lead.email || "",
      phone: lead.phone || "",
      service: lead.service || "",
      message: "Demo requested via the website chatbot.",
      page: "Website chatbot"
    };
    fetch("/api/demo-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (r.ok && d.ok) {
          botSay("Done ✅ Your demo request is in, " + escapeHtml(lead.name.split(" ")[0]) + ". Our team will be in touch shortly to arrange it. Anything else I can help with?", MAIN_CHIPS, 300);
        } else {
          botSay("Hmm, that didn't go through. You can reach us directly at <a href='mailto:" + EMAIL + "'>" + EMAIL + "</a> — sorry about that!", MAIN_CHIPS, 300);
        }
      });
    }).catch(function () {
      botSay("Hmm, that didn't go through. You can reach us directly at <a href='mailto:" + EMAIL + "'>" + EMAIL + "</a>.", MAIN_CHIPS, 300);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function handleBooking(text) {
    var t = text.trim();
    if (state === "bk_name") {
      if (t.length < 2) { botSay("Sorry, I didn't catch that — what's your name?"); return; }
      lead.name = t.slice(0, 80);
      state = "bk_business";
      botSay("Nice to meet you, " + escapeHtml(lead.name.split(" ")[0]) + "! What's your business called?");
      return;
    }
    if (state === "bk_business") {
      if (t.length < 2) { botSay("And your business name?"); return; }
      lead.business = t.slice(0, 120);
      state = "bk_contact";
      botSay("Thanks. What's the best way to reach you — an email address or a phone number?");
      return;
    }
    if (state === "bk_contact") {
      var emailM = t.match(/[^\s@]+@[^\s@]+\.[^\s@]{2,}/);
      var digits = t.replace(/\D/g, "");
      if (emailM) lead.email = emailM[0];
      else if (digits.length >= 7) lead.phone = t.slice(0, 40);
      else { botSay("I need an email address or a phone number so we can arrange your demo — could you share one?"); return; }
      state = "bk_service";
      botSay("Last one — which are you most interested in?", [
        { label: "AI voice agents", value: "__svc:AI Voice Calling Agents" },
        { label: "WhatsApp booking", value: "__svc:WhatsApp AI Booking Agents" },
        { label: "Website chatbot", value: "__svc:Website Chatbots" },
        { label: "Not sure yet", value: "__svc:More than one / not sure yet" }
      ]);
      return;
    }
  }

  function answer(text) {
    var t = " " + text.toLowerCase() + " ";
    function has() {
      for (var i = 0; i < arguments.length; i++) if (t.indexOf(arguments[i]) !== -1) return true;
      return false;
    }
    if (has("book a free demo", "book a demo", "free demo", " book ", "demo")) { startBooking(); return; }
    if (has("price", "pricing", "cost", "how much", "£", "plan")) {
      botSay(PRICING_TEXT + "<br><br>Want the full breakdown? See the <a href='ai-voice-agents.html#pricing'>voice agent pricing</a>, or I can book you a free demo.", [
        { label: "Book a free demo" }, { label: "Our services" }, { label: "Contact us" }
      ]);
      return;
    }
    if (has("whatsapp")) {
      botSay(SERVICES.whatsapp.text + " <a href='" + SERVICES.whatsapp.page + "'>See how it works →</a>", SERVICE_CHIPS);
      return;
    }
    if (has("voice", "call", "phone", "receptionist", "telephone")) {
      botSay(SERVICES.voice.text + " <a href='" + SERVICES.voice.page + "'>See how it works →</a>", SERVICE_CHIPS);
      return;
    }
    if (has("chatbot", "chat bot", "live chat", "website chat")) {
      botSay(SERVICES.chatbot.text + " <a href='" + SERVICES.chatbot.page + "'>See how it works →</a>", SERVICE_CHIPS);
      return;
    }
    if (has("service", "what do you do", "what do you offer", "offer")) {
      botSay("We build AI agents that act as your front desk:<br>📞 <b>AI voice agents</b> — answer calls &amp; book appointments<br>💬 <b>WhatsApp booking agents</b> — instant replies &amp; bookings<br>🤖 <b>Website chatbots</b> — like this one, on your site<br>Which would you like to know more about?", SERVICE_CHIPS);
      return;
    }
    if (has("contact", "human", "person", "talk to", "speak", "email", "number")) {
      botSay("You can reach our team at <a href='mailto:" + EMAIL + "'>" + EMAIL + "</a>. Or book a free demo here and we'll come to you.", MAIN_CHIPS);
      return;
    }
    if (has("how does it work", "how it works", "setup", "set up", "install", "get started")) {
      botSay("It's simple: tell us about your business, we train your agent on your services, prices and rules, connect it to your number/diary, and test it with you before it goes live. Setup is included in every plan, and there's no long contract — rolling monthly, cancel any time.", [
        { label: "Book a free demo" }, { label: "Pricing" }, { label: "Our services" }
      ]);
      return;
    }
    if (has("contract", "cancel", "tie", "commit")) {
      botSay("No long contract — all plans are rolling monthly and you can cancel any time. Annual billing is available too and gives you two months free.", MAIN_CHIPS);
      return;
    }
    if (has("24/7", "24 7", "hours", "night", "weekend", "always")) {
      botSay("Yes — our agents work 24/7, including nights, weekends and holidays, so you never miss a customer. You can also choose business-hours-only cover if you prefer.", MAIN_CHIPS);
      return;
    }
    if (has("dental", "dentist", "clinic", "salon", "estate", "restaurant", "aesthetic", "school")) {
      botSay("We work with exactly those kinds of businesses — dental clinics, aesthetics, salons, estate agents, restaurants and more. The agent is trained on <i>your</i> services, prices and rules. Want a free demo built around your business?", [
        { label: "Book a free demo" }, { label: "Our services" }, { label: "Pricing" }
      ]);
      return;
    }
    if (has("hello", "hi", "hey", "salam", "assalam")) {
      botSay("Hello! 👋 I can explain our services, share pricing, or book you a free demo. What are you looking for?", MAIN_CHIPS);
      return;
    }
    if (has("thank", "great", "perfect", "awesome")) {
      botSay("You're welcome! Anything else — services, pricing, or shall I book that demo?", MAIN_CHIPS);
      return;
    }
    if (has("bye")) { botSay("Thanks for stopping by! If you'd like a free demo later, you know where to find me. 👋", MAIN_CHIPS); return; }
    botSay("I can help with our <b>services</b>, <b>pricing</b>, or booking a <b>free demo</b>. For anything else, our team is at <a href='mailto:" + EMAIL + "'>" + EMAIL + "</a>. What would you like?", MAIN_CHIPS);
  }

  function handleUserText(text, fromChip) {
    if (!text) return;
    if (text.indexOf("__svc:") === 0) {
      lead.service = text.slice(6);
      addUser(lead.service);
      finishBooking();
      return;
    }
    addUser(text);
    if (!fromChip) input.value = "";
    if (state !== "idle") { handleBooking(text); return; }
    var low = text.toLowerCase();
    if (low.indexOf("tell me about") === 0) { answer(text); return; }
    answer(text);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    handleUserText(v, false);
  });

  /* ---------- open/close ---------- */
  var opened = false;
  function openChat() {
    panel.classList.add("open");
    btn.style.display = "none";
    teaser.style.display = "none";
    dot.style.display = "none";
    opened = true;
    greet();
    setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) {} }, 350);
  }
  function closeChat() {
    panel.classList.remove("open");
    btn.style.display = "flex";
  }
  btn.addEventListener("click", openChat);
  teaser.addEventListener("click", openChat);
  xBtn.addEventListener("click", closeChat);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && opened) closeChat(); });

  // one gentle teaser per session
  try {
    if (!sessionStorage.getItem("sucb_teased")) {
      setTimeout(function () {
        if (!opened) { teaser.style.display = "block"; sessionStorage.setItem("sucb_teased", "1"); }
      }, 7000);
      setTimeout(function () { teaser.style.display = "none"; }, 22000);
    }
  } catch (e) {}
})();
