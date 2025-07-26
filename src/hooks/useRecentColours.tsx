import { useEffect, useState } from "react";
import type { Oklch } from "../colour.tsx";

const STORAGE_KEY = "recentColours";
const MAX_RECENT_COLOURS = 10;

export const useRecentColours = () => {
  const [recentColours, setRecentColours] = useState<Oklch[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentColours));
  }, [recentColours]);

  const addRecentColour = (colour: Oklch) => {
    setRecentColours((prevColours) => {
      const filteredColours = prevColours.filter(
        (recentColours) =>
          !(
            recentColours.l === colour.l &&
            recentColours.c === colour.c &&
            recentColours.h === colour.h
          ),
      );
      return [colour, ...filteredColours].slice(0, MAX_RECENT_COLOURS);
    });
  };
  return { recentColours, addRecentColour };
};
