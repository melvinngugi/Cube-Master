import { useState } from "react";
import useTimer from "../hooks/useTimer";
import ScrambleBar from "../components/ScrambleBar";
import CubePreview from "../components/CubePreview";
import TimerDisplay from "../components/TimerDisplay";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function TimerDashboard() {
  const { user, token } = useAuth();
  const [scramble, setScramble] = useState("");
  const [eventId, setEventId] = useState("333"); // default cube type
  const [focusMode, setFocusMode] = useState(false);

  // Sidebar helper functions (addSolve, editSolve, replaceAll)
  const [sidebarHelpers, setSidebarHelpers] = useState(null);

  // Timer hook
  const { time, running, solves, armed, ready } = useTimer(
    setScramble,
    setFocusMode
  );

  // Save a solve to the backend and update sidebar immediately
  const handleSolveSaved = async (newSolve) => {
    if (!user || !token) return;

    // Map eventId → CUBE_ID in DB
    const cubeMap = { "333": 1, "222": 2, pyram: 3 };
    const cubeId = cubeMap[eventId] ?? 1;

    try {
      // Only attach generated solutions for 3×3
      const beginnerSolution =
        eventId === "333" ? newSolve.beginner_generated_solution ?? null : null;
      const advancedSolution =
        eventId === "333" ? newSolve.advanced_generated_solution ?? null : null;

      const res = await fetch("/api/v1/solves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          scramble_text: newSolve.scramble_text,
          solve_time: newSolve.solve_time,
          cube_id: cubeId, // always send cube_id
          beginner_generated_solution: beginnerSolution,
          advanced_generated_solution: advancedSolution,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update sidebar instantly with cube_id
        sidebarHelpers?.addSolve?.({
          ...newSolve,
          solve_id: data.solve_id ?? undefined,
          cube_id: cubeId,
          beginner_generated_solution: beginnerSolution,
          advanced_generated_solution: advancedSolution,
        });
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
          setDbSolvesExternal={setSidebarHelpers}
          eventId={eventId} // pass current cube type for filtering
        />
      )}

      <div className="flex flex-col flex-1 relative">
        {!focusMode && (
          <ScrambleBar
            scramble={scramble}
            setScramble={setScramble}
            eventId={eventId}
            setEventId={setEventId} // pass setter to dropdown
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
            onSolveSaved={handleSolveSaved}
          />
        </div>

        {!focusMode && (
          <div className="absolute bottom-6 right-6">
            <CubePreview scramble={scramble} eventId={eventId} />
          </div>
        )}
      </div>
    </div>
  );
}
