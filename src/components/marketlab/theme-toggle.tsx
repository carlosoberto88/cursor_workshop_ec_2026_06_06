"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  getNextThemeMode,
  resolveThemeClass,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "@/lib/theme";

function getInitialTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("dark");

  const themeClass = resolveThemeClass(mode);
  if (themeClass) {
    root.classList.add(themeClass);
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Ignore storage failures in restricted environments.
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={`Switch to ${getNextThemeMode(theme)} mode`}
      onClick={() => {
        const nextTheme = getNextThemeMode(theme);
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
