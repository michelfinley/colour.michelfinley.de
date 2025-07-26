import { buildForCSS, type Oklch } from "../colour.tsx";
import * as React from "react";

interface RecentColoursPanelProps {
  recentColours: Oklch[];
  onColourSelect: (colour: Oklch) => void;
}

export const RecentColoursPanel: React.FC<RecentColoursPanelProps> = ({
  recentColours,
  onColourSelect,
}) => {
  return (
    <div className="flex flex-row gap-4">
      {recentColours.map((colour, index) => (
        <button
          className="hover:border-contrast-grey h-8 w-16 cursor-pointer rounded-lg transition-transform duration-100 ease-in-out hover:scale-115"
          style={{ backgroundColor: buildForCSS(colour) }}
          key={index}
          onClick={() => onColourSelect(colour)}
        />
      ))}
    </div>
  );
};
