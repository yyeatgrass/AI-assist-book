import type { ReadingTheme } from "../types";

export const themeClasses: Record<ReadingTheme, { bg: string; text: string; bar: string }> = {
  light: {
    bg: "bg-reader-light",
    text: "text-gray-900",
    bar: "bg-white/90 border-gray-200",
  },
  dark: {
    bg: "bg-reader-dark",
    text: "text-gray-100",
    bar: "bg-gray-900/90 border-gray-700",
  },
  sepia: {
    bg: "bg-reader-sepia",
    text: "text-amber-950",
    bar: "bg-reader-sepia/95 border-amber-200",
  },
};

export function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatPercent(p: number): string {
  return `${Math.round(p)}%`;
}
