import * as React from "react";
import { useMemo } from "react";
import { PALETTE_CHROMA, PALETTE_LIGHTNESS } from "../constants.tsx";
import { buildForCSS, type Oklch } from "../colour.tsx";

type ColorPaletteStripProps = {
  baseColor: Oklch;
  type: "monochromatic" | "triadic" | "complementary";
};

export const ColorPaletteStrip: React.FC<ColorPaletteStripProps> = ({
  baseColor,
  type,
}) => {
  const colorPaletteEntries = useMemo(() => {
    const calculateColorHarmonies = () => {
      if (baseColor.h === undefined) {
        return [baseColor];
      }

      switch (type) {
        case "monochromatic":
          return [baseColor];
        case "triadic": {
          return [
            baseColor,
            { ...baseColor, h: (baseColor.h + 120) % 360 },
            { ...baseColor, h: (baseColor.h + 240) % 360 },
          ];
        }
        case "complementary": {
          return [baseColor, { ...baseColor, h: (baseColor.h + 180) % 360 }];
        }
      }
    };

    const colorHarmonies = calculateColorHarmonies();

    return colorHarmonies.map((color) =>
      Object.entries(PALETTE_LIGHTNESS).map(([step, lightness]) => ({
        key: `${type}-${color.h}-${step}`,
        color: buildForCSS({
          ...color,
          l: lightness,
          c:
            PALETTE_CHROMA[step as unknown as keyof typeof PALETTE_CHROMA] *
            Math.min(color.c / 0.22, 1),
        }),
      })),
    );
  }, [baseColor, type]);

  return (
    <div className="flex flex-col gap-2 rounded-lg p-2">
      <span className="text-sm text-white capitalize">{type}</span>
      {colorPaletteEntries.map((palette, index) => (
        <div
          key={index}
          className="bg-contrast-grey flex w-fit flex-row gap-px rounded-lg p-0.5"
        >
          {palette.map(({ key, color }) => (
            <div
              key={key}
              className="h-8 w-8 first:rounded-l-md last:rounded-r-md"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
