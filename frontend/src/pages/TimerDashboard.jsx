import { useState } from "react";
import useTimer from "../hooks/useTimer";
import useSolves from "../hooks/useSolves";
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

  // Timer hook
  const { time, running, solves, armed, ready } = useTimer(
    setScramble,
    setFocusMode
  );

  // Unified solves cache and stats
  const {
    addSolve,
    getSolvesForCube,
    stats,
    format,
    activeCubeId,
  } = useSolves({ user, token, eventId });

  // Handle solve saved: push into cache (optimistic), backend sync inside useSolves
  const handleSolveSaved = async (newSolve) => {
    await addSolve(newSolve, eventId);
  };

  return (
    <div className="flex h-screen bg-[#B4B6B9]">
      {!focusMode && (
        <Sidebar
          solvesForActiveCube={getSolvesForCube(activeCubeId)}
          eventId={eventId}
          stats={stats}
          format={format}
        />
      )}

      <div className="flex flex-col flex-1 relative">
        {!focusMode && (
          <ScrambleBar
            scramble={scramble}
            setScramble={setScramble}
            eventId={eventId}
            setEventId={setEventId}
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
            stats={stats}
            onSolveSaved={(solve) => {
              console.log("TimerDashboard: solve saved", solve);
              addSolve(solve, eventId);
            }}
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
