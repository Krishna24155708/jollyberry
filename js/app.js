/* ===== Jollyberry – application logic ===== */
(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const STORE_KEY = "jollyberry-registrations";
  const THEME_KEY = "jollyberry-theme";
  const inr = (n) => (n === 0 ? "Free" : "₹" + n.toLocaleString("en-IN"));
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Resolve each event's actual Date (always in the future, relative to today)
  EVENTS.forEach((e) => {
    const d = new Date();
    d.setDate(d.getDate() + e.daysFromNow);
    const [h, m] = e.time.split(":").map(Number);
    d.setHours(h, m, 0, 0);
    e.date = d;
  });
  const byId = (id) => EVENTS.find((e) => e.id === id);
  const catOf = (id) => CATEGORIES.find((c) => c.id === id);
  const fmtDate = (d) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const fmtTime = (d) => d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

  /* ---------- Local Storage ---------- */
  function loadRegs() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function saveRegs(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
  }
  let registrations = loadRegs();
  const seatsLeft = (ev) => Math.max(0, ev.seats - registrations.filter((r) => r.eventId === ev.id).reduce((n, r) => n + r.tickets, 0));

  /* ---------- State ---------- */
  const state = { query: "", category: "all", sort: "date" };

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
  }

  /* ---------- Theme ---------- */
  $("#theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menu-toggle"), menu = $("#nav-menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  $$(".nav-link", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Cards ---------- */
  function cardHTML(ev, i) {
    const left = seatsLeft(ev);
    const cat = catOf(ev.category);
    const soldOut = left === 0;
    return `
    <article class="card" style="animation-delay:${Math.min(i, 8) * 50}ms">
      <div class="card-img">
        <img src="${ev.image}" alt="${esc(ev.title)}" loading="lazy" onerror="this.style.display='none'" />
        <span class="tag card-tag">${cat.emoji} ${cat.label}</span>
        <div class="date-badge"><b>${ev.date.getDate()}</b><small>${ev.date.toLocaleDateString("en-IN", { month: "short" })}</small></div>
      </div>
      <div class="card-body">
        <h3>${esc(ev.title)}</h3>
        <div class="card-meta">
          <span>📍 ${esc(ev.venue)}, ${esc(ev.city)}</span>
          <span>🕒 ${fmtDate(ev.date)} · ${fmtTime(ev.date)}</span>
        </div>
        <p class="card-desc">${esc(ev.short)}</p>
        ${left > 0 && left <= 20 ? `<span class="low-seats">Only ${left} seats left!</span>` : ""}
        <div class="card-foot">
          <span class="price">${inr(ev.price)}</span>
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm" data-details="${ev.id}">Details</button>
            <button class="btn btn-primary btn-sm" data-register="${ev.id}" ${soldOut ? "disabled" : ""}>${soldOut ? "Sold out" : "Register"}</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function renderFeatured() {
    $("#featured-grid").innerHTML = EVENTS.filter((e) => e.featured).map(cardHTML).join("");
  }

  function filtered() {
    const q = state.query.trim().toLowerCase();
    let list = EVENTS.filter((e) => {
      const matchCat = state.category === "all" || e.category === state.category;
      const hay = (e.title + " " + e.venue + " " + e.city + " " + e.short + " " + catOf(e.category).label).toLowerCase();
      return matchCat && (!q || hay.includes(q));
    });
    const sorters = {
      date: (a, b) => a.date - b.date,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      name: (a, b) => a.title.localeCompare(b.title)
    };
    return list.sort(sorters[state.sort]);
  }

  function renderGrid() {
    const list = filtered();
    $("#events-grid").innerHTML = list.map(cardHTML).join("");
    $("#empty").hidden = list.length > 0;
    $("#result-count").textContent = `Showing ${list.length} of ${EVENTS.length} events`;
  }

  function renderChips() {
    const all = [{ id: "all", label: "All", emoji: "✨" }].concat(CATEGORIES);
    $("#chips").innerHTML = all.map((c) =>
      `<button class="chip ${state.category === c.id ? "active" : ""}" data-cat="${c.id}" aria-pressed="${state.category === c.id}">${c.emoji} ${c.label}</button>`).join("");
  }

  function resetFilters() {
    state.query = ""; state.category = "all"; state.sort = "date";
    $("#search").value = ""; $("#sort").value = "date";
    renderChips(); renderGrid();
  }

  let searchTimer;
  $("#search").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.query = e.target.value; renderGrid(); }, 150);
  });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    state.category = b.dataset.cat;
    renderChips(); renderGrid();
  });
  $("#reset-filters").addEventListener("click", resetFilters);

  // Delegated card buttons (featured + grid)
  document.addEventListener("click", (e) => {
    const d = e.target.closest("[data-details]");
    if (d) return openModal(d.dataset.details);
    const r = e.target.closest("[data-register]");
    if (r) return goRegister(r.dataset.register);
  });

  /* ---------- Countdown ---------- */
  function countdownParts(target) {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff %= 864e5;
    const h = Math.floor(diff / 36e5); diff %= 36e5;
    const m = Math.floor(diff / 6e4);
    const s = Math.floor((diff % 6e4) / 1000);
    return { d, h, m, s };
  }
  function paintCountdown(root, target) {
    const p = countdownParts(target);
    Object.keys(p).forEach((k) => { const el = $(`[data-unit="${k}"]`, root); if (el) el.textContent = pad(p[k]); });
  }

  const nextEvent = EVENTS.slice().sort((a, b) => a.date - b.date)[0];
  function renderNext() {
    $("#next-title").textContent = nextEvent.title;
    $("#next-meta").textContent = `${fmtDate(nextEvent.date)} · ${nextEvent.venue}`;
    $("#next-btn").addEventListener("click", () => openModal(nextEvent.id));
  }

  let modalEvent = null;
  setInterval(() => {
    paintCountdown($("#hero-countdown"), nextEvent.date);
    if (modalEvent) paintCountdown($("#modal-countdown"), modalEvent.date);
  }, 1000);
  paintCountdown($("#hero-countdown"), nextEvent.date);

  /* ---------- Modal ---------- */
  const modal = $("#modal");
  let lastFocus = null;

  function openModal(id) {
    const ev = byId(id);
    if (!ev) return;
    modalEvent = ev;
    lastFocus = document.activeElement;
    const left = seatsLeft(ev);
    const cat = catOf(ev.category);
    $("#modal-hero").innerHTML = `<img src="${ev.image}" alt="${esc(ev.title)}" onerror="this.style.display='none'" />`;
    $("#modal-cat").textContent = `${cat.emoji} ${cat.label}`;
    const seats = $("#modal-seats");
    seats.textContent = left === 0 ? "Sold out" : `${left} seats available`;
    seats.classList.toggle("low", left <= 20);
    $("#modal-title").textContent = ev.title;
    $("#modal-meta").innerHTML = `
      <li>📅 ${fmtDate(ev.date)}</li><li>🕒 ${fmtTime(ev.date)}</li>
      <li>📍 ${esc(ev.venue)}</li><li>🏙️ ${esc(ev.city)}</li>`;
    $("#modal-desc").textContent = ev.description;
    $("#modal-agenda").innerHTML = ev.agenda.map((a) => `<li>${esc(a)}</li>`).join("");
    $("#modal-price").textContent = inr(ev.price);
    const btn = $("#modal-register");
    btn.disabled = left === 0;
    btn.textContent = left === 0 ? "Sold out" : "Register for this event";
    paintCountdown($("#modal-countdown"), ev.date);
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    $(".modal-close", modal).focus();
  }
  function closeModal() {
    modal.hidden = true;
    modalEvent = null;
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  $("#modal-register").addEventListener("click", () => { const id = modalEvent.id; closeModal(); goRegister(id); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
    // Basic focus trap inside the dialog
    if (e.key === "Tab" && !modal.hidden) {
      const f = $$("button:not([disabled])", modal);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Registration form ---------- */
  const form = $("#reg-form");
  const fields = { name: $("#name"), email: $("#email"), phone: $("#phone"), event: $("#event") };

  function fillEventSelect() {
    const cur = fields.event.value;
    fields.event.innerHTML = `<option value="">Choose an event…</option>` +
      EVENTS.slice().sort((a, b) => a.date - b.date).map((e) => {
        const left = seatsLeft(e);
        return `<option value="${e.id}" ${left === 0 ? "disabled" : ""}>${esc(e.title)} — ${fmtDate(e.date)}${left === 0 ? " (sold out)" : ""}</option>`;
      }).join("");
    fields.event.value = cur;
  }

  const validators = {
    name(v) {
      v = v.trim();
      if (!v) return "Please enter your full name.";
      if (v.length < 3) return "Name must be at least 3 characters.";
      if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v)) return "Use letters, spaces, dots, hyphens or apostrophes only.";
      return "";
    },
    email(v) {
      v = v.trim();
      if (!v) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v)) return "Enter a valid email, e.g. you@example.com.";
      return "";
    },
    phone(v) {
      const digits = v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
      if (!v.trim()) return "Please enter your phone number.";
      if (!/^\d+$/.test(digits)) return "Phone number can only contain digits.";
      if (!/^[6-9]\d{9}$/.test(digits)) return "Enter a valid 10-digit mobile number starting with 6–9.";
      return "";
    },
    event(v) {
      if (!v) return "Please select an event.";
      return "";
    }
  };

  function validateField(key) {
    const input = fields[key];
    const msg = validators[key](input.value);
    $(`#${key}-error`).textContent = msg;
    input.classList.toggle("invalid", !!msg);
    input.classList.toggle("valid", !msg && input.value !== "");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  Object.keys(fields).forEach((k) => {
    fields[k].addEventListener("blur", () => validateField(k));
    fields[k].addEventListener("input", () => { if (fields[k].classList.contains("invalid")) validateField(k); });
  });
  // Restrict phone input to digits and common separators
  fields.phone.addEventListener("input", () => { fields.phone.value = fields.phone.value.replace(/[^\d+\s-]/g, ""); });

  function updateTotal() {
    const ev = byId(fields.event.value);
    const qty = Number($("#tickets").value);
    $("#total").textContent = ev ? inr(ev.price * qty) : "₹0";
    const prev = $("#selected-preview");
    if (ev) {
      prev.hidden = false;
      prev.innerHTML = `<img src="${ev.image}" alt="" onerror="this.style.display='none'" /><div><strong>${esc(ev.title)}</strong><span class="muted small">${fmtDate(ev.date)} · ${esc(ev.venue)}</span></div>`;
    } else prev.hidden = true;
  }
  fields.event.addEventListener("change", updateTotal);
  $("#tickets").addEventListener("change", updateTotal);

  function goRegister(id) {
    showForm();
    fields.event.value = id;
    validateField("event");
    updateTotal();
    $("#register").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => fields.name.focus({ preventScroll: true }), 600);
  }

  function showForm() { form.hidden = false; $("#success").hidden = true; }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = Object.keys(fields).map(validateField).every(Boolean);
    if (!ok) {
      const firstBad = Object.values(fields).find((f) => f.classList.contains("invalid"));
      if (firstBad) firstBad.focus();
      toast("Please fix the highlighted fields.");
      return;
    }
    const ev = byId(fields.event.value);
    const qty = Number($("#tickets").value);
    if (qty > seatsLeft(ev)) {
      $("#event-error").textContent = `Only ${seatsLeft(ev)} seat(s) left for this event.`;
      fields.event.classList.add("invalid");
      return;
    }
    const reg = {
      id: "JB-" + Date.now().toString(36).toUpperCase().slice(-6),
      eventId: ev.id, eventTitle: ev.title, eventDate: ev.date.toISOString(),
      name: fields.name.value.trim(), email: fields.email.value.trim(),
      phone: fields.phone.value.trim(), tickets: qty, total: ev.price * qty,
      createdAt: new Date().toISOString()
    };
    registrations.push(reg);
    saveRegs(registrations);

    $("#success-name").textContent = reg.name.split(" ")[0];
    $("#success-event").textContent = ev.title;
    $("#success-id").textContent = reg.id;
    $("#success-tickets").textContent = qty;
    $("#success-email").textContent = reg.email;
    form.hidden = true;
    const s = $("#success");
    s.hidden = false;
    s.focus();
    refreshAll();
    toast("Registration confirmed! 🎉");
  });

  $("#register-another").addEventListener("click", () => {
    form.reset();
    Object.values(fields).forEach((f) => { f.classList.remove("valid", "invalid"); f.removeAttribute("aria-invalid"); });
    $$(".error", form).forEach((x) => (x.textContent = ""));
    updateTotal();
    showForm();
    fields.name.focus();
  });

  /* ---------- My Tickets ---------- */
  function renderTickets() {
    const list = $("#ticket-list");
    $("#no-tickets").hidden = registrations.length > 0;
    list.innerHTML = registrations.slice().reverse().map((r) => `
      <article class="ticket">
        <span class="tag">${esc(catOf((byId(r.eventId) || {}).category || "tech").label)}</span>
        <h3>${esc(r.eventTitle)}</h3>
        <p>📅 ${fmtDate(new Date(r.eventDate))}</p>
        <p>👤 ${esc(r.name)} · 🎟️ ${r.tickets} ticket${r.tickets > 1 ? "s" : ""} · ${inr(r.total)}</p>
        <p>Booking ID: <span class="id">${esc(r.id)}</span></p>
        <button class="btn btn-ghost btn-sm" data-cancel="${esc(r.id)}">Cancel registration</button>
      </article>`).join("");
    const badge = $("#ticket-count");
    badge.hidden = registrations.length === 0;
    badge.textContent = registrations.length;
  }
  $("#ticket-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cancel]");
    if (!b) return;
    if (!confirm("Cancel this registration?")) return;
    registrations = registrations.filter((r) => r.id !== b.dataset.cancel);
    saveRegs(registrations);
    refreshAll();
    toast("Registration cancelled.");
  });

  function refreshAll() {
    renderFeatured(); renderGrid(); fillEventSelect(); renderTickets(); updateTotal();
  }

  /* ---------- Scroll effects ---------- */
  const toTop = $("#to-top");
  const navLinks = $$(".nav-link");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  window.addEventListener("scroll", () => {
    toTop.hidden = window.scrollY < 600;
    const y = window.scrollY + 140;
    let current = sections[0];
    sections.forEach((s) => { if (s.offsetTop <= y) current = s; });
    navLinks.forEach((a) => a.classList.toggle("active", current && a.getAttribute("href") === "#" + current.id));
  }, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Reveal on scroll
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 }) : null;
  $$(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  // Animated stat counters
  function runCounters() {
    $$("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count), suffix = el.dataset.suffix || "";
      const start = performance.now(), dur = 1400;
      (function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN") + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  renderNext();
  renderChips();
  refreshAll();
  runCounters();
})();
