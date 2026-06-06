"use client";

import { useEffect } from "react";

import {
  resolveThemeClass,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "@/lib/theme";

function getStoredTheme(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    return null;
  }

  return null;
}

function getSystemTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("dark");

  const themeClass = resolveThemeClass(mode);
  if (themeClass) {
    root.classList.add(themeClass);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mode = getStoredTheme() ?? getSystemTheme();
    applyTheme(mode);
  }, []);

  return children;
}
