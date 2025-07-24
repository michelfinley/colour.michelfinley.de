import type { Oklch } from "./colour.tsx";

export function getContrastColour(backgroundColour: Oklch): string {
  return `var(--color-${backgroundColour.l > 0.5 ? "black" : "white"})`;
}

export function capitalize(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
