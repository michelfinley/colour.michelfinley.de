import { useEffect, useState } from "react";

export type ColourScheme = "light" | "dark" | "system";

export function useColourScheme() {
  const [colourScheme, setColourScheme] = useState<ColourScheme>("system");
  const [systemScheme, setSystemScheme] = useState<"light" | "dark">(
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemScheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const effectiveScheme =
    colourScheme === "system" ? systemScheme : colourScheme;

  return {
    colorScheme: colourScheme,
    setColourScheme: setColourScheme,
    effectiveScheme,
  };
}
