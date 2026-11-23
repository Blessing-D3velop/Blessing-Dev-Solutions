/* Fills the "Working with clients anywhere" section (#worldwideGrid).
   Edit the text below to change what is shown. Loaded after script.js. */
(function () {
  const grid = document.getElementById("worldwideGrid");
  if (!grid || grid.children.length) return; // do nothing if already filled

  const WORLDWIDE = [
    {
      title: "Everything is done remotely",
      text: "We work over WhatsApp and email, so there is no need to meet in person. You can be in any country.",
      icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"
    },
    {
      title: "English and a clear time zone",
      text: "I'm based in South Africa (UTC+2) and work in English. Message me any time and I'll reply, usually within a day.",
      icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2"
    },
    {
      title: "Prices in dollars or rand",
      text: "Switch the pricing above between US dollars and rand. You get a fixed quote before I start, so there are no surprises.",
      icon: "M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
    },
    {
      title: "Secure payments with PayFast",
      text: "Monthly plans are billed in South African rand through PayFast. The dollar amount is a guide, and your bank converts it.",
      icon: "M3 7h18v12H3zM3 11h18M7 15h3"
    },
    {
      title: "Domain and hosting sorted",
      text: "I connect your domain and host your site on Vercel so it loads fast anywhere in the world. Domain renewals are billed by the provider.",
      icon: "M4 5h16v6H4zM4 13h16v6H4zM8 8h.01M8 16h.01"
    },
    {
      title: "Updates at every step",
      text: "You hear from me at each of the four project steps, so you always know where your website stands.",
      icon: "M5 12.5l4.5 4.5L19 7"
    }
  ];

  grid.innerHTML = WORLDWIDE.map(item => `
    <article class="service">
      <div class="service-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${item.icon}"/></svg></div>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
})();
