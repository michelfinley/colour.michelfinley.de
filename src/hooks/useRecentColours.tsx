import { useEffect, useState } from "react";
import type { Oklch } from "culori/fn";

const STORAGE_KEY = "recentColors";
const MAX_RECENT_COLORS = 10;

export const useRecentColors = () => {
  const [recentColours, setRecentColours] = useState<Oklch[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentColours));
  }, [recentColours]);

  const addRecentColour = (color: Oklch) => {
    setRecentColours((prevColours) => {
      const filteredColors = prevColours.filter(
        (recentColours) =>
          !(
            recentColours.l === color.l &&
            recentColours.c === color.c &&
            recentColours.h === color.h
          ),
      );
      return [color, ...filteredColors].slice(0, MAX_RECENT_COLORS);
    });
  };
  return { recentColours, addRecentColour };
};
