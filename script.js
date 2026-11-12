/* ==========================================================
   BlessingDevs: edit the CONFIG and data arrays below.
   Everything on the page is built from these.
   ========================================================== */

const CONFIG = {
  whatsapp: "27794453042",
  email: "blessingmuthivhi39@gmail.com",

  // PayFast: fill these in once your PayFast account is open.
  // Leave merchantId / merchantKey empty and the Subscribe buttons
  // will send you a WhatsApp message instead.
  payfast: {
    sandbox: false,               // set to false when you go live
    merchantId: "35515073",              // from PayFast dashboard > Settings > Integration
    merchantKey: "ywbybburhoyco",
    returnUrl: "https://blessing-dev-solutions-sxcb.vercel.app/#plans",
    cancelUrl: "https://blessing-dev-solutions-sxcb.vercel.app/#plans",
    notifyUrl: ""                // optional: your server URL that receives payment notifications
  }
};

// Screenshots are fetched automatically from each live site.
// To use your own screenshot, add  image: "images/work/yourfile.jpg"


const PROJECTS = [
  { name: "Concepto Ink Tattoos", domain: "concepto-ink.com", category: "Tattoo", note: "Tattoo studio website", image: "images/work/concepto-ink-tattoos.jpeg" },

  { name: "Rabie Ridge Tattoos", domain: "rabi-ridge-tattoos.co.za", category: "Tattoo", note: "Tattoo studio website", image: "images/work/rabie-ridge-tattoos.jpeg" },

  { name: "Gin Tattoos", domain: "gin-tattoos.co.za", category: "Tattoo", note: "Tattoo studio website", image: "images/work/gin-tattoos.jpeg" },

  { name: "Tribal Tattoo Garden", domain: "tribal-tattoo-garden.online", category: "Tattoo", note: "Tattoo studio website", image: "images/work/tribal-tattoo-garden.jpeg" },

  { name: "Beauty Spa Potch", domain: "beautyspapotch.co.za", category: "Spa", note: "Luxury spa with service tabs and booking", image: "images/work/beauty-spa-potch.jpeg" },

  { name: "Glow With IV", domain: "glowwithiv.co.za", category: "Spa", note: "Spa and wellness website", image: "images/work/glow-with-iv.jpeg" },

  { name: "Women in Wellness Spa", domain: "womeninwellspa.co.za", category: "Spa", note: "Spa and wellness website", image: "images/work/women-in-wellness-spa.jpeg" },

  { name: "Grace View Preschool", domain: "graceviewpreschool.online", category: "School", note: "Preschool website for parents", image: "images/work/grace-view-preschool.jpeg" },

  { name: "Decentral Projects", domain: "decentralprojects.online", category: "Construction", note: "Construction company website", image: "images/work/decentral-projects.jpeg" },

  { name: "Clement The Barber", domain: "clementthebarber.co.za", category: "Barber", note: "Barbershop website", image: "images/work/clement-the-barber.jpeg" },

    { name: "The Shift Barber Shop", domain: "theshiftbarbershop.co.za", category: "Barber", note: "Barbershop website", image: "images/work/shift.jpeg" },

    { name: "Eco Spa Wellness", domain: "eco-spa-eight.vercel.app", category: "Spa", note: "Spa website", image: "images/work/eco-spa.jpeg" },

    { name: "ThembeLihle Pre School", domain: "thembelihle-daycare.vercel.app", category: "School", note: "Preschool website for parents", image: "images/work/thembe.jpeg" },

    { name: "Mc Squared", domain: "mc2-pre-school.vercel.app", category: "School", note: "Preschool website for parents", image: "images/work/mc2.jpeg" },
];



