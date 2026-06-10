/**
 * theme.js
 * ─────────────────────────────────────────────────────────
 * Manages Dark / Light mode toggle.
 *
 * How it works:
 *   - Reads saved preference from localStorage on page load.
 *   - Applies [data-theme="dark"] to <html> to trigger CSS variables.
 *   - Saves the new preference on every toggle.
 *
 * Dependencies: none
 * Exports:      ThemeManager (module pattern)
 * ─────────────────────────────────────────────────────────
 */

const ThemeManager = (() => {

  // ── Constants ──────────────────────────────────────────
  const STORAGE_KEY   = 'portfolio-theme';
  const DARK_VALUE    = 'dark';
  const ICON_DARK     = '🌙';
  const ICON_LIGHT    = '☀️';

  // ── State ──────────────────────────────────────────────
  let isDark = false;

  // ── Private helpers ────────────────────────────────────

  /**
   * Apply a theme by setting/removing [data-theme] on <html>
   * and updating the toggle button icon.
   * @param {boolean} dark
   */
  function applyTheme(dark) {
    isDark = dark;

    // Toggle CSS-variable switch attribute
    document.documentElement.dataset.theme = dark ? DARK_VALUE : '';

    // Update button icon
    const btn = document.getElementById('btn-theme');
    if (btn) btn.textContent = dark ? ICON_LIGHT : ICON_DARK;

    // Persist choice
    localStorage.setItem(STORAGE_KEY, dark ? DARK_VALUE : 'light');
  }

  // ── Public API ─────────────────────────────────────────

  /**
   * Read saved preference from localStorage and apply it.
   * Called once on page load.
   */
  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Honour explicit user choice; fall back to OS preference
    applyTheme(saved ? saved === DARK_VALUE : prefersDark);
  }

  /**
   * Flip current theme and save preference.
   */
  function toggle() {
    applyTheme(!isDark);
  }

  return { init, toggle };

})();

// ── Boot ───────────────────────────────────────────────────

// Apply saved theme immediately (before DOM paint) to avoid flash
ThemeManager.init();

// Wire up the button after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('btn-theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', ThemeManager.toggle);
  }
});