/* https://github.com/evilmartians/oklch-picker/blob/main/stores/support.ts */

export let p3_support: boolean = false;

if (typeof window !== "undefined") {
  // There are no types for CSS.supports yet
  if (CSS.supports("color", "color(display-p3 1 1 1)")) {
    const mediaP3 = window.matchMedia("(color-gamut:p3)");
    p3_support = mediaP3.matches;
    mediaP3.addEventListener("change", () => {
      p3_support = mediaP3.matches;
    });
  }
}
