import type { Oklch } from "../colour.tsx";
import { ColourPaletteStrip } from "./ColourPaletteStrip.tsx";
import type { FC } from "react";

interface ColourShadesPanelProps {
  currentColour: Oklch;
}

export const ColourShadesPanel: FC<ColourShadesPanelProps> = ({
  currentColour,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <ColourPaletteStrip baseColour={currentColour} type="monochromatic" />
    </div>
  );
};
