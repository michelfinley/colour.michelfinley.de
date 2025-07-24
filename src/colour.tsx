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

const COLOR_SPACE_GAP = 0.0001;

const COLOR_FN = "oklch";
const L_MAX = 1;

// Dirty fix of https://github.com/Evercoder/culori/issues/249
export function inRGB(color: Color): boolean {
  const check = rgb(color);
  return (
    check.r >= -COLOR_SPACE_GAP &&
    check.r <= 1 + COLOR_SPACE_GAP &&
    check.g >= -COLOR_SPACE_GAP &&
    check.g <= 1 + COLOR_SPACE_GAP &&
    check.b >= -COLOR_SPACE_GAP &&
    check.b <= 1 + COLOR_SPACE_GAP
  );
}
export const inP3 = inGamut("p3");

export function buildForCSS(color: Oklch): string {
  if (p3_support) {
    return formatOklch(color);
  } else {
    return formatRgb(toRgb(color));
  }
}

export const toRgb = toGamut("rgb", COLOR_FN);

export const toHsl = toGamut("hsl", COLOR_FN);

export const toP3 = toGamut("p3", COLOR_FN);

export const toOklch = toGamut("oklch", COLOR_FN);

export { formatHex };

export function formatRgb(color: Rgb): string {
  const r = Math.round(255 * color.r);
  const g = Math.round(255 * color.g);
  const b = Math.round(255 * color.b);
  if (typeof color.alpha !== "undefined" && color.alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${color.alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export function formatHsl(color: Hsl): string {
  const { alpha, h, s, l } = color;
  let postfix = "";
  if (typeof alpha !== "undefined" && alpha < 1) {
    postfix = ` / ${clean(100 * alpha)}%`;
  }
  return `hsl(${clean(h ? h : 0, 2)} ${clean(s ? s * 100 : 100, 0)}% ${clean(l ? l * 100 : 100, 0)}%${postfix})`;
}

export function formatOklch(color: Oklch): string {
  const { alpha, c, h, l } = color;
  let postfix = "";
  if (typeof alpha !== "undefined" && alpha < 1) {
    postfix = ` / ${clean(100 * alpha)}%`;
  }
  return `${COLOR_FN}(${clean(l / L_MAX, 4)} ${clean(c, 4)} ${clean(h ? h : 0, 2)}${postfix})`;
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

const getProxyColor = rgb;

export function getSpace(color: Color): Space {
  const proxyColor = getProxyColor(color);
  if (inRGB(proxyColor)) {
    return Space.sRGB;
  } else if (inP3(proxyColor)) {
    return Space.P3;
  } else {
    return Space.Out;
  }
}

const namedColors = Object.keys(colorsNamed);
export const nearestNamedColor = (color: Color) =>
  nearest(namedColors)(color)[0];

// TODO: further limit the range of lightness and chroma
export function randomOklch(): Oklch {
  return toOklch(toP3(random("oklch", { l: [0.2, 0.8], c: [0.02, 0.4] })));
}
