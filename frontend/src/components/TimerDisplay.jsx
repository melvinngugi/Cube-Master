import { useEffect, useRef } from "react";

export default function TimerDisplay({
  time,
  solves,
  armed,
  ready,
  running,
  focusMode,
  onSolveSaved,
  scramble,
  stats, // pass in from parent
}) {
  // Format milliseconds into seconds.decimal
  const format = (ms) => {
    const sec = Math.floor(ms / 1000);
    const dec = Math.floor((ms % 1000) / 10);
    return `${sec}.${dec.toString().padStart(2, "0")}`;
  };

  // Split main + decimal for large font layout
  const formatted = format(time);
  const [main, decimal] = formatted.split(".");

  // Color logic
  let color = "text-black font-bold";
  if (armed && !ready) color = "text-red-600 font-bold";
  else if (ready && !running) color = "text-green-600 font-bold";
  else if (running) color = "text-green-600 font-bold";

  // Track previous running state to detect stop
  const prevRunningRef = useRef(false);

  useEffect(() => {
    const prevRunning = prevRunningRef.current;
    if (prevRunning && !running && time > 0) {
      console.log("Timer stopped, saving solve", { time, scramble });
      onSolveSaved?.({
        solve_time: time,
        scramble_text: scramble,
        timestamp: new Date().toISOString(),
      });
    }
    prevRunningRef.current = running;
  }, [running, time, scramble, onSolveSaved]);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      {/* --- BIG TIMER DISPLAY --- */}
      <div className={`flex items-baseline mb-6 ${color}`}>
        <span className="text-[14rem] font-bold leading-none">{main}</span>
        <span className="text-[8rem] font-bold leading-none">.{decimal}</span>
      </div>

      {/* --- AO5 / AO12 --- */}
      {!focusMode && (
        <>
          <div className="text-[2rem] text-black">ao5: {stats?.currentAo5 || "-"}</div>
          <div className="text-[2rem] text-black">ao12: {stats?.currentAo12 || "-"}</div>
        </>
      )}
    </div>
  );
}
