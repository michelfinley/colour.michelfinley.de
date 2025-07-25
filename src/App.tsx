import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  buildForCSS,
  formatHex,
  formatHsl,
  formatOklch,
  formatRgb,
  getSpace,
  nearestNamedColor,
  type Oklch,
  randomOklch,
  Space,
  toHsl,
  toOklch,
  toRgb,
} from "./colour.tsx";
import { p3_support } from "./p3_support.tsx";
import { Copy, PanelRightOpen } from "lucide-react";
import {
  COLOUR_PROPERTY_MAP,
  ColourFormats,
  PALETTE_CHROMA,
  PALETTE_LIGHTNESS,
} from "./constants.tsx";
import type {
  BaseColourKeys,
  ColourInputName,
  CSSVariableProperties,
} from "./types.tsx";
import { capitalize, getContrastColour } from "./utils.tsx";
import { useColorScheme } from "./hooks/useColorScheme.tsx";
import { ColourPaletteTabs } from "./components/ColourPaletteTabs.tsx";

function App() {
  const { effectiveScheme } = useColorScheme();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name in COLOUR_PROPERTY_MAP) {
      updateColour({
        [COLOUR_PROPERTY_MAP[name as ColourInputName]]: parseFloat(value),
      });
    }
  };

  const [currentColour, setCurrentColour] = useState<Oklch>(randomOklch());

  const [activeFormat, setActiveFormat] = useState<
    "hex" | "rgb" | "hsl" | "oklch"
  >("oklch");

  function updateColour(colour: Partial<Oklch>) {
    setCurrentColour((prevState) => {
      return { ...prevState, ...colour };
    });
  }

  useEffect(() => {
    document.title = `${capitalize(nearestNamedColor(currentColour))}`;
  }, [currentColour]);

  const colorPalette = useMemo(() => {
    const generatePaletteColour = (lightness: number, chroma: number) => {
      const adjustedLightness =
        effectiveScheme === "light" ? 1 - lightness : lightness;

      return buildForCSS({
        ...currentColour,
        l: adjustedLightness,
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
    const currentColorOklch = toOklch(currentColour);

    return {
      currentColor: currentColour,
      currentColorRGB: currentColorRGB,
      currentColorHSL: currentColorHSL,
      colorSpace: getSpace(currentColour),
      css: {
        currentColor: buildForCSS(currentColour),
        currentColorHEX: formatHex(currentColour),
        currentColorRGB: formatRgb(currentColorRGB),
        currentColorHSL: formatHsl(currentColorHSL),
        currentColorOklch: formatOklch(currentColorOklch),

        ...palette,

        lightness05: buildForCSS({ ...currentColour, l: 0.5 }),
        chroma0: buildForCSS({ ...currentColour, c: 0 }),
        chroma027: buildForCSS({ ...currentColour, c: 0.4 }),
        hue0: buildForCSS({ ...currentColour, h: 0 }),
      },
    };
  }, [currentColour, effectiveScheme]);

  const currentColorString = useMemo(() => {
    switch (activeFormat) {
      case "hex":
        return colorPalette.css.currentColorHEX;
      case "rgb":
        return colorPalette.css.currentColorRGB;
      case "hsl":
        return colorPalette.css.currentColorHSL;
      case "oklch":
        return colorPalette.css.currentColorOklch;
    }
  }, [activeFormat, colorPalette]);

  function copyToClipboard() {
    navigator.clipboard
      .writeText(currentColorString)
      .then((r) => console.log(r)); // add toast notification on success
  }

  return (
    <div
      className="m-0 flex min-h-full w-full flex-col items-center"
      style={{ backgroundColor: colorPalette.css.currentColor }}
    >
      <div className="z-10 flex w-full flex-grow flex-col items-center">
        <div
          className="relative flex h-16 min-h-16 w-full flex-row items-center justify-center shadow-xl/50 shadow-black"
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
          <div className="absolute top-0 z-20 m-6 flex items-center justify-center">
            <div
              className="rounded-xl px-6 py-4"
              style={{ backgroundColor: colorPalette.css.currentColor }}
            >
              <span
                className="text-xl font-semibold"
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
          className="main-container z-10 flex w-2/3 flex-grow flex-col items-center p-8 py-16 shadow-xl shadow-black"
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
          <div className="flex w-full flex-grow flex-col items-center">
            <div className="mb-8 flex flex-row gap-8 p-2">
              {colorPalette.colorSpace === Space.sRGB ? (
                <div
                  className="h-32 w-[26rem] rounded-2xl"
                  style={{ backgroundColor: colorPalette.css.currentColorRGB }}
                />
              ) : (
                <div
                  className="h-32 w-48 rounded-2xl"
                  style={{ backgroundColor: colorPalette.css.currentColorRGB }}
                />
              )}
              {
                {
                  [Space.Out]: (
                    <div className="border-contrast-grey flex h-32 w-48 items-center justify-center rounded-2xl border-6 border-dashed p-4 text-center">
                      <span className="color-white text-sm">
                        Invalid colour
                      </span>
                    </div>
                  ),
                  [Space.P3]: (
                    <>
                      {p3_support ? (
                        <div
                          className="flex h-32 w-48 items-center justify-center rounded-2xl"
                          style={{
                            backgroundColor: colorPalette.css.currentColor,
                          }}
                        >
                          <span className="text-contrast-grey/10 text-6xl font-black">
                            P3
                          </span>
                        </div>
                      ) : (
                        <div className="border-contrast-grey flex h-32 w-48 items-center justify-center rounded-2xl border-6 border-dashed p-4 text-center">
                          <span className="color-white text-sm">
                            Colour only available on P3 displays
                          </span>
                        </div>
                      )}
                    </>
                  ),
                }[colorPalette.colorSpace]
              }
            </div>
            <div className="mb-8 flex w-2/3 flex-row">
              <div className="w-fit">
                <div className="flex w-fit flex-col gap-2 p-2">
                  <div className="flex flex-row gap-3">
                    <div className="flex flex-row rounded-md bg-white/10">
                      <div className="w-[246px] p-2 pr-0">
                        <span className="font-mono text-lg">
                          {currentColorString}
                        </span>
                      </div>
                      <button
                        className="ml-2 cursor-pointer rounded-md p-2 transition-colors duration-200 ease-in-out hover:bg-white/15"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-row gap-1">
                    {ColourFormats.map((format) => (
                      <div
                        key={format}
                        className={`cursor-pointer rounded-lg p-1.5 px-2 font-mono text-xs text-white transition-colors duration-200 ease-in-out ${activeFormat === format ? "bg-white/30" : "bg-white/10"} `}
                        onClick={() => {
                          setActiveFormat(format);
                        }}
                      >
                        {format}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="mx-2 flex flex-col gap-2 p-2">
                  <div className="m-0.5 h-5 max-h-5 min-h-5 w-full">
                    <input
                      type="range"
                      name="lightnessInput"
                      min="0"
                      max="1"
                      value={colorPalette.currentColor.l}
                      step="0.005"
                      className="input-range-colour bg-linear-to-r from-black via-(--lightness-05) to-white"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="m-0.5 h-5 max-h-5 min-h-5 w-full">
                    <input
                      type="range"
                      name="chromaInput"
                      min="0"
                      max="0.4"
                      value={colorPalette.currentColor.c}
                      step="0.002"
                      className="input-range-colour bg-linear-to-r from-(--chroma-0) to-(--chroma-027)"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="m-0.5 h-5 max-h-5 min-h-5 w-full">
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
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-grow" />
            <ColourPaletteTabs currentColour={currentColour} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
