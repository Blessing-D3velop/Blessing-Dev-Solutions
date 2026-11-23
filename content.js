/* Loads your projects, package prices and monthly plans from the database (edited in admin.html).
   Loaded AFTER script.js. If the database is empty or unreachable, the site keeps the content in script.js. */
(function () {
  const hide = ["packagesGrid", "plansGrid"].map(id => document.getElementById(id)).filter(Boolean);
  hide.forEach(el => { el.style.visibility = "hidden"; }); // avoids a flash of old prices

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));

  function replaceAll(target, items) {
    target.splice(0, target.length, ...items);
  }

  function renderFullstack(items) {
    const section = document.getElementById("fullstack");
    const grid = document.getElementById("fullstackGrid");
    const footLink = document.getElementById("footFullstack");
    if (!section || !grid) return;

    if (!items.length) {
      section.hidden = true;
      if (footLink) footLink.hidden = true;
      return;
    }

    grid.innerHTML = items.map(p => {
      const url = `https://${escapeHtml(p.domain)}`;
      const tags = (p.tags || []).map(t => `<li>${escapeHtml(t)}</li>`).join("");
      const img = p.image
        ? `<img src="${escapeHtml(p.image)}" alt="Screenshot of ${escapeHtml(p.name)}" loading="lazy" width="900" height="600">`
        : `<div class="fs-fallback">${escapeHtml(p.name)}</div>`;
      return `
        <article class="fs-card">
          <a class="fs-thumb" href="${url}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(p.name)} (${escapeHtml(p.domain)})">${img}</a>
          <div class="fs-body">
            <span class="tag">${escapeHtml(p.category)}</span>
            <h3>${escapeHtml(p.name)}</h3>
            ${p.note ? `<p>${escapeHtml(p.note)}</p>` : ""}
            ${tags ? `<ul class="fs-tags">${tags}</ul>` : ""}
            <a class="btn btn-ghost" href="${url}" target="_blank" rel="noopener">Visit ${escapeHtml(p.domain)}</a>
          </div>
        </article>`;
    }).join("");

    grid.querySelectorAll(".fs-thumb img").forEach(img => {
      img.addEventListener("error", () => {
        const div = document.createElement("div");
        div.className = "fs-fallback";
        div.textContent = img.alt.replace("Screenshot of ", "");
        img.replaceWith(div);
      });
    });

    section.hidden = false;
    if (footLink) footLink.hidden = false;
  }

  fetch("/api/content", { headers: { Accept: "application/json" }, signal: controller.signal })
    .then(response => { if (!response.ok) throw new Error("content unavailable"); return response.json(); })
    .then(data => {
      const websites = (data.projects || []).filter(p => p.kind !== "fullstack");
      const fullstack = (data.projects || []).filter(p => p.kind === "fullstack");

      if ((data.packages || []).length) replaceAll(PACKAGES, data.packages);
      if ((data.plans || []).length) replaceAll(PLANS, data.plans);

      if (websites.length) {
        replaceAll(PROJECTS, websites);
        activeFilter = "All";
        renderFilters();
        renderWork();
      }

      refreshPrices(); // redraws packages, plans and the "from" price

      const all = (data.projects || []);
      if (all.length) {
        const sites = document.getElementById("statSites");
        const industries = document.getElementById("statIndustries");
        if (sites) sites.textContent = all.length;
        if (industries) industries.textContent = new Set(all.map(p => p.category)).size;
      }

      renderFullstack(fullstack);
    })
    .catch(() => { /* keep the built-in content */ })
    .finally(() => {
      clearTimeout(timer);
      hide.forEach(el => { el.style.visibility = ""; });
    });
})();
