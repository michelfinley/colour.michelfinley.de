import { ChevronDown } from "lucide-react";
import type { FC } from "react";

interface TabButtonProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const TabButton: FC<TabButtonProps> = ({
  title,
  isExpanded,
  onToggle,
}) => {
  return (
    <button
      className={`hover:bg-base-700 flex min-w-[140px] cursor-pointer items-center justify-between rounded-lg ${isExpanded ? "bg-white/30" : "bg-white/10"} px-4 py-2 text-white transition-colors duration-200 ease-in-out`}
      onClick={() => onToggle()}
    >
      <span className="font-mono text-sm capitalize">{title}</span>
      <ChevronDown
        className={`h-4 w-4 transition-transform ${
          isExpanded ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};
