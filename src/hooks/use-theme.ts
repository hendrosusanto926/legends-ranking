"use client";

import { useThemeMode } from "@/components/layout/theme-provider";

export function useTheme() {
  return useThemeMode();
}
