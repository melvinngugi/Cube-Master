import { useState, useEffect } from "react";

export default function useTimer(setScramble, setFocusMode) {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [solves, setSolves] = useState([]);
  const [scrambleString, setScrambleString] = useState("");

  //Timer loop
  useEffect(() => {
    let animationFrame;
    let startTime;

    const updateTime = () => {
      const now = Date.now();
      setTime(now - startTime);
      animationFrame = requestAnimationFrame(updateTime);
    };

    if (running) {
      startTime = Date.now();
      animationFrame = requestAnimationFrame(updateTime);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [running]);

  //Handle spacebar press/release
  useEffect(() => {
    let holdTimeout;

    const handleKeyDown = (e) => {
      if (e.code === "Space" && !armed && !running) {
        setArmed(true);
        setTime(0);                //Reset timer immediately
        setFocusMode(true);           //Activate focus mode immediately
        holdTimeout = setTimeout(() => setReady(true), 500);         //Ready after 0.5s
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        if (armed && ready && !running) {
          setRunning(true);           //Start timer
        } else if (running) {
          setRunning(false);           //Stop timer
          setFocusMode(false);         //Deactivate focus mode

          const newSolve = {
            solve_time: time,
            scramble_text: scrambleString,
            timestamp: new Date().toISOString(),
          };

          //Update local state only
          setSolves((prev) => [newSolve, ...prev]);

          //Generate next scramble
          if (setScramble && typeof window.getWcaScramble === "function") {
            window.getWcaScramble("333").then((scramble) => {
              setScramble(scramble);
              setScrambleString(scramble);
            });
          }
        }
        setArmed(false);
        setReady(false);
        clearTimeout(holdTimeout);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [armed, ready, running, time, setScramble, setFocusMode, scrambleString]);

  return { time, running, solves, armed, ready };
}
