/**
 * lang.js
 * ─────────────────────────────────────────────────────────
 * Manages Arabic / English language switching.
 *
 * How it works:
 *   - Every translatable element carries data-ar and data-en attributes.
 *   - Switching language updates: textContent, placeholder, dir, lang,
 *     and triggers a re-render of dynamic JS-generated sections.
 *   - The current language is exposed via LangManager.current for
 *     other modules (scripts.js) to read.
 *
 * Dependencies: scripts.js must define window.renderAll()
 * ─────────────────────────────────────────────────────────
 */

const LangManager = (() => {

  // ── Constants ──────────────────────────────────────────
  const STORAGE_KEY  = 'portfolio-lang';
  const DEFAULT_LANG = 'ar';

  // ── State ──────────────────────────────────────────────
  let current = DEFAULT_LANG;

  // ── Private helpers ────────────────────────────────────

  /**
   * Update all [data-ar] / [data-en] elements with the correct text.
   * Input/Textarea elements update their placeholder instead.
   * @param {string} lang - 'ar' | 'en'
   */
  function updateStaticContent(lang) {
    // Text content elements
    document.querySelectorAll('[data-ar]').forEach((el) => {
      const translation = el.dataset[lang];
      if (translation) el.textContent = translation;
    });

    // Placeholder attributes
    document.querySelectorAll('[data-ar-ph]').forEach((el) => {
      const key = lang === 'ar' ? 'arPh' : 'enPh';
      const translation = el.dataset[key];
      if (translation) el.placeholder = translation;
    });
  }

  /**
   * Update the <html> element's lang and dir attributes.
   * @param {string} lang - 'ar' | 'en'
   */
  function updateDocumentDirection(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  }

  /**
   * Update the language toggle button label.
   * @param {string} lang - 'ar' | 'en'
   */
  function updateToggleButton(lang) {
    const iconEl = document.getElementById('lang-icon');
    const textEl = document.getElementById('lang-text');

    if (iconEl) iconEl.textContent = lang === 'ar' ? 'EN' : 'AR';
    if (textEl) textEl.textContent = lang === 'ar' ? 'English' : 'عربي';
  }

  /**
   * Apply a language: update DOM, direction, button, and re-render.
   * @param {string} lang - 'ar' | 'en'
   */
  function applyLang(lang) {
    current = lang;

    updateDocumentDirection(lang);
    updateStaticContent(lang);
    updateToggleButton(lang);

    // Re-render dynamically generated sections (defined in scripts.js)
    if (typeof window.renderAll === 'function') {
      window.renderAll();
    }

    // Persist choice
    localStorage.setItem(STORAGE_KEY, lang);
  }

  // ── Public API ─────────────────────────────────────────

  /**
   * Read saved language and apply it.
   * Called once after DOM is ready.
   */
  function init() {
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    applyLang(saved);
  }

  /**
   * Flip current language.
   */
  function toggle() {
    applyLang(current === 'ar' ? 'en' : 'ar');
  }

  return { init, toggle, get current() { return current; } };

})();

// ── Boot ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('btn-lang');
  if (langBtn) {
    langBtn.addEventListener('click', LangManager.toggle);
  }

  LangManager.init();
});