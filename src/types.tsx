import type { CSSProperties } from "react";

export type CSSVariableProperties = CSSProperties & {
  [key: `--${string}`]: string;
};

export type ColourScheme = "light" | "dark" | "system";
export type SystemScheme = "light" | "dark";

export type BaseColourKeys =
  `base${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950}`;

export type ColourInputName = "lightnessInput" | "chromaInput" | "hueInput";

export type ColourFormat = "hex" | "rgb" | "hsl" | "oklch";

export type TabType = "harmonies" | "shades" | "recents";

export type HarmonyType =
  | "monochromatic"
  | "triadic"
  | "complementary"
  | "analogous";