const SERVICES = [
  { title: "Custom design", text: "A look built around your business and your customers, not a template you'll see on a hundred other sites.", icon: "M12 3l2.5 5.5L20 9.5l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1z" },
  { title: "Works on every phone", text: "Most of your customers will visit on mobile, so every page is built phone-first and tested on small screens.", icon: "M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zM11 18h2" },
  { title: "Domain and hosting", text: "I register or connect your domain, set up the DNS and host your site on Vercel so it loads fast.", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 4.5 6.5 4.5 10S15 19 12 22c-3-3-4.5-6.5-4.5-10S9 5 12 2z" },
  { title: "Found on Google", text: "On-page SEO and Google Search Console setup so people searching for your service can find you.", icon: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5" },
  { title: "WhatsApp booking", text: "Customers tap a button and send you their booking or order details straight to WhatsApp.", icon: "M21 12a8.5 8.5 0 01-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1121 12z" },
  { title: "PayFast payments", text: "Take booking fees, deposits and payments online with PayFast, paid straight into your account.", icon: "M3 7h18v12H3zM3 11h18M7 15h3" }
];

const PACKAGES = [
  {
    name: "Landing page", price: "R500 to R1,000", unit: "once-off",
    desc: "A single, polished page that tells people who you are and how to contact you.",
    features: ["One-page responsive design", "Services, gallery and contact sections", "WhatsApp and call buttons", "Domain connection and hosting setup", "Basic on-page SEO", "Delivered in about a week"]
  },
  {
    name: "Booking and payments", price: "R1,000 to R1,500", unit: "once-off", featured: true, badge: "Most chosen",
    desc: "A multi-section website where customers can book or pay you online.",
    features: ["Everything in Landing page", "PayFast payment integration", "Booking fees and deposits", "Service tabs and packages", "Photo gallery", "Google Search Console indexing", "Contact form and WhatsApp booking"]
  },
  {
    name: "Full-stack website", price: "From R2,000", unit: "minimum",
    desc: "A complete web app with a dashboard so you can manage your site yourself.",
    features: ["Everything in Booking and payments", "Admin dashboard to manage content", "Database for bookings, products or clients", "Secure login for you and your team", "Custom features built to your needs", "Training on how to use your dashboard"]
  }
];

const PLANS = [
  {
    id: "basic", name: "Basic", amount: 109,
    desc: "Keep your site online and up to date.",
    features: ["Basic SEO", "3 revisions every month", "Website maintenance", "Hosting and domain support", "Support on WhatsApp"]
  },
  {
    id: "growth", name: "Growth", amount: 199, featured: true, badge: "Best value",
    desc: "Stronger SEO and more changes each month.",
    features: ["Everything in Basic", "Stronger SEO with keyword updates", "7 revisions every month", "Google Search Console monitoring", "Speed checks and fixes", "Monthly progress summary"]
  },
  {
    id: "premium", name: "Premium", amount: 299,
    desc: "Everything in Growth, with priority attention.",
    features: ["Everything in Growth", "Advanced SEO and Google Business Profile help", "Unlimited revisions (fair use)", "Priority replies on WhatsApp", "New sections and pages added as you grow", "Security checks and backups", "Content and photo updates"]
  }
];

const STEPS = [
  { title: "You tell me what you need", text: "We chat on WhatsApp about your business, your customers and what the site must do. You get a fixed quote." },
  { title: "I design and build", text: "I build your site and send you a private link so you can review it and ask for changes before it goes live." },
  { title: "We launch", text: "I connect your domain, set up hosting and submit the site to Google so it can start appearing in search." },
  { title: "We keep it growing", text: "Join a monthly plan and I'll keep your site updated, secure and improving as your business grows." }
];

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rand = n => n.toLocaleString("en-ZA");
const wa = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const shot = p => p.image || `https://image.thum.io/get/width/900/crop/600/https://${p.domain}`;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 3800);
}

/* ---------- work grid + filters ---------- */
const CATEGORY_LABEL = { Tattoo: "Tattoo studios", Spa: "Spas", School: "Schools", Construction: "Construction", Barber: "Barbers" };
let activeFilter = "All";

function renderFilters() {
  const cats = ["All", ...new Set(PROJECTS.map(p => p.category))];
  $("#filters").innerHTML = cats.map(c => {
    const n = c === "All" ? PROJECTS.length : PROJECTS.filter(p => p.category === c).length;
    return `<button class="filter" role="tab" aria-selected="${c === activeFilter}" data-cat="${c}">${c === "All" ? "All work" : CATEGORY_LABEL[c] || c}<span>${n}</span></button>`;
  }).join("");
}

function renderWork() {
  $("#workGrid").innerHTML = PROJECTS.map((p, i) => `
    <a class="work-card reveal" style="--d:${(i % 3) * 70}ms" href="https://${p.domain}" target="_blank" rel="noopener" data-cat="${p.category}" aria-label="Open ${p.name} (${p.domain})">
      <div class="thumb">
        <img src="${shot(p)}" alt="Screenshot of ${p.name}" loading="lazy" width="900" height="600">
      </div>
      <div class="work-body">
        <div><h3>${p.name}</h3><p>${p.domain}</p></div>
        <span class="tag">${p.category}</span>
      </div>
    </a>`).join("");

  // If a screenshot fails to load, show a branded placeholder instead
  $$("#workGrid .thumb img").forEach((img, i) => {
    img.addEventListener("error", () => {
      img.remove();
      const div = document.createElement("div");
      div.className = "thumb-fallback";
      div.textContent = PROJECTS[i].name;
      img.parentElement.appendChild(div);
    });
  });
  observeReveals();
}

