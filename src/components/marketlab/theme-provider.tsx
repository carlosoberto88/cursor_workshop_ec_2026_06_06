"use client";

import { useLayoutEffect } from "react";

import {
  resolveClientTheme,
  setThemeClass,
  type ThemePreference,
} from "@/lib/theme";

type ThemeProviderProps = {
  children: React.ReactNode;
  serverTheme?: ThemePreference | null;
};

export function ThemeProvider({ children, serverTheme }: ThemeProviderProps) {
  useLayoutEffect(() => {
    if (serverTheme === "light" || serverTheme === "dark") {
      setThemeClass(serverTheme);
      return;
    }

    setThemeClass(resolveClientTheme());
  }, [serverTheme]);

  return children;
}
