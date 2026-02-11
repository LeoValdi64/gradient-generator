"use client";

import { useState, useCallback } from "react";
import {
  Copy,
  Check,
  Shuffle,
  Plus,
  Minus,
  Palette,
  Code,
  Paintbrush,
  RotateCw,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type GradientType = "linear" | "radial" | "conic";

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

interface Preset {
  name: string;
  type: GradientType;
  angle: number;
  stops: { color: string; position: number }[];
}

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS: Preset[] = [
  {
    name: "Ocean Breeze",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#667eea", position: 0 },
      { color: "#764ba2", position: 100 },
    ],
  },
  {
    name: "Sunset Glow",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#f093fb", position: 0 },
      { color: "#f5576c", position: 50 },
      { color: "#ffd200", position: 100 },
    ],
  },
  {
    name: "Northern Lights",
    type: "linear",
    angle: 160,
    stops: [
      { color: "#0f2027", position: 0 },
      { color: "#203a43", position: 40 },
      { color: "#2c5364", position: 100 },
    ],
  },
  {
    name: "Cyber Pulse",
    type: "linear",
    angle: 45,
    stops: [
      { color: "#00f5a0", position: 0 },
      { color: "#00d9f5", position: 100 },
    ],
  },
  {
    name: "Berry Smoothie",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#a18cd1", position: 0 },
      { color: "#fbc2eb", position: 100 },
    ],
  },
  {
    name: "Fire Storm",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#f12711", position: 0 },
      { color: "#f5af19", position: 100 },
    ],
  },
  {
    name: "Deep Space",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#000428", position: 0 },
      { color: "#004e92", position: 100 },
    ],
  },
  {
    name: "Emerald Glow",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#11998e", position: 0 },
      { color: "#38ef7d", position: 100 },
    ],
  },
  {
    name: "Cotton Candy",
    type: "linear",
    angle: 120,
    stops: [
      { color: "#ee9ca7", position: 0 },
      { color: "#ffdde1", position: 100 },
    ],
  },
  {
    name: "Midnight City",
    type: "linear",
    angle: 180,
    stops: [
      { color: "#232526", position: 0 },
      { color: "#414345", position: 100 },
    ],
  },
  {
    name: "Rainbow Wheel",
    type: "conic",
    angle: 0,
    stops: [
      { color: "#ff0000", position: 0 },
      { color: "#ff8800", position: 17 },
      { color: "#ffff00", position: 33 },
      { color: "#00ff00", position: 50 },
      { color: "#0088ff", position: 67 },
      { color: "#8800ff", position: 83 },
      { color: "#ff0000", position: 100 },
    ],
  },
  {
    name: "Lavender Mist",
    type: "linear",
    angle: 45,
    stops: [
      { color: "#c471f5", position: 0 },
      { color: "#fa71cd", position: 50 },
      { color: "#f9d423", position: 100 },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

let nextId = 100;
function getNextId() {
  return nextId++;
}

function randomHexColor(): string {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

function buildGradientCSS(
  type: GradientType,
  angle: number,
  stops: ColorStop[]
): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");

  switch (type) {
    case "linear":
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    case "radial":
      return `radial-gradient(circle, ${stopsStr})`;
    case "conic":
      return `conic-gradient(from ${angle}deg, ${stopsStr})`;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: getNextId(), color: "#667eea", position: 0 },
    { id: getNextId(), color: "#764ba2", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const gradientCSS = buildGradientCSS(gradientType, angle, stops);
  const fullCSS = `background: ${gradientCSS};`;

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullCSS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [fullCSS]);

  const addStop = useCallback(() => {
    if (stops.length >= 8) return;
    const positions = stops.map((s) => s.position).sort((a, b) => a - b);
    let newPos = 50;
    if (positions.length >= 2) {
      let maxGap = 0;
      let gapStart = 0;
      for (let i = 0; i < positions.length - 1; i++) {
        const gap = positions[i + 1] - positions[i];
        if (gap > maxGap) {
          maxGap = gap;
          gapStart = positions[i];
        }
      }
      newPos = Math.round(gapStart + maxGap / 2);
    }
    setStops((prev) => [
      ...prev,
      { id: getNextId(), color: randomHexColor(), position: newPos },
    ]);
  }, [stops]);

  const removeStop = useCallback(
    (id: number) => {
      if (stops.length <= 2) return;
      setStops((prev) => prev.filter((s) => s.id !== id));
    },
    [stops.length]
  );

  const updateStopColor = useCallback((id: number, color: string) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, color } : s)));
  }, []);

  const updateStopPosition = useCallback((id: number, position: number) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, position } : s))
    );
  }, []);

  const loadPreset = useCallback((preset: Preset) => {
    setGradientType(preset.type);
    setAngle(preset.angle);
    setStops(
      preset.stops.map((s) => ({
        id: getNextId(),
        color: s.color,
        position: s.position,
      }))
    );
    setShowPresets(false);
  }, []);

  const randomGradient = useCallback(() => {
    const types: GradientType[] = ["linear", "radial", "conic"];
    const type = types[Math.floor(Math.random() * types.length)];
    const newAngle = Math.floor(Math.random() * 360);
    const numStops = Math.floor(Math.random() * 3) + 2;
    const newStops: ColorStop[] = [];
    for (let i = 0; i < numStops; i++) {
      newStops.push({
        id: getNextId(),
        color: randomHexColor(),
        position: Math.round((i / (numStops - 1)) * 100),
      });
    }
    setGradientType(type);
    setAngle(newAngle);
    setStops(newStops);
  }, []);

  const resetGradient = useCallback(() => {
    setGradientType("linear");
    setAngle(135);
    setStops([
      { id: getNextId(), color: "#667eea", position: 0 },
      { id: getNextId(), color: "#764ba2", position: 100 },
    ]);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Paintbrush className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              GradientLab
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={randomGradient}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Random</span>
            </button>
            <button
              onClick={resetGradient}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
          {/* ── Left Column: Preview + Code ── */}
          <div className="flex flex-col gap-6">
            {/* Live Preview */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Preview
                </h2>
              </div>
              <div
                className="w-full rounded-xl border border-slate-700/50 shadow-2xl"
                style={{
                  background: gradientCSS,
                  aspectRatio: "16 / 9",
                  minHeight: "280px",
                }}
              />
            </section>

            {/* CSS Output */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  CSS Code
                </h2>
              </div>
              <div className="relative bg-[#1e293b] rounded-xl border border-slate-700/50 p-4 font-mono text-sm">
                <pre className="text-emerald-400 whitespace-pre-wrap break-all pr-12">
                  {fullCSS}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Presets Gallery */}
            <section>
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="flex items-center gap-2 mb-3 group cursor-pointer"
              >
                <Palette className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                  Preset Gallery
                </h2>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    showPresets ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showPresets && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {PRESETS.map((preset, i) => {
                    const previewCSS = buildGradientCSS(
                      preset.type,
                      preset.angle,
                      preset.stops.map((s, j) => ({
                        id: j,
                        color: s.color,
                        position: s.position,
                      }))
                    );
                    return (
                      <button
                        key={i}
                        onClick={() => loadPreset(preset)}
                        className="group flex flex-col gap-2 cursor-pointer"
                      >
                        <div
                          className="w-full aspect-video rounded-lg border border-slate-700/50 group-hover:border-indigo-500/50 transition-colors shadow-lg"
                          style={{ background: previewCSS }}
                        />
                        <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors font-medium truncate">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* ── Right Column: Controls ── */}
          <div className="flex flex-col gap-5">
            {/* Gradient Type */}
            <section className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Gradient Type
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(["linear", "radial", "conic"] as GradientType[]).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setGradientType(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors cursor-pointer ${
                        gradientType === type
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </section>

            {/* Angle Control */}
            {(gradientType === "linear" || gradientType === "conic") && (
              <section className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {gradientType === "linear" ? "Angle" : "Start Angle"}
                  </h3>
                  <span className="text-sm font-mono text-indigo-400">
                    {angle}deg
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-1.5 text-xs text-slate-600">
                  <span>0</span>
                  <span>90</span>
                  <span>180</span>
                  <span>270</span>
                  <span>360</span>
                </div>
              </section>
            )}

            {/* Color Stops */}
            <section className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Color Stops
                </h3>
                <button
                  onClick={addStop}
                  disabled={stops.length >= 8}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {/* Gradient bar preview */}
              <div
                className="w-full h-3 rounded-full mb-4 border border-slate-600/50"
                style={{
                  background: buildGradientCSS(
                    "linear",
                    90,
                    stops
                  ),
                }}
              />

              <div className="flex flex-col gap-3">
                {stops
                  .sort((a, b) => a.position - b.position)
                  .map((stop) => (
                    <div
                      key={stop.id}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3"
                    >
                      {/* Color picker */}
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-600 shrink-0">
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) =>
                            updateStopColor(stop.id, e.target.value)
                          }
                          className="w-full h-full cursor-pointer"
                        />
                      </div>

                      {/* Hex value */}
                      <input
                        type="text"
                        value={stop.color}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                            updateStopColor(stop.id, val);
                          }
                        }}
                        className="w-[5rem] sm:w-[5.5rem] px-2 py-1.5 rounded-md bg-slate-800 border border-slate-600 text-sm font-mono text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                        maxLength={7}
                      />

                      {/* Position slider */}
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={stop.position}
                          onChange={(e) =>
                            updateStopPosition(stop.id, Number(e.target.value))
                          }
                          className="flex-1 min-w-0"
                        />
                        <span className="text-xs font-mono text-slate-500 w-8 text-right shrink-0">
                          {stop.position}%
                        </span>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeStop(stop.id)}
                        disabled={stops.length <= 2}
                        className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={randomGradient}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
                >
                  <Shuffle className="w-4 h-4" />
                  Random Gradient
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy CSS
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                  {showPresets ? "Hide Presets" : "Browse Presets"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            GradientLab - CSS Gradient Generator
          </p>
          <p className="text-xs text-slate-600">
            Built with Next.js, Tailwind CSS, and Lucide Icons
          </p>
        </div>
      </footer>
    </div>
  );
}
