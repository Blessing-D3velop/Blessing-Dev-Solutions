/* Reviews section: shows approved reviews and lets clients leave a star rating + comment.
   Talks to /api/reviews (see api/reviews/index.js). */
(function () {
  const list = document.getElementById("reviewsList");
  const summaryBox = document.getElementById("reviewsSummary");
  const form = document.getElementById("reviewForm");
  if (!list || !summaryBox || !form) return;

  const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));

  function stars(n) {
    const full = Math.max(0, Math.min(5, Math.round(n)));
    return `<span class="stars" role="img" aria-label="${full} out of 5 stars">${"\u2605".repeat(full)}<span class="empty">${"\u2605".repeat(5 - full)}</span></span>`;
  }

  function renderSummary(s) {
    if (!s || !s.count) {
      summaryBox.innerHTML = `<div class="rs-score">New</div><p class="rs-count">No reviews yet. Be the first to leave one.</p>`;
      return;
    }
    const bars = [5, 4, 3, 2, 1].map(star => {
      const n = s.counts[star - 1] || 0;
      const pct = Math.round((n / s.count) * 100);
      return `<div class="rs-row"><span>${star}\u2605</span><span class="rs-track"><span class="rs-fill" style="width:${pct}%"></span></span><b>${n}</b></div>`;
    }).join("");
    summaryBox.innerHTML = `
      <div class="rs-score">${s.average.toFixed(1)}<small>/ 5</small></div>
      ${stars(s.average)}
      <p class="rs-count">Based on ${s.count} review${s.count === 1 ? "" : "s"}</p>
      <div class="rs-bars">${bars}</div>`;
  }

  function renderList(reviews) {
    if (!reviews.length) {
      list.innerHTML = `<p class="reviews-empty">Reviews from my clients will appear here. Worked with me? Use the form below to leave yours.</p>`;
      return;
    }
    list.innerHTML = reviews.map(r => {
      const date = new Date(r.created_at).toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
      return `
        <article class="review-card">
          ${stars(r.rating)}
          <p>${escapeHtml(r.comment)}</p>
          <div class="review-meta">
            <div><strong>${escapeHtml(r.name)}</strong>${r.business ? escapeHtml(r.business) : ""}</div>
            <time datetime="${escapeHtml(r.created_at)}">${date}</time>
          </div>
        </article>`;
    }).join("");
  }

  async function loadReviews() {
    try {
      const response = await fetch("/api/reviews", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Could not load reviews");
      const data = await response.json();
      renderSummary(data.summary);
      renderList(data.reviews || []);
    } catch (error) {
      renderSummary(null);
      renderList([]);
    }
  }

  /* ---------- form ---------- */
  const status = document.getElementById("reviewStatus");
  const comment = form.elements.namedItem("comment");
  const counter = document.getElementById("reviewCount");
  const ratingText = document.getElementById("ratingText");
  const button = document.getElementById("reviewBtn");
  const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
  let shownAt = Date.now();

  function setStatus(message, type) {
    status.textContent = message || "";
    status.className = "rv-status" + (type ? " " + type : "");
    status.hidden = !message;
  }

  comment.addEventListener("input", () => { counter.textContent = `${comment.value.length}/1000`; });
  form.addEventListener("change", e => {
    if (e.target.name === "rating") ratingText.textContent = LABELS[Number(e.target.value)] || "";
  });
  form.addEventListener("focusin", () => { if (!form.dataset.touched) { form.dataset.touched = "1"; shownAt = Date.now(); } });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const rating = form.querySelector('input[name="rating"]:checked');
    const name = form.elements.namedItem("name").value.trim();
    const text = comment.value.trim();

    if (name.length < 2) return setStatus("Please enter your name.", "error");
    if (!rating) return setStatus("Please choose a star rating.", "error");
    if (text.length < 10) return setStatus("Please write at least a short sentence.", "error");

    setStatus("");
    button.disabled = true;
    const original = button.textContent;
    button.textContent = "Sending...";

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          business: form.elements.namedItem("business").value.trim(),
          rating: Number(rating.value),
          comment: text,
          website: form.elements.namedItem("website").value, // hidden spam trap
          elapsed: Date.now() - shownAt
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Your review could not be sent. Please try again.");

      form.reset();
      counter.textContent = "0/1000";
      ratingText.textContent = "";
      delete form.dataset.touched;
      setStatus("Thank you! Your review has been sent and will appear once it has been approved.", "ok");
    } catch (error) {
      setStatus(error.message, "error");
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });

  loadReviews();
})();
