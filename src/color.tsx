/* https://github.com/evilmartians/oklch-picker/blob/main/lib/colors.ts */

import {
  type Color,
  inGamut,
  modeHsl,
  modeOklch,
  modeP3,
  modeRgb,
  type Oklch,
  parse as coloriParse,
  type Rgb,
  toGamut,
  useMode as culoriUseMode,
} from "culori/fn";

import { p3_support } from "./p3_support.tsx";

export interface OkLCHColor {
  l: number;
  c: number;
  h: number;
  alpha?: number;
}

export type { Rgb } from "culori/fn";

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

export function build(color: OkLCHColor): Oklch {
  return {
    alpha: color.alpha ? color.alpha : 1,
    c: color.c,
    h: color.h,
    l: color.l,
    mode: COLOR_FN,
  };
}

export function buildForCSS(color: OkLCHColor): string {
  if (p3_support) {
    return formatOklch(build(color));
  } else {
    return formatRgb(toRgb(build(color)));
  }
}

export function parse(value: string): Color | undefined {
  return coloriParse(value.trim());
}

export function parseAnything(value: string): Color | undefined {
  value = value.replace(/\s*;\s*$/, "");
  if (/^[\w-]+:\s*(#\w+|\w+\([^)]+\))$/.test(value)) {
    value = value.replace(/^[\w-]+:\s*/, "");
  }
  if (/^\s*[\d.]+%?\s+[\d.]+\s+[\d.]+\s*$/.test(value)) {
    value = `${COLOR_FN}(${value})`;
  }
  return parse(value);
}

export const toRgb = toGamut("rgb", COLOR_FN);

export function formatRgb(color: Rgb): string {
  const r = Math.round(25500 * color.r) / 100;
  const g = Math.round(25500 * color.g) / 100;
  const b = Math.round(25500 * color.b) / 100;
  if (typeof color.alpha !== "undefined" && color.alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${color.alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export function formatOklch(color: Oklch): string {
  const { alpha, c, h, l } = color;
  let postfix = "";
  if (typeof alpha !== "undefined" && alpha < 1) {
    postfix = ` / ${clean(100 * alpha)}%`;
  }
  return `${COLOR_FN}(${clean(l / L_MAX, 4)} ${c} ${h}${postfix})`;
}

// Hack to avoid .999999 because of float bug implementation
export function clean(value: number, precision = 2): number {
  return (
    Math.round(parseFloat((value * 10 ** precision).toFixed(precision))) /
    10 ** precision
  );
}

export function isHexNotation(value: string): boolean {
  return /^#?([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value);
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

export type GetSpace = typeof getSpace;
