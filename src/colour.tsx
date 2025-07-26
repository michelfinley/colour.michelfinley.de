/* https://github.com/evilmartians/oklch-picker/blob/main/lib/colors.ts */

import {
  type Color,
  colorsNamed,
  formatHex,
  type Hsl,
  inGamut,
  modeHsl,
  modeOklch,
  modeP3,
  modeRgb,
  nearest,
  type Oklch,
  random,
  type Rgb,
  toGamut,
  useMode as culoriUseMode,
} from "culori/fn";

import { p3_support } from "./p3_support.tsx";

export type { Rgb, Oklch };

export const oklch = culoriUseMode(modeOklch);
export const rgb = culoriUseMode(modeRgb);
export const hsl = culoriUseMode(modeHsl);
export const p3 = culoriUseMode(modeP3);

const COLOUR_SPACE_GAP = 0.0001;

const COLOUR_FN = "oklch";
const L_MAX = 1;

// Dirty fix of https://github.com/Evercoder/culori/issues/249
export function inRGB(colour: Color): boolean {
  const check = rgb(colour);
  return (
    check.r >= -COLOUR_SPACE_GAP &&
    check.r <= 1 + COLOUR_SPACE_GAP &&
    check.g >= -COLOUR_SPACE_GAP &&
    check.g <= 1 + COLOUR_SPACE_GAP &&
    check.b >= -COLOUR_SPACE_GAP &&
    check.b <= 1 + COLOUR_SPACE_GAP
  );
}
export const inP3 = inGamut("p3");

export function buildForCSS(colour: Oklch): string {
  if (p3_support) {
    return formatOklch(colour);
  } else {
    return formatRgb(toRgb(colour));
  }
}

export const toRgb = toGamut("rgb", COLOUR_FN);

export const toHsl = toGamut("hsl", COLOUR_FN);

export const toP3 = toGamut("p3", COLOUR_FN);

export const toOklch = toGamut("oklch", COLOUR_FN);

export { formatHex };

export function formatRgb(colour: Rgb): string {
  const r = Math.round(255 * colour.r);
  const g = Math.round(255 * colour.g);
  const b = Math.round(255 * colour.b);
  if (typeof colour.alpha !== "undefined" && colour.alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${colour.alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export function formatHsl(colour: Hsl): string {
  const { alpha, h, s, l } = colour;
  let postfix = "";
  if (typeof alpha !== "undefined" && alpha < 1) {
    postfix = ` / ${clean(100 * alpha)}%`;
  }
  return `hsl(${clean(h ? h : 0, 2)} ${clean(s ? s * 100 : 100, 0)}% ${clean(l ? l * 100 : 100, 0)}%${postfix})`;
}

export function formatOklch(colour: Oklch): string {
  const { alpha, c, h, l } = colour;
  let postfix = "";
  if (typeof alpha !== "undefined" && alpha < 1) {
    postfix = ` / ${clean(100 * alpha)}%`;
  }
  return `${COLOUR_FN}(${clean(l / L_MAX, 3)} ${clean(c, 3)} ${clean(h ? h : 0, 1)}${postfix})`;
}

// Hack to avoid .999999 because of float bug implementation
export function clean(value: number, precision = 2): number {
  return (
    Math.round(parseFloat((value * 10 ** precision).toFixed(precision))) /
    10 ** precision
  );
}

export type Space = number;

// Hack for enum without enum
export const Space = {
  Out: 2,
  P3: 1,
  sRGB: 0,
};

const getProxyColour = rgb;

export function getSpace(colour: Color): Space {
  const proxyColour = getProxyColour(colour);
  if (inRGB(proxyColour)) {
    return Space.sRGB;
  } else if (inP3(proxyColour)) {
    return Space.P3;
  } else {
    return Space.Out;
  }
}

const namedColours = Object.keys(colorsNamed);
export const nearestNamedColour = (colour: Color) =>
  nearest(namedColours)(colour)[0];

export function randomOklch(): Oklch {
  const random_colour = toOklch(
    toP3(random("oklch", { l: [0.51, 0.8], c: [0.11, 0.35] })),
  );
  random_colour.l -= 0.01;
  random_colour.c -= 0.01;
  return random_colour;
}
