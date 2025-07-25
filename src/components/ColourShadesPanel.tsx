import type { Oklch } from "../colour.tsx";
import { ColorPaletteStrip } from "./ColorPaletteStrip.tsx";
import * as React from "react";

interface ColourShadesPanelProps {
  currentColour: Oklch;
}

export const ColourShadesPanel: React.FC<ColourShadesPanelProps> = ({
  currentColour,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <ColorPaletteStrip baseColor={currentColour} type="monochromatic" />
    </div>
  );
};
