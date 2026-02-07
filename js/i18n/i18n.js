import { translations } from "./translations.js";

const LANG_KEY = "join_lang";

export function getLang() {
  return localStorage.getItem(LANG_KEY) || (navigator.language.startsWith("de") ? "de" : "en");
}

export function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyTranslations();
  updateToggle(lang);
}

export function t(key) {
  const lang = getLang();
  const parts = key.split(".");
  let cur = translations[lang];
  for (const p of parts) {
    if (!cur) return key;
    cur = cur[p];
  }
  return cur ?? key;
}

export function applyTranslations(root = document) {
  const lang = getLang();
  root.documentElement?.setAttribute("lang", lang);

  root.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  root.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    el.innerHTML = t(key);
  });

  root.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", t(key));
  });

  root.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    el.setAttribute("title", t(key));
  });

  root.querySelectorAll("[data-i18n-aria]").forEach(el => {
    const key = el.getAttribute("data-i18n-aria");
    el.setAttribute("aria-label", t(key));
  });

  root.querySelectorAll("[data-i18n-error]").forEach(el => {
    const key = el.getAttribute("data-i18n-error");
    let msg = t(key);
    const iso = el.getAttribute("data-i18n-error-date-iso");
    if (iso) {
      const dateStr = formatDisplayDate(iso, lang);
      msg = msg.replace("{date}", dateStr);
    }
    el.textContent = msg;
  });
}

export function initI18n() {
  applyTranslations();
  setupToggle();
}

function setupToggle() {
  document.querySelectorAll("[data-lang-toggle] button").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
  updateToggle(getLang());
}

function updateToggle(lang) {
  document.querySelectorAll("[data-lang-toggle] button").forEach(btn => {
    if (btn.dataset.lang === lang) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

function formatDisplayDate(isoDateStr, lang) {
  if (!isoDateStr) return "";
  if (lang !== "de") return isoDateStr;
  const [year, month, day] = isoDateStr.split("-");
  return `${day}.${month}.${year}`;
}