function applyFilter() {
  $$(".work-card").forEach(c => { c.hidden = activeFilter !== "All" && c.dataset.cat !== activeFilter; });
  $$(".filter").forEach(b => b.setAttribute("aria-selected", b.dataset.cat === activeFilter));
}

$("#filters").addEventListener("click", e => {
  const b = e.target.closest(".filter");
  if (!b) return;
  activeFilter = b.dataset.cat;
  applyFilter();
});

/* ---------- services, packages, plans, steps ---------- */
function renderServices() {
  $("#servicesGrid").innerHTML = SERVICES.map((s, i) => `
    <article class="service reveal" style="--d:${(i % 3) * 70}ms">
      <div class="service-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${s.icon}"/></svg></div>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
    </article>`).join("");
}

function featureList(list) {
  return `<ul class="features">${list.map(f => `<li>${f}</li>`).join("")}</ul>`;
}

function renderPackages() {
  $("#packagesGrid").innerHTML = PACKAGES.map((p, i) => `
    <article class="price-card reveal ${p.featured ? "featured" : ""}" style="--d:${i * 80}ms">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      <h3>${p.name}</h3>
      <p class="price-desc">${p.desc}</p>
      <div class="price">${p.price}<small>${p.unit}</small></div>
      ${featureList(p.features)}
      <button class="btn ${p.featured ? "btn-primary" : "btn-ghost"} btn-block" data-quote="${p.name}">Request this package</button>
    </article>`).join("");

  $("#contactPackage").innerHTML =
    `<option>Not sure yet</option>` +
    PACKAGES.map(p => `<option>${p.name} (${p.price})</option>`).join("") +
    PLANS.map(p => `<option>${p.name} plan (R${p.amount}/month)</option>`).join("");
}

function renderPlans() {
  $("#plansGrid").innerHTML = PLANS.map((p, i) => `
    <article class="price-card reveal ${p.featured ? "featured" : ""}" style="--d:${i * 80}ms">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      <h3>${p.name}</h3>
      <p class="price-desc">${p.desc}</p>
      <div class="price">R${rand(p.amount)}<small>per month</small></div>
      ${featureList(p.features)}
      <button class="btn ${p.featured ? "btn-primary" : "btn-ghost"} btn-block" data-plan="${p.id}">Subscribe with PayFast</button>
    </article>`).join("");
}

function renderSteps() {
  $("#steps").innerHTML = STEPS.map(s => `<li class="step reveal"><h3>${s.title}</h3><p>${s.text}</p></li>`).join("");
}

/* ---------- package quote buttons -> contact form ---------- */
document.addEventListener("click", e => {
  const q = e.target.closest("[data-quote]");
  if (!q) return;
  const sel = $("#contactPackage");
  const match = [...sel.options].find(o => o.textContent.startsWith(q.dataset.quote));
  if (match) sel.value = match.textContent;
  $("#contact").scrollIntoView({ behavior: "smooth" });
});

/* ---------- PayFast subscription ---------- */
const dialog = $("#subDialog");
let selectedPlan = null;

document.addEventListener("click", e => {
  const b = e.target.closest("[data-plan]");
  if (!b) return;
  selectedPlan = PLANS.find(p => p.id === b.dataset.plan);
  $("#subTitle").textContent = `${selectedPlan.name} plan`;
  $("#subSummary").textContent = `R${rand(selectedPlan.amount)} per month, billed through PayFast. Cancel any time.`;
  $("#subError").hidden = true;
  dialog.showModal();
});

dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });

$("#subForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  const name = f.name.value.trim();
  const email = f.email.value.trim();
  const site = f.site.value.trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) { $("#subError").hidden = false; return; }
  $("#subError").hidden = true;

  const pf = CONFIG.payfast;

  // PayFast not set up yet: send the request to WhatsApp instead
  if (!pf.merchantId || !pf.merchantKey) {
    window.open(wa(`Hi Blessing, I'd like to subscribe to the ${selectedPlan.name} plan (R${selectedPlan.amount}/month).\nName: ${name}\nEmail: ${email}\nWebsite: ${site || "not yet"}`), "_blank");
    dialog.close();
    toast("Opening WhatsApp so we can set up your plan.");
    return;
  }

  // Build a PayFast recurring-billing form and submit it
  const fields = {
    merchant_id: pf.merchantId,
    merchant_key: pf.merchantKey,
    return_url: pf.returnUrl,
    cancel_url: pf.cancelUrl,
    notify_url: pf.notifyUrl,
    name_first: name,
    email_address: email,
    m_payment_id: `${selectedPlan.id}-${Date.now()}`,
    amount: selectedPlan.amount.toFixed(2),
    item_name: `BlessingDevs ${selectedPlan.name} plan`,
    custom_str1: site,
    subscription_type: "1",
    recurring_amount: selectedPlan.amount.toFixed(2),
    frequency: "3",   // 3 = monthly
    cycles: "0"       // 0 = until cancelled
  };
  // NOTE: if you set a passphrase on your PayFast account, PayFast also needs a
  // "signature" field. That must be created on a server (never in the browser).

  const form = document.createElement("form");
  form.method = "POST";
  form.action = pf.sandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process";
  Object.entries(fields).forEach(([k, v]) => {
    if (!v) return;
    const i = document.createElement("input");
    i.type = "hidden"; i.name = k; i.value = v;
    form.appendChild(i);
  });
  document.body.appendChild(form);
  form.submit();
});

