import * as React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import {
  nearestNamedColor,
  type Oklch,
  randomOklch,
  Space,
} from "./colour.tsx";
import { p3_support } from "./p3_support.tsx";
import { Copy, PanelRightOpen } from "lucide-react";
import { COLOUR_PROPERTY_MAP, ColourFormats } from "./constants.tsx";
import type {
  ColourFormat,
  ColourInputName,
  CSSVariableProperties,
} from "./types.tsx";
import { capitalize, getContrastColour } from "./utils.tsx";
import { ColourPaletteTabs } from "./components/ColourPaletteTabs.tsx";
import { useRecentColors } from "./hooks/useRecentColours.tsx";
import { useColourPalette } from "./hooks/useColourPalette.tsx";

function App() {
  const [currentColour, setCurrentColour] = useState<Oklch>(randomOklch());
  const [activeFormat, setActiveFormat] = useState<ColourFormat>("oklch");

  const { colourPalette, currentColourString } = useColourPalette(
    currentColour,
    activeFormat,
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name in COLOUR_PROPERTY_MAP) {
      updateColour({
        [COLOUR_PROPERTY_MAP[name as ColourInputName]]: parseFloat(value),
      });
    }
  };

  const { recentColours, addRecentColour } = useRecentColors();

  function updateColour(colour: Partial<Oklch>) {
    setCurrentColour((prevState) => {
      return { ...prevState, ...colour };
    });
  }

  useEffect(() => {
    document.title = `${capitalize(nearestNamedColor(currentColour))}`;
  }, [currentColour]);

  function copyToClipboard() {
    navigator.clipboard
      .writeText(currentColourString)
      .then((r) => console.log(r)); // add toast notification on success
    addRecentColour(currentColour);
  }

  return (
    <div
      className="m-0 flex min-h-full w-full flex-col items-center"
      style={{ backgroundColor: colourPalette.css.currentColour }}
    >
      <div className="z-10 flex w-full flex-grow flex-col items-center">
        <div
          className="relative flex h-16 min-h-16 w-full flex-row items-center justify-center shadow-xl/50 shadow-black"
          style={{
            color: colourPalette.css.base300,
            backgroundColor: colourPalette.css.base950,
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
              style={{ backgroundColor: colourPalette.css.currentColour }}
            >
              <span
                className="text-xl font-semibold"
                style={{
                  color: getContrastColour(colourPalette.currentColour),
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
              "--current-color": colourPalette.css.currentColour,
              "--lightness-05": colourPalette.css.lightness05,
              "--chroma-0": colourPalette.css.chroma0,
              "--chroma-027": colourPalette.css.chroma027,
              "--hue-0": colourPalette.css.hue0,
              "--background": colourPalette.css.base950,
              backgroundColor: colourPalette.css.base950,
            } as CSSVariableProperties
          }
        >
          <div className="flex w-full flex-grow flex-col items-center">
            <div className="mb-8 flex flex-row gap-8 p-2">
              {colourPalette.colourSpace === Space.sRGB ? (
                <div
                  className="h-32 w-[26rem] rounded-2xl"
                  style={{
                    backgroundColor: colourPalette.css.currentColourRGB,
                  }}
                />
              ) : (
                <div
                  className="h-32 w-48 rounded-2xl"
                  style={{
                    backgroundColor: colourPalette.css.currentColourRGB,
                  }}
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
                            backgroundColor: colourPalette.css.currentColour,
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
                }[colourPalette.colourSpace]
              }
            </div>
            <div className="mb-8 flex w-2/3 flex-row">
              <div className="w-fit">
                <div className="flex w-fit flex-col gap-2 p-2">
                  <div className="flex flex-row gap-3">
                    <div className="flex flex-row rounded-md bg-white/10">
                      <div className="w-[246px] p-2 pr-0">
                        <span className="font-mono text-lg">
                          {currentColourString}
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
                      <button
                        key={format}
                        className={`cursor-pointer rounded-lg p-1.5 px-2 font-mono text-xs text-white transition-colors duration-200 ease-in-out ${activeFormat === format ? "bg-white/30" : "bg-white/10"} `}
                        onClick={() => {
                          setActiveFormat(format);
                        }}
                      >
                        {format}
                      </button>
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
                      value={colourPalette.currentColour.l}
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
                      value={colourPalette.currentColour.c}
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
                      value={colourPalette.currentColour.h}
                      step="1.8"
                      className="input-range-colour bg-linear-to-r/longer from-(--hue-0) to-(--hue-0)"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-grow" />
            <ColourPaletteTabs
              currentColour={currentColour}
              recentColours={recentColours}
              onColourSelect={updateColour}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
