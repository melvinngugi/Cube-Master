// src/components/TimerDisplay.jsx
import { useEffect, useMemo, useRef } from "react";

export default function TimerDisplay({
  time,
  solves,
  armed,
  ready,
  running,
  focusMode,
  onSolveSaved,
  scramble,
}) {
  // Format like your original timer
  const format = (ms) => {
    const sec = Math.floor(ms / 1000);
    const dec = Math.floor((ms % 1000) / 10);
    return `${sec}.${dec.toString().padStart(2, "0")}`;
  };

  // Split main + decimal for large font layout
  const formatted = format(time);
  const [main, decimal] = formatted.split(".");

  // Color logic same as original
  let color = "text-black font-bold";
  if (armed && !ready) color = "text-red-600 font-bold";
  else if (ready && !running) color = "text-green-600 font-bold";
  else if (running) color = "text-green-600 font-bold";

  // Track previous running state to detect stop
  const prevRunningRef = useRef(false);

  useEffect(() => {
    const prevRunning = prevRunningRef.current;

    // Detect transition: running → stopped
    if (prevRunning && !running && time > 0) {
      onSolveSaved?.({
        solve_time: time,
        scramble_text: scramble,
        timestamp: new Date().toISOString(),
      });
    }

    prevRunningRef.current = running;
  }, [running, time, scramble, onSolveSaved]);

  // --- Averages (WCA style: drop fastest + slowest) ---
  const average = (count) => {
    if (solves.length < count) return null;

    const latest = solves.slice(0, count).map((s) => s.solve_time);
    const sorted = [...latest].sort((a, b) => a - b);

    // Drop best + worst
    const trimmed = sorted.slice(1, sorted.length - 1);
    const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;

    return format(Math.floor(avg));
  };

  const ao5 = useMemo(() => average(5), [solves]);
  const ao12 = useMemo(() => average(12), [solves]);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      {/* --- BIG TIMER DISPLAY (original style) --- */}
      <div className={`flex items-baseline mb-6 ${color}`}>
        <span className="text-[14rem] font-bold leading-none">{main}</span>
        <span className="text-[8rem] font-bold leading-none">.{decimal}</span>
      </div>

      {/* --- AO5 / AO12 --- */}
      {!focusMode && (
        <>
          <div className="text-[2rem] text-black">ao5: {ao5 || "-"}</div>
          <div className="text-[2rem] text-black">ao12: {ao12 || "-"}</div>
        </>
      )}
    </div>
  );
}