/* ---------- contact form -> WhatsApp ---------- */
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  const name = f.name.value.trim();
  if (!name) { $("#formError").hidden = false; f.name.focus(); return; }
  $("#formError").hidden = true;
  const text = `Hi Blessing, my name is ${name}.\nBusiness type: ${f.industry.value}\nInterested in: ${f.package.value}\n\n${f.message.value.trim() || "I'd like to chat about a website."}`;
  window.open(wa(text), "_blank");
  toast("Opening WhatsApp with your message.");
});

/* ---------- hero: rotating browser + tilt ---------- */
(function hero() {
  const img = $("#heroShot"), url = $("#heroUrl"), cat = $("#heroCat"), fb = $("#heroFallback");
  const labels = { Tattoo: "Tattoo studio", Spa: "Spa and wellness", School: "School", Construction: "Construction company", Barber: "Barbershop" };
  let i = 0;

  function show(p) {
    img.classList.add("swap");
    setTimeout(() => {
      fb.hidden = true;
      img.hidden = false;
      img.src = shot(p);
      img.alt = `Screenshot of ${p.name}`;
      url.textContent = p.domain;
      cat.textContent = labels[p.category] || p.category;
      fb.textContent = p.name;
    }, 350);
  }
  img.addEventListener("load", () => img.classList.remove("swap"));
  img.addEventListener("error", () => { img.hidden = true; fb.hidden = false; });

  img.src = shot(PROJECTS[0]);
  fb.textContent = PROJECTS[0].name;
  cat.textContent = labels[PROJECTS[0].category];
  url.textContent = PROJECTS[0].domain;

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => { i = (i + 1) % PROJECTS.length; show(PROJECTS[i]); }, 4200);
  }

  // Mouse tilt on the browser window, plus the red glow following the pointer
  const wrap = $("#tilt"), blob = $(".blob-red");
  if (matchMedia("(hover: hover)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    wrap.addEventListener("pointermove", ev => {
      const r = wrap.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      wrap.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
      wrap.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
    });
    wrap.addEventListener("pointerleave", () => {
      wrap.style.setProperty("--rx", "4deg");
      wrap.style.setProperty("--ry", "-8deg");
    });
    window.addEventListener("pointermove", ev => {
      blob.style.setProperty("--mx", `${(ev.clientX / innerWidth - 0.5) * 80}px`);
      blob.style.setProperty("--my", `${(ev.clientY / innerHeight - 0.5) * 80}px`);
    }, { passive: true });
  }
  $(".browser").style.setProperty("--rx", "4deg");
})();

/* ---------- nav ---------- */
const nav = $("#nav"), toggle = $("#navToggle"), links = $("#navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
links.addEventListener("click", e => {
  if (e.target.closest("a")) { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
});
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 24), { passive: true });

const sections = $$("main section[id]");
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      $$(".nav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => spy.observe(s));

/* ---------- reveal on scroll ---------- */
let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); revealObserver.unobserve(en.target); } });
    }, { threshold: 0.12 });
  }
  $$(".reveal:not(.in)").forEach(el => revealObserver.observe(el));
}

/* ---------- boot ---------- */
renderFilters();
renderWork();
renderServices();
renderPackages();
renderPlans();
renderSteps();
observeReveals();

$("#year").textContent = new Date().getFullYear();

// Hero numbers follow the data
$$("[data-count]").forEach(el => {
  if (el.closest("div").querySelector("dt").textContent.startsWith("Live")) el.textContent = PROJECTS.length;
  if (el.closest("div").querySelector("dt").textContent.startsWith("Industries")) el.textContent = new Set(PROJECTS.map(p => p.category)).size;
});

// About photo fallback if images/about.jpg is missing
$("#aboutImg").addEventListener("error", () => { $("#aboutImg").hidden = true; $("#aboutFallback").hidden = false; });
