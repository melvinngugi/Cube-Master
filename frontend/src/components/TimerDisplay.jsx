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
  user,
  token,
}) {
  const format = (ms) => {
    const sec = Math.floor(ms / 1000);
    const dec = Math.floor((ms % 1000) / 10);
    return `${sec}.${dec.toString().padStart(2, "0")}`;
  };

  const ao5 = solves.slice(0, 5);
  const ao12 = solves.slice(0, 12);
  const avg = (arr) =>
    arr.length === 0
      ? "00.00"
      : format(arr.reduce((a, b) => a + b, 0) / arr.length);

  const formattedTime = format(time);
  const [main, decimal] = formattedTime.split(".");

  let color = "text-black font-bold";
  if (armed && !ready) color = "text-red-600 font-bold";
  else if (ready && !running) color = "text-green-600 font-bold";
  else if (running) color = "text-green-600 font-bold";

  // Track previous running state
  const prevRunningRef = useRef(false);

  useEffect(() => {
    const prevRunning = prevRunningRef.current;

    // Detect transition: running was true, now false
    if (prevRunning && !running && time > 0) {
      const saveSolve = async () => {
        if (!user || !token) return;
        try {
          console.log("Saving solve for user_id:", user.id);
          const res = await fetch("/api/v1/solves", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: user.id,
              scramble_text: scramble,
              solve_time: time,
              beginner_generated_solution: null,
              advanced_generated_solution: null,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            console.log("Inserted scrambleId:", data.scrambleId);

            //Immediately update sidebar
            onSolveSaved?.({
              solve_id: data.solve_id ?? undefined,
              solve_time: time,
              scramble_text: scramble,
              beginner_generated_solution: null,
              advanced_generated_solution: null,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error("Failed to save solve:", err);
        }
      };

      saveSolve();
    }

    // Update ref for next render
    prevRunningRef.current = running;
  }, [running, time, scramble, user, token, onSolveSaved]);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      <div className={`flex items-baseline mb-6 ${color}`}>
        <span className="text-[14rem] font-bold leading-none">{main}</span>
        <span className="text-[8rem] font-bold leading-none">.{decimal}</span>
      </div>
      {!focusMode && (
        <>
          <div className="text-[2rem] text-black">ao5: {avg(ao5)}</div>
          <div className="text-[2rem] text-black">ao12: {avg(ao12)}</div>
        </>
      )}
    </div>
  );
}
