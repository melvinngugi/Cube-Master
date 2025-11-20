import { useState } from "react";
import useTimer from "../hooks/useTimer";
import ScrambleBar from "../components/ScrambleBar";
import CubePreview from "../components/CubePreview";
import TimerDisplay from "../components/TimerDisplay";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function TimerDashboard() {
  const { user, token } = useAuth(); // access auth state
  const [scramble, setScramble] = useState("");
  const [eventId, setEventId] = useState("333");
  const [focusMode, setFocusMode] = useState(false);

  const { time, running, solves, armed, ready } = useTimer(
    setScramble,
    setFocusMode
  );

  // store sidebar helpers (addSolve, editSolve, replaceAll)
  const [sidebarHelpers, setSidebarHelpers] = useState(null);

  // callback when TimerDisplay signals a solve finished
  const handleSolveSaved = async (newSolve) => {
    if (!user || !token) return;

    try {
      const res = await fetch("/api/v1/solves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          scramble_text: newSolve.scramble_text,
          solve_time: newSolve.solve_time, //always numeric ms
          beginner_generated_solution: null,
          advanced_generated_solution: null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // update sidebar instantly with normalized solve object
        if (sidebarHelpers?.addSolve) {
          sidebarHelpers.addSolve({
            ...newSolve,
            solve_id: data.solve_id ?? undefined,
          });
        }
      } else {
        console.error("Failed to save solve:", data);
      }
    } catch (err) {
      console.error("Error saving solve:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#B4B6B9]">
      {!focusMode && (
        <Sidebar
          solves={solves}
          user={user}
          isAuthenticated={!!token}
          setDbSolvesExternal={setSidebarHelpers} // capture helpers from Sidebar
        />
      )}
      <div className="flex flex-col flex-1 relative">
        {!focusMode && (
          <ScrambleBar
            scramble={scramble}
            setScramble={setScramble}
            eventId={eventId}
          />
        )}
        <div className="flex-1 flex items-center justify-center mt-16">
          <TimerDisplay
            time={time}
            solves={solves}
            armed={armed}
            ready={ready}
            running={running}
            focusMode={focusMode}
            scramble={scramble}
            onSolveSaved={handleSolveSaved} // parent handles DB insert
          />
        </div>
        {!focusMode && (
          <div className="absolute bottom-6 right-6">
            <CubePreview scramble={scramble} />
          </div>
        )}
      </div>
    </div>
  );
}
