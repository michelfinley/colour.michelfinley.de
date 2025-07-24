import { useMemo, useState } from "react";
import "./App.css";
import * as React from "react";
import {
  type Oklch,
  buildForCSS,
  getSpace,
  Space,
  toRgb,
  toHsl,
  formatRgb,
  formatHsl,
  formatOklch,
  toOklch,
  nearestNamedColor,
} from "./colour.tsx";
import { p3_support } from "./p3_support.tsx";
import { PanelRightOpen } from "lucide-react";
import {
  COLOUR_PROPERTY_MAP,
  PALETTE_CHROMA,
  PALETTE_LIGHTNESS,
} from "./constants.tsx";
import type {
  BaseColourKeys,
  ColourInputName,
  CSSVariableProperties,
} from "./types.tsx";
import { capitalize, getContrastColour } from "./utils.tsx";

function App() {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name in COLOUR_PROPERTY_MAP) {
      updateColour({
        [COLOUR_PROPERTY_MAP[name as ColourInputName]]: parseFloat(value),
      });
    }
  };

  const [currentColour, setCurrentColour] = useState<Oklch>({
    alpha: 1,
    l: 0.72,
    c: 0.17,
    h: 32,
    mode: "oklch",
  });

  function updateColour(colour: Partial<Oklch>) {
    setCurrentColour((prevState) => {
      return { ...prevState, ...colour };
    });
  }

  const colorPalette = useMemo(() => {
    const generatePaletteColour = (lightness: number, chroma: number) => {
      return buildForCSS({
        ...currentColour,
        l: lightness,
        c: chroma,
      });
    };

    const palette = Object.entries(PALETTE_LIGHTNESS).reduce(
      (acc, [key, lightness]) => {
        acc[`base${key}` as BaseColourKeys] = generatePaletteColour(
          lightness,
          PALETTE_CHROMA[key as unknown as keyof typeof PALETTE_CHROMA],
        );
        return acc;
      },
      {} as Record<BaseColourKeys, string>,
    );

    const currentColorRGB = toRgb(currentColour);
    const currentColorHSL = toHsl(currentColour);
    const currentColorOKLCH = toOklch(currentColour);

    return {
      currentColor: currentColour,
      currentColorRGB: currentColorRGB,
      currentColorHSL: currentColorHSL,
      colorSpace: getSpace(currentColour),
      css: {
        currentColor: buildForCSS(currentColour),
        currentColorRGB: formatRgb(currentColorRGB),
        currentColorHSL: formatHsl(currentColorHSL),
        currentColorOkLCH: formatOklch(currentColorOKLCH),

        ...palette,

        lightness05: buildForCSS({ ...currentColour, l: 0.5 }),
        chroma0: buildForCSS({ ...currentColour, c: 0 }),
        chroma027: buildForCSS({ ...currentColour, c: 0.4 }),
        hue0: buildForCSS({ ...currentColour, h: 0 }),
      },
    };
  }, [currentColour]);

  return (
    <div
      className="m-0 flex h-full w-full flex-col items-center"
      style={{ backgroundColor: colorPalette.css.currentColor }}
    >
      <div className="z-10 flex h-full w-full flex-col items-center">
        <div
          className="relative flex h-16 w-full flex-row items-center justify-center shadow-xl/50 shadow-black"
          style={{
            color: colorPalette.css.base300,
            backgroundColor: colorPalette.css.base950,
          }}
        >
          <div className="absolute top-0 left-0 flex h-full w-fit items-center justify-center px-8">
            <span className="font-mono text-2xl font-bold select-none">
              colourpicker
            </span>
          </div>
          <div className="flex items-center justify-center">
            <div
              className="rounded-xl px-6 py-3"
              style={{ backgroundColor: colorPalette.css.currentColor }}
            >
              <span
                className="font-semibold"
                style={{
                  color: getContrastColour(colorPalette.currentColor),
                }}
              >
                {capitalize(nearestNamedColor(currentColour))}
              </span>
            </div>
          </div>
          <div className="absolute top-0 right-0 flex h-full w-fit items-center justify-center px-8">
            <PanelRightOpen className="h-8 w-8" />
          </div>
        </div>
        <div
          className="main-container z-10 flex w-3/5 flex-grow flex-row p-8 shadow-xl/50 shadow-black"
          style={
            {
              "--current-color": colorPalette.css.currentColor,
              "--lightness-05": colorPalette.css.lightness05,
              "--chroma-0": colorPalette.css.chroma0,
              "--chroma-027": colorPalette.css.chroma027,
              "--hue-0": colorPalette.css.hue0,
              "--background": colorPalette.css.base950,
              backgroundColor: colorPalette.css.base950,
            } as CSSVariableProperties
          }
        >
          <div className="flex w-full flex-col">
            <div className="flex w-1/2 max-w-1/2 min-w-1/2 flex-row">
              <div
                className="h-16 w-24 rounded-2xl"
                style={{ backgroundColor: colorPalette.css.currentColor }}
              />
              <div
                className="h-16 w-24 rounded-2xl"
                style={{ backgroundColor: colorPalette.css.currentColorRGB }}
              />
            </div>
            {
              {
                [Space.Out]: <span className="color-white">Invalid color</span>,
                [Space.P3]: (
                  <>
                    {p3_support ? (
                      ""
                    ) : (
                      <span className="color-black">
                        Colour only available on P3 displays
                      </span>
                    )}
                  </>
                ),
              }[colorPalette.colorSpace]
            }
            <input
              type="text"
              name="hexInput"
              value={colorPalette.css.currentColorOkLCH}
              readOnly={true}
            />
            <input
              type="text"
              name="hexInput"
              value={colorPalette.css.currentColorHSL}
              readOnly={true}
            />
            <input
              type="text"
              name="hexInput"
              value={colorPalette.css.currentColorRGB}
              readOnly={true}
            />
            <div className="flex w-fit flex-row border-2 border-blue-500">
              {Object.keys(PALETTE_LIGHTNESS).map((step) => (
                <div
                  key={JSON.stringify({ ...currentColour, l: step })}
                  className="h-8 w-8"
                  style={{
                    backgroundColor:
                      colorPalette.css[`base${step}` as BaseColourKeys],
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col">
            <input
              type="range"
              name="hueInput"
              min="0"
              max="360"
              value={colorPalette.currentColor.h}
              step="1.8"
              className="input-range-colour bg-linear-to-r/longer from-(--hue-0) to-(--hue-0)"
              onChange={handleInputChange}
            />
            <input
              type="range"
              name="lightnessInput"
              min="0"
              max="1"
              value={colorPalette.currentColor.l}
              step="0.005"
              className="input-range-colour m-2 h-5 w-128 rounded-full bg-linear-to-r from-black via-(--lightness-05) to-white"
              onChange={handleInputChange}
            />
            <input
              type="range"
              name="chromaInput"
              min="0"
              max="0.4"
              value={colorPalette.currentColor.c}
              step="0.002"
              className="input-range-colour m-2 h-5 w-128 rounded-full bg-linear-to-r from-(--chroma-0) to-(--chroma-027)"
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
