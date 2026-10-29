// Sprache: Deutsch (Standard) oder Englisch über index.html?lang=en.

/* ---------- Sprache ---------- */
const LANG = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "de";
// L("deutsch", "english") – liefert den Text in der aktiven Sprache
const L = (de, en) => LANG === "en" ? en : de;

/* Feste Texte in index.html: data-en = Text, data-en-html = Text mit Tags, data-en-aria = aria-label, data-en-content = content-Attribut */
if (LANG === "en"){
  document.documentElement.lang = "en";
  document.querySelectorAll("[data-en]").forEach(el => { el.textContent = el.dataset.en; });
  document.querySelectorAll("[data-en-html]").forEach(el => { el.innerHTML = el.dataset.enHtml; });
  document.querySelectorAll("[data-en-aria]").forEach(el => { el.setAttribute("aria-label", el.dataset.enAria); });
  document.querySelectorAll("[data-en-content]").forEach(el => { el.setAttribute("content", el.dataset.enContent); });
}
