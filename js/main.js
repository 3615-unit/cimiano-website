// Cimiano. Small enhancements. The site works without this file.
document.documentElement.classList.add("js");

// Menu open and close.
const menu = document.getElementById("menu");
const openBtn = document.querySelector("[data-menu-open]");
const closeBtn = document.querySelector(".menu-close");

// Remember which button opened the menu, so closing returns focus there
// without scrolling the page (the sticky bar's button may be far from the top one).
let opener = null;
function setMenu(open) {
  if (!menu) return;
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("menu-open", open);
  openBtn && openBtn.setAttribute("aria-expanded", String(open));
  if (open) {
    opener = document.activeElement;
    closeBtn && closeBtn.focus({ preventScroll: true });
  } else if (opener && opener.focus) {
    opener.focus({ preventScroll: true });
  }
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

// Compact bar: slides in once the top section (hero or page title) has
// scrolled out of view. Its Menu button opens the same side menu.
const miniBar = document.querySelector(".mini-bar");
const topSection = document.querySelector(".hero, .page-head");
if (miniBar && topSection && "IntersectionObserver" in window) {
  new IntersectionObserver((entries) => {
    const show = !entries[0].isIntersecting;
    miniBar.classList.toggle("show", show);
    miniBar.setAttribute("aria-hidden", String(!show));
    miniBar.querySelectorAll("a, button").forEach((el) => { el.tabIndex = show ? 0 : -1; });
  }).observe(topSection);
  const miniMenu = miniBar.querySelector("[data-mini-menu]");
  miniMenu && miniMenu.addEventListener("click", () => setMenu(true));
}

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

// Touch screens have no hover, so the savoir-faire list highlights the row
// crossing the middle of the screen instead. The band is the middle 10%.
const rowLists = document.querySelectorAll(".dark .rows");
if (rowLists.length && "IntersectionObserver" in window && matchMedia("(hover: none)").matches) {
  rowLists.forEach((list) => {
    const rows = list.querySelectorAll("li");
    const band = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        rows.forEach((row) => row.classList.toggle("is-current", row === entry.target));
        list.classList.add("has-current");
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    rows.forEach((row) => band.observe(row));
    // Once the list has left the screen, clear the highlight.
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) return;
      list.classList.remove("has-current");
      rows.forEach((row) => row.classList.remove("is-current"));
    }).observe(list);
  });
}

// Contact form: build an email from the fields and open the visitor's mail app.
// No server, no third-party service.
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const v = (name) => (form.elements[name].value || "").trim();
    // No e-mail field: the visitor's own mail app sends it, so we get their address anyway.
    const subject = `Demande de devis - ${v("nom")}`;
    const body = [
      `Nom : ${v("nom")}`,
      `Téléphone : ${v("telephone")}`,
      `Adresse du chantier : ${v("adresse")}`,
      "",
      v("message"),
    ].join("\n");
    window.location.href =
      `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// Analytics: count plays of the M6 clip (Umami, cookie-free). Does nothing
// if Umami is not loaded.
const tvVideo = document.querySelector("video.tv-media");
if (tvVideo) {
  tvVideo.addEventListener("play", () => {
    if (window.umami) window.umami.track("Lecture vidéo M6");
  }, { once: true });
}

// Keep the footer year current.
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
