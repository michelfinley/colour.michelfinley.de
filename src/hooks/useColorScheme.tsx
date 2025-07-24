import { useEffect, useState } from "react";

export type ColorScheme = "light" | "dark" | "system";

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("system");
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

  const effectiveScheme = colorScheme === "system" ? systemScheme : colorScheme;

  return {
    colorScheme,
    setColorScheme,
    effectiveScheme,
  };
}
