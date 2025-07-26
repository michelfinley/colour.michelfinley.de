import { type FC, useMemo } from "react";
import { PALETTE_CHROMA, PALETTE_LIGHTNESS } from "../constants.tsx";
import { buildForCSS, type Oklch } from "../colour.tsx";

type ColourPaletteStripProps = {
  baseColour: Oklch;
  type: "monochromatic" | "triadic" | "complementary" | "analogous";
};

export const ColourPaletteStrip: FC<ColourPaletteStripProps> = ({
  baseColour,
  type,
}) => {
  const colourPaletteEntries = useMemo(() => {
    const calculateColourHarmonies = () => {
      if (baseColour.h === undefined) {
        return [baseColour];
      }

      switch (type) {
        case "monochromatic":
          return [baseColour];
        case "triadic": {
          return [
            baseColour,
            { ...baseColour, h: (baseColour.h + 120) % 360 },
            { ...baseColour, h: (baseColour.h + 240) % 360 },
          ];
        }
        case "complementary": {
          return [baseColour, { ...baseColour, h: (baseColour.h + 180) % 360 }];
        }
        case "analogous": {
          return [
            { ...baseColour, h: (baseColour.h - 30 + 360) % 360 },
            baseColour,
            { ...baseColour, h: (baseColour.h + 30) % 360 },
          ];
        }
      }
    };

    const colourHarmonies = calculateColourHarmonies();

    return colourHarmonies.map((colour) =>
      Object.entries(PALETTE_LIGHTNESS).map(([step, lightness]) => ({
        key: `${type}-${colour.h}-${step}`,
        colour: buildForCSS({
          ...colour,
          l: lightness,
          c:
            PALETTE_CHROMA[step as unknown as keyof typeof PALETTE_CHROMA] *
            Math.min(colour.c / 0.22, 1),
        }),
      })),
    );
  }, [baseColour, type]);

  return (
    <div className="flex flex-col gap-2 rounded-lg p-2">
      {colourPaletteEntries.map((palette, index) => (
        <div
          key={index}
          className="bg-contrast-grey flex w-fit flex-row gap-px rounded-lg p-0.5"
        >
          {palette.map(({ key, colour }) => (
            <div
              key={key}
              className="h-8 w-8 first:rounded-l-md last:rounded-r-md"
              style={{ backgroundColor: colour }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
