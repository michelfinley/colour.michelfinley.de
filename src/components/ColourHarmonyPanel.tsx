import { type FC, useState } from "react";
import type { Oklch } from "../colour.tsx";
import { ColourPaletteStrip } from "./ColourPaletteStrip.tsx";
import type { HarmonyType } from "../types.tsx";
import { HarmonyTypes } from "../constants.tsx";

interface ColourHarmonyPanelProps {
  currentColour: Oklch;
}

export const ColourHarmonyPanel: FC<ColourHarmonyPanelProps> = ({
  currentColour,
}) => {
  const [selectedHarmony, setSelectedHarmony] =
    useState<HarmonyType>("monochromatic");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-1">
        {HarmonyTypes.map((harmonyType) => (
          <button
            key={harmonyType}
            className={`cursor-pointer rounded-lg p-1.5 px-2 font-mono text-xs text-white transition-colors duration-200 ease-in-out ${selectedHarmony === harmonyType ? "bg-white/30" : "bg-white/10"} `}
            onClick={() => {
              setSelectedHarmony(harmonyType);
            }}
          >
            {harmonyType}
          </button>
        ))}
      </div>
      <ColourPaletteStrip baseColour={currentColour} type={selectedHarmony} />
    </div>
  );
};
