export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "marketlab-theme";

export function getNextThemeMode(current: ThemeMode): ThemeMode {
  return current === "dark" ? "light" : "dark";
}

export function resolveThemeClass(mode: ThemeMode): "" | "dark" {
  return mode === "dark" ? "dark" : "";
}
