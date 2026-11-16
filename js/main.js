// Cimiano. Small enhancements. The site works without this file.
document.documentElement.classList.add("js");

// Menu open and close.
const menu = document.getElementById("menu");
const openBtn = document.querySelector("[data-menu-open]");
const closeBtn = document.querySelector(".menu-close");

function setMenu(open) {
  if (!menu) return;
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("menu-open", open);
  openBtn && openBtn.setAttribute("aria-expanded", String(open));
  if (open) closeBtn && closeBtn.focus();
  else openBtn && openBtn.focus();
}
openBtn && openBtn.addEventListener("click", () => setMenu(true));
// The close button and the dimmed backdrop both close the menu.
document.querySelectorAll("[data-menu-close]").forEach((el) =>
  el.addEventListener("click", () => setMenu(false))
);
document.addEventListener("keydown", (e) => {
  if (!menu || !menu.classList.contains("open")) return;
  if (e.key === "Escape") setMenu(false);
  // Keep Tab inside the panel while it is open.
  if (e.key === "Tab") {
    const items = menu.querySelectorAll(".menu-panel a, .menu-panel button");
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// Fade sections in as they scroll into view.
const revealed = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  revealed.forEach((el) => io.observe(el));
} else {
  revealed.forEach((el) => el.classList.add("in"));
}

// Contact form: build an email from the fields and open the visitor's mail app.
// No server, no third-party service.
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const v = (name) => (form.elements[name].value || "").trim();
    const subject = `Demande de devis - ${v("prenom")} ${v("nom")}`;
    const body = [
      `Prénom : ${v("prenom")}`,
      `Nom : ${v("nom")}`,
      `Email : ${v("email")}`,
      `Téléphone : ${v("telephone")}`,
      `Adresse du chantier : ${v("adresse")}`,
      "",
      v("message"),
    ].join("\n");
    window.location.href =
      `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// Keep the footer year current.
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
