export type ThemePreference = "light" | "dark";

export function readStoredTheme(): ThemePreference | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return null;
}

export function readSystemTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveClientTheme(): ThemePreference {
  return readStoredTheme() ?? readSystemTheme();
}

export function setThemeClass(theme: ThemePreference) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function applyTheme(theme: ThemePreference) {
  setThemeClass(theme);
  localStorage.setItem("theme", theme);
  // biome-ignore lint/suspicious/noDocumentCookie: cookie syncs theme for SSR on full page loads
  document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
}
