import { useState, useEffect } from "react";

export default function useTimer(setScramble, setFocusMode) {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [solves, setSolves] = useState([]);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTime((t) => t + 10), 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    let holdTimeout;

    const handleKeyDown = (e) => {
      if (e.code === "Space" && !armed && !running) {
        setArmed(true);
        setTime(0); // Reset timer immediately
        setFocusMode(true); // Activate focus mode immediately
        holdTimeout = setTimeout(() => setReady(true), 500); // Ready after 0.5s
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        if (armed && ready && !running) {
          setRunning(true); // Start timer
          // Focus mode already active — no need to set again
        } else if (running) {
          setRunning(false); // Stop timer
          setFocusMode(false); // Deactivate focus mode
          setSolves((prev) => [time, ...prev]); // Record solve
          if (setScramble && typeof window.getWcaScramble === "function") {
            window.getWcaScramble("333").then(setScramble);
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
  }, [armed, ready, running, time, setScramble, setFocusMode]);

  return { time, running, solves, armed, ready };
}