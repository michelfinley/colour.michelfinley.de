import type { Oklch } from "../colour.tsx";
import { ColorPaletteStrip } from "./ColorPaletteStrip.tsx";
import * as React from "react";

interface RecentColoursPanelProps {
  currentColour: Oklch;
}

export const RecentColoursPanel: React.FC<RecentColoursPanelProps> = ({
  currentColour,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <ColorPaletteStrip baseColor={currentColour} type="monochromatic" />
    </div>
  );
};
