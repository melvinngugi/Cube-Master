import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function useTimer(setScramble, setFocusMode) {
  const { token, user } = useAuth(); // access auth state
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [solves, setSolves] = useState([]);
  const [scrambleString, setScrambleString] = useState(""); // track current scramble text

  // Timer loop
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

  // Handle spacebar press/release
  useEffect(() => {
    let holdTimeout;

    const handleKeyDown = (e) => {
      if (e.code === "Space" && !armed && !running) {
        setArmed(true);
        setTime(0); // reset timer immediately
        setFocusMode(true); // activate focus mode immediately
        holdTimeout = setTimeout(() => setReady(true), 500); // ready after 0.5s
      }
    };

    const handleKeyUp = async (e) => {
      if (e.code === "Space") {
        if (armed && ready && !running) {
          setRunning(true); // start timer
        } else if (running) {
          setRunning(false); // stop timer
          setFocusMode(false); // deactivate focus mode

          const newSolve = {
            time,
            scramble: scrambleString,
            timestamp: new Date().toISOString(),
          };

          // always update local state
          setSolves((prev) => [newSolve, ...prev]);

          // if logged in, also save to DB
          if (token && user) {
            try {
              await fetch("/api/v1/solves", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  user_id: user.id,
                  scramble_text: scrambleString, //send scramble text
                  solve_time: time,
                  beginner_generated_solution: null,
                  advanced_generated_solution: null,
                }),
              });
            } catch (err) {
              console.error("Failed to save solve:", err);
            }
          }

          // generate next scramble
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
  }, [armed, ready, running, time, setScramble, setFocusMode, token, user, scrambleString]);

  return { time, running, solves, armed, ready };
}
