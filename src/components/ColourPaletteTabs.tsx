import { TabButton } from "./TabButton.tsx";
import type { Oklch } from "../colour.tsx";
import { type FC, useState } from "react";
import { ColourHarmonyPanel } from "./ColourHarmonyPanel.tsx";
import { ColourShadesPanel } from "./ColourShadesPanel.tsx";
import { RecentColoursPanel } from "./RecentColoursPanel.tsx";

interface ColourPaletteTabsProps {
  currentColour: Oklch;
  recentColours: Oklch[];
  onColourSelect: (colour: Oklch) => void;
}

type TabType = "harmonies" | "shades" | "recents";

const TabTypes: TabType[] = ["harmonies", "shades", "recents"];

export const ColourPaletteTabs: FC<ColourPaletteTabsProps> = ({
  currentColour,
  recentColours,
  onColourSelect,
}) => {
  const [expandedTab, setExpandedTab] = useState<TabType | null>("harmonies");

  const TabContent = {
    harmonies: <ColourHarmonyPanel currentColour={currentColour} />,
    shades: <ColourShadesPanel currentColour={currentColour} />,
    recents: (
      <RecentColoursPanel
        recentColours={recentColours}
        onColourSelect={onColourSelect}
      />
    ),
  };

  const handleTabToggle = (tabType: TabType) => {
    setExpandedTab((currentTab) => (currentTab === tabType ? null : tabType));
  };

  return (
    <div className="flex h-[236px] w-full flex-col gap-4">
      <div className="flex flex-row gap-2">
        {TabTypes.map((tabType) => (
          <TabButton
            key={tabType}
            isExpanded={tabType === expandedTab}
            onToggle={() => handleTabToggle(tabType)}
            title={tabType}
          />
        ))}
      </div>
      {expandedTab && TabContent[expandedTab]}
    </div>
  );
};
