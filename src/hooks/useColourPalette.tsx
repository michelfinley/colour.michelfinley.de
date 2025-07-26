import {
  buildForCSS,
  formatHex,
  formatHsl,
  formatOklch,
  formatRgb,
  getSpace,
  type Oklch,
  toHsl,
  toOklch,
  toRgb,
} from "../colour.tsx";
import { useMemo } from "react";
import { useColourScheme } from "./useColourScheme.tsx";
import { SHADE_CHROMA, SHADE_LIGHTNESS } from "../constants.tsx";
import type { BaseColourKeys, ColourFormat } from "../types.tsx";

export const useColourPalette = (
  currentColour: Oklch,
  activeFormat: ColourFormat,
) => {
  const { effectiveScheme } = useColourScheme();

  const colourPalette = useMemo(() => {
    const generatePaletteColour = (lightness: number, chroma: number) => {
      const adjustedLightness =
        effectiveScheme === "light" ? 1 - lightness : lightness;

      return buildForCSS({
        ...currentColour,
        l: adjustedLightness,
        c: chroma,
      });
    };

    const palette = Object.entries(SHADE_LIGHTNESS).reduce(
      (acc, [key, lightness]) => {
        acc[`base${key}` as BaseColourKeys] = generatePaletteColour(
          lightness,
          SHADE_CHROMA[key as unknown as keyof typeof SHADE_CHROMA],
        );
        return acc;
      },
      {} as Record<BaseColourKeys, string>,
    );

    return {
      currentColour: currentColour,
      colourSpace: getSpace(currentColour),
      css: {
        currentColour: buildForCSS(currentColour),
        currentColourHEX: formatHex(currentColour),
        currentColourRGB: formatRgb(toRgb(currentColour)),
        currentColourHSL: formatHsl(toHsl(currentColour)),
        currentColourOklch: formatOklch(toOklch(currentColour)),

        ...palette,

        lightness05: buildForCSS({ ...currentColour, l: 0.5 }),
        chroma0: buildForCSS({ ...currentColour, c: 0 }),
        chroma027: buildForCSS({ ...currentColour, c: 0.4 }),
        hue0: buildForCSS({ ...currentColour, h: 0 }),
      },
    };
  }, [currentColour, effectiveScheme]);

  const currentColourString = useMemo(() => {
    switch (activeFormat) {
      case "hex":
        return colourPalette.css.currentColourHEX;
      case "rgb":
        return colourPalette.css.currentColourRGB;
      case "hsl":
        return colourPalette.css.currentColourHSL;
      case "oklch":
        return colourPalette.css.currentColourOklch;
    }
  }, [activeFormat, colourPalette]);

  return {
    colourPalette,
    currentColourString: currentColourString,
  };
};
