import type { CSSProperties } from "react";

export type CSSVariableProperties = CSSProperties & {
  [key: `--${string}`]: string;
};

export type BaseColourKeys =
  `base${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950}`;

export type ColourInputName = "lightnessInput" | "chromaInput" | "hueInput";

export type ColourFormat = "hex" | "rgb" | "hsl" | "oklch";
