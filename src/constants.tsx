import type { Oklch } from "./colour.tsx";
import type { ColourInputName } from "./types.tsx";

export const PALETTE_LIGHTNESS = {
  50: 0.95,
  100: 0.9,
  200: 0.8,
  300: 0.72,
  400: 0.66,
  500: 0.5,
  600: 0.39,
  700: 0.28,
  800: 0.14,
  900: 0.09,
  950: 0.06,
};

export const PALETTE_CHROMA = {
  50: 0.02,
  100: 0.05,
  200: 0.1,
  300: 0.17,
  400: 0.22,
  500: 0.18,
  600: 0.14,
  700: 0.1,
  800: 0.05,
  900: 0.03,
  950: 0.02,
};

export const COLOUR_PROPERTY_MAP: Record<
  ColourInputName,
  keyof Pick<Oklch, "l" | "c" | "h">
> = {
  lightnessInput: "l",
  chromaInput: "c",
  hueInput: "h",
} as const;
