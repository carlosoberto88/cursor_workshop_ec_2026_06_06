"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  applyTheme,
  readStoredTheme,
  readSystemTheme,
  type ThemePreference,
} from "@/lib/theme";

function readToggleTheme(): ThemePreference {
  return readStoredTheme() ?? readSystemTheme();
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("light");

  useEffect(() => {
    setTheme(readToggleTheme());
  }, []);

  function toggleTheme() {
    const next: ThemePreference = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
